import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
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
    const role = searchParams.get('role') || '';
    const accountStatus = searchParams.get('accountStatus') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);

    const query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
        { studentId: { $regex: q, $options: 'i' } },
      ];
    }

    if (role && ['admin', 'student'].includes(role)) {
      query.role = role;
    }

    if (accountStatus === 'blocked') {
      query.isBlocked = true;
    }

    if (accountStatus === 'active') {
      query.isBlocked = false;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .populate('blockedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { message: error.message || 'Error fetching users' },
      { status: 500 }
    );
  }
}
