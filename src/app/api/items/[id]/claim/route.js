import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import Notification from '@/models/Notification';
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

    const claimer = await User.findById(userId);
    if (!claimer) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (claimer.isBlocked) {
      return NextResponse.json(
        { message: claimer.blockedReason || 'Your account has been blocked by an administrator' },
        { status: 403 }
      );
    }

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    if (item.type !== 'Found') {
      return NextResponse.json(
        { message: 'This action is only available for found items' },
        { status: 400 }
      );
    }

    // Check if user already claimed this item
    const alreadyClaimed = item.claims.some(
      claim => claim.user.toString() === userId
    );

    if (alreadyClaimed) {
      return NextResponse.json(
        { message: 'You have already claimed this item' },
        { status: 400 }
      );
    }

    // Add to claims array
    item.claims.push({
      user: userId,
      claimedAt: new Date(),
    });

    // If this is the first claim, mark item as Claimed and update poster's stats
    if (item.claims.length === 1 && item.status === 'Open') {
      item.status = 'Claimed';
      item.claimedBy = userId;
      item.claimedAt = new Date();

      // Update poster's reputation
      const poster = await User.findById(item.postedBy);
      if (poster) {
        poster.itemsReturned = (poster.itemsReturned || 0) + 1;
        poster.reputation = (poster.reputation || 0) + 10;
        await poster.save();
      }

      // Update claimer's reputation
      claimer.reputation = (claimer.reputation || 0) + 5;
      await claimer.save();
    }

    await item.save();

    // Create notification for item poster
    if (item.postedBy.toString() !== userId) {
      await Notification.create({
        recipient: item.postedBy,
        sender: userId,
        item: item._id,
        type: 'claim',
        message: `${claimer.name} claimed your found item: ${item.title}`,
      });
    }

    const updatedItem = await Item.findById(id)
      .populate('postedBy', 'name email avatar')
      .populate('claimedBy', 'name email avatar')
      .populate('claims.user', 'name email avatar phone department studentId')
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
