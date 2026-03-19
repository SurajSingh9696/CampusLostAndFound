import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import { requireAdmin } from '@/lib/admin';

export async function GET(request) {
  try {
    await dbConnect();

    const { error, status } = await requireAdmin(request);
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    const [
      totalUsers,
      blockedUsers,
      adminUsers,
      totalItems,
      openItems,
      claimedItems,
      returnedItems,
      closedItems,
      recentLogs,
      recentItems,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBlocked: true }),
      User.countDocuments({ role: 'admin' }),
      Item.countDocuments(),
      Item.countDocuments({ status: 'Open' }),
      Item.countDocuments({ status: 'Claimed' }),
      Item.countDocuments({ status: 'Returned' }),
      Item.countDocuments({ status: 'Closed' }),
      ActivityLog.find()
        .populate('actor', 'name email role')
        .populate('targetUser', 'name email')
        .populate('targetItem', 'title type status')
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
      Item.find()
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
    ]);

    return NextResponse.json({
      summary: {
        totalUsers,
        blockedUsers,
        activeUsers: totalUsers - blockedUsers,
        adminUsers,
        totalItems,
        openItems,
        claimedItems,
        returnedItems,
        closedItems,
      },
      recentLogs,
      recentItems,
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return NextResponse.json(
      { message: error.message || 'Error fetching admin overview' },
      { status: 500 }
    );
  }
}
