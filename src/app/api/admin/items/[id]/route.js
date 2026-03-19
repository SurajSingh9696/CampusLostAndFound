import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import { createAdminLog, requireAdmin } from '@/lib/admin';

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

    const item = await Item.findById(id)
      .populate('postedBy', 'name email')
      .lean();

    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    await Item.findByIdAndDelete(id);

    await createAdminLog({
      actorId: admin._id,
      action: 'item.delete',
      targetItemId: item._id,
      targetUserId: item.postedBy?._id,
      details: reason || `${admin.name} deleted item ${item.title}`,
      metadata: {
        reason: reason || '',
        deletedItem: {
          id: item._id.toString(),
          title: item.title,
          type: item.type,
          status: item.status,
        },
      },
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Admin item delete error:', error);
    return NextResponse.json(
      { message: error.message || 'Error deleting item' },
      { status: 500 }
    );
  }
}
