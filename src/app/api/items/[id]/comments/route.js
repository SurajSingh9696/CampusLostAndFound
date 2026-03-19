import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const userId = getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { message: user.blockedReason || 'Your account has been blocked by an administrator' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { message: 'Comment text is required' },
        { status: 400 }
      );
    }

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    const comment = {
      user: userId,
      text: text.trim(),
      createdAt: new Date(),
    };

    item.comments.push(comment);
    await item.save();

    const updatedItem = await Item.findById(id)
      .populate('comments.user', 'name avatar')
      .lean();

    return NextResponse.json({
      message: 'Comment added successfully',
      comments: updatedItem.comments,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { message: error.message || 'Error adding comment' },
      { status: 500 }
    );
  }
}
