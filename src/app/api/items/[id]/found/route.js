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

    const finder = await User.findById(userId);
    if (!finder) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (finder.isBlocked) {
      return NextResponse.json(
        { message: finder.blockedReason || 'Your account has been blocked by an administrator' },
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

    if (item.type !== 'Lost') {
      return NextResponse.json(
        { message: 'This action is only available for lost items' },
        { status: 400 }
      );
    }

    // Check if user already reported finding this item
    const alreadyReported = item.foundReports.some(
      report => report.user.toString() === userId
    );

    if (alreadyReported) {
      return NextResponse.json(
        { message: 'You have already reported finding this item' },
        { status: 400 }
      );
    }

    // Add to foundReports array
    item.foundReports.push({
      user: userId,
      foundAt: new Date(),
    });

    // If this is the first found report, mark item as Claimed and update poster's stats
    if (item.foundReports.length === 1 && item.status === 'Open') {
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

      // Update finder's reputation
      finder.reputation = (finder.reputation || 0) + 5;
      await finder.save();
    }

    await item.save();

    // Create notification for item poster
    if (item.postedBy.toString() !== userId) {
      await Notification.create({
        recipient: item.postedBy,
        sender: userId,
        item: item._id,
        type: 'found',
        message: `${finder.name} reported finding your lost item: ${item.title}`,
      });
    }

    const updatedItem = await Item.findById(id)
      .populate('postedBy', 'name email avatar')
      .populate('claimedBy', 'name email avatar')
      .populate('foundReports.user', 'name email avatar phone department studentId')
      .lean();

    return NextResponse.json({
      message: 'Found report submitted successfully',
      item: updatedItem,
    });
  } catch (error) {
    console.error('Report found item error:', error);
    return NextResponse.json(
      { message: error.message || 'Error reporting found item' },
      { status: 500 }
    );
  }
}
