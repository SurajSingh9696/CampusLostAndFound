import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    await dbConnect();
    
    const userId = getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).select('-password');
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

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: error.message || 'Error fetching user' },
      { status: 500 }
    );
  }
}
