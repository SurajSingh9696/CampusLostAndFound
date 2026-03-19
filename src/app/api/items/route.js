import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';
import QRCode from 'qrcode';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const q = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || '-createdAt';

    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Item.find(query)
        .populate('postedBy', 'name email avatar department studentId')
        .populate('claimedBy', 'name email')
        .sort(sort)
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
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get items error:', error);
    return NextResponse.json(
      { message: error.message || 'Error fetching items' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const userId = getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      category,
      location,
      building,
      floor,
      date,
      time,
      imageData,
      contactEmail,
      contactPhone,
      priority,
      tags,
      reward,
      identifyingFeatures,
    } = body;

    // Validation
    if (!title || !description || !type || !category || !location || !date || !time) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Get user info
    const user = await User.findById(userId);
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

    // Create item
    const item = await Item.create({
      title,
      description,
      type,
      category,
      location,
      building: building || '',
      floor: floor || '',
      date,
      time,
      imageData: imageData || '',
      contactEmail: contactEmail || user.email,
      contactPhone: contactPhone || user.phone || '',
      priority: priority || 'Medium',
      tags: tags || [],
      reward: reward || '',
      identifyingFeatures: identifyingFeatures || '',
      postedBy: userId,
    });

    // Generate QR code
    const itemUrl = `${process.env.NEXT_PUBLIC_APP_URL}/items/${item._id}`;
    const qrCodeData = await QRCode.toDataURL(itemUrl);
    item.qrCode = qrCodeData;
    await item.save();

    // Update user stats
    user.itemsPosted = (user.itemsPosted || 0) + 1;
    user.reputation = (user.reputation || 0) + 5;
    await user.save();

    const populatedItem = await Item.findById(item._id)
      .populate('postedBy', 'name email avatar department studentId')
      .lean();

    return NextResponse.json(
      {
        message: 'Item created successfully',
        item: populatedItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create item error:', error);
    return NextResponse.json(
      { message: error.message || 'Error creating item' },
      { status: 500 }
    );
  }
}
