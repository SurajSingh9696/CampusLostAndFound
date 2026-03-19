import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import { requireAdmin } from '@/lib/admin';

export async function GET(request) {
  try {
    await dbConnect();

    const { error, status } = await requireAdmin(request);
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const itemStatus = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);

    const query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }

    if (type && ['Lost', 'Found'].includes(type)) {
      query.type = type;
    }

    if (itemStatus) {
      query.status = itemStatus;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Item.find(query)
        .populate('postedBy', 'name email role isBlocked')
        .populate('claimedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Item.countDocuments(query),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('Admin items error:', error);
    return NextResponse.json(
      { message: error.message || 'Error fetching items' },
      { status: 500 }
    );
  }
}
