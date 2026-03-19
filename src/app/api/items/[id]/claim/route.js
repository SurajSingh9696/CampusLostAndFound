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

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    if (item.status !== 'Open') {
      return NextResponse.json(
        { message: 'This item is no longer available' },
        { status: 400 }
      );
    }

    // Update item status
    item.status = 'Claimed';
    item.claimedBy = userId;
    item.claimedAt = new Date();
    await item.save();

    // Update poster's reputation
    const poster = await User.findById(item.postedBy);
    if (poster) {
      poster.itemsReturned = (poster.itemsReturned || 0) + 1;
      poster.reputation = (poster.reputation || 0) + 10;
      await poster.save();
    }

    // Update claimer's reputation
    const claimer = await User.findById(userId);
    if (claimer) {
      claimer.reputation = (claimer.reputation || 0) + 5;
      await claimer.save();
    }

    const updatedItem = await Item.findById(id)
      .populate('postedBy', 'name email avatar')
      .populate('claimedBy', 'name email avatar')
      .lean();

    return NextResponse.json({
      message: 'Item claimed successfully',
      item: updatedItem,
    });
  } catch (error) {
    console.error('Claim item error:', error);
    return NextResponse.json(
      { message: error.message || 'Error claiming item' },
      { status: 500 }
    );
  }
}
