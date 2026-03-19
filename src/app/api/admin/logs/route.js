import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';
import { requireAdmin } from '@/lib/admin';

export async function GET(request) {
  try {
    await dbConnect();

    const { error, status } = await requireAdmin(request);
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const query = {};
    if (action) {
      query.action = action;
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('actor', 'name email role')
        .populate('targetUser', 'name email role isBlocked')
        .populate('targetItem', 'title type status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(query),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('Admin logs error:', error);
    return NextResponse.json(
      { message: error.message || 'Error fetching activity logs' },
      { status: 500 }
    );
  }
}
