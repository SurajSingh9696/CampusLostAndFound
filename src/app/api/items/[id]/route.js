import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const item = await Item.findById(id)
      .populate('postedBy', 'name email avatar phone department studentId reputation')
      .populate('claimedBy', 'name email')
      .populate('comments.user', 'name avatar')
      .lean();

    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    // Increment views
    await Item.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return NextResponse.json({ item: { ...item, views: item.views + 1 } });
  } catch (error) {
    console.error('Get item error:', error);
    return NextResponse.json(
      { message: error.message || 'Error fetching item' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);

    // Check authorization
    if (item.postedBy.toString() !== userId && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized to update this item' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData = { ...body, updatedAt: Date.now() };

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('postedBy', 'name email avatar department studentId')
      .populate('claimedBy', 'name email')
      .lean();

    return NextResponse.json({
      message: 'Item updated successfully',
      item: updatedItem,
    });
  } catch (error) {
    console.error('Update item error:', error);
    return NextResponse.json(
      { message: error.message || 'Error updating item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);

    // Check authorization
    if (item.postedBy.toString() !== userId && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized to delete this item' },
        { status: 403 }
      );
    }

    await Item.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    return NextResponse.json(
      { message: error.message || 'Error deleting item' },
      { status: 500 }
    );
  }
}
