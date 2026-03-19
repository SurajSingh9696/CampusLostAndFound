import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Item from '@/models/Item';
import { createAdminLog, requireAdmin } from '@/lib/admin';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    const { user: admin, error, status } = await requireAdmin(request);
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, reason } = body;

    if (!['block', 'unblock', 'make-admin', 'make-student'].includes(action)) {
      return NextResponse.json(
        { message: 'Invalid action' },
        { status: 400 }
      );
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (targetUser._id.toString() === admin._id.toString() && ['block', 'make-student'].includes(action)) {
      return NextResponse.json(
        { message: 'You cannot remove your own admin access or block yourself' },
        { status: 400 }
      );
    }

    const previousRole = targetUser.role;

    if (action === 'block') {
      targetUser.isBlocked = true;
      targetUser.blockedAt = new Date();
      targetUser.blockedReason = (reason || '').trim();
      targetUser.blockedBy = admin._id;
    }

    if (action === 'unblock') {
      targetUser.isBlocked = false;
      targetUser.blockedAt = undefined;
      targetUser.blockedReason = '';
      targetUser.blockedBy = undefined;
    }

    if (action === 'make-admin') {
      targetUser.role = 'admin';
    }

    if (action === 'make-student') {
      targetUser.role = 'student';
    }

    await targetUser.save();

    await createAdminLog({
      actorId: admin._id,
      action: `user.${action}`,
      targetUserId: targetUser._id,
      details: reason || `${admin.name} performed ${action} on ${targetUser.email}`,
      metadata: {
        reason: reason || '',
        previousRole: action.includes('make-') ? previousRole : undefined,
        currentRole: targetUser.role,
        isBlocked: targetUser.isBlocked,
      },
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user: await User.findById(targetUser._id).select('-password').populate('blockedBy', 'name email').lean(),
    });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { message: error.message || 'Error updating user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { user: admin, error, status } = await requireAdmin(request);
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (targetUser._id.toString() === admin._id.toString()) {
      return NextResponse.json(
        { message: 'You cannot delete your own account from admin panel' },
        { status: 400 }
      );
    }

    const [deletedItemsResult] = await Promise.all([
      Item.deleteMany({ postedBy: targetUser._id }),
      Item.updateMany(
        { claimedBy: targetUser._id },
        {
          $set: {
            claimedBy: null,
            claimedAt: null,
            status: 'Open',
          },
        }
      ),
      Item.updateMany(
        { 'comments.user': targetUser._id },
        {
          $pull: {
            comments: {
              user: targetUser._id,
            },
          },
        }
      ),
    ]);

    await User.findByIdAndDelete(targetUser._id);

    await createAdminLog({
      actorId: admin._id,
      action: 'user.delete',
      details: reason || `${admin.name} deleted ${targetUser.email}`,
      metadata: {
        reason: reason || '',
        deletedUser: {
          id: targetUser._id.toString(),
          email: targetUser.email,
          role: targetUser.role,
        },
        deletedItemsCount: deletedItemsResult.deletedCount || 0,
      },
    });

    return NextResponse.json({
      message: 'User deleted successfully',
      deletedItems: deletedItemsResult.deletedCount || 0,
    });
  } catch (error) {
    console.error('Admin user delete error:', error);
    return NextResponse.json(
      { message: error.message || 'Error deleting user' },
      { status: 500 }
    );
  }
}
