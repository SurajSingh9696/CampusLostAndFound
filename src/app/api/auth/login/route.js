import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { message: user.blockedReason || 'Your account has been blocked by an administrator' },
        { status: 403 }
      );
    }

    const token = signToken(user._id);

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department: user.department,
        studentId: user.studentId,
        avatar: user.avatar,
        isBlocked: user.isBlocked,
        itemsPosted: user.itemsPosted,
        itemsReturned: user.itemsReturned,
        reputation: user.reputation,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error.message || 'Error logging in' },
      { status: 500 }
    );
  }
}
