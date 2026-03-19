import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();

    const [
      totalItems,
      lostItems,
      foundItems,
      returnedItems,
      recentItems,
      topCategories,
      totalUsers,
      activeUsers,
    ] = await Promise.all([
      Item.countDocuments(),
      Item.countDocuments({ type: 'Lost', status: 'Open' }),
      Item.countDocuments({ type: 'Found', status: 'Open' }),
      Item.countDocuments({ status: { $in: ['Returned', 'Claimed'] } }),
      Item.find()
        .populate('postedBy', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Item.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      User.countDocuments(),
      User.countDocuments({ itemsPosted: { $gt: 0 } }),
    ]);

    const successRate = totalItems > 0 ? ((returnedItems / totalItems) * 100).toFixed(1) : 0;

    return NextResponse.json({
      stats: {
        totalItems,
        lostItems,
        foundItems,
        returnedItems,
        successRate,
        totalUsers,
        activeUsers,
      },
      recentItems,
      topCategories,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { message: error.message || 'Error fetching statistics' },
      { status: 500 }
    );
  }
}
