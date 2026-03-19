import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import { getUserFromRequest } from '@/lib/auth';

export async function getRequestUser(request) {
  const userId = getUserFromRequest(request);

  if (!userId) {
    return { error: 'Unauthorized', status: 401 };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  return { user };
}

export async function requireAdmin(request) {
  const { user, error, status } = await getRequestUser(request);

  if (error) {
    return { error, status };
  }

  if (user.isBlocked) {
    return { error: 'Your account is blocked. Contact administrator.', status: 403 };
  }

  if (user.role !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }

  return { user };
}

export async function createAdminLog({ actorId, action, targetUserId, targetItemId, details, metadata = {} }) {
  try {
    await ActivityLog.create({
      actor: actorId,
      action,
      targetUser: targetUserId || undefined,
      targetItem: targetItemId || undefined,
      details: details || '',
      metadata,
    });
  } catch (error) {
    console.error('Create activity log error:', error);
  }
}
