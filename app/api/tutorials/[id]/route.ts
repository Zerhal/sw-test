import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { status } = await request.json();

  try {
    const tutorial = await prisma.tutorial.update({
      where: { id: params.id },
      data: { status, published: status === 'APPROVED' },
    });

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error('Error updating tutorial:', error);
    return NextResponse.json({ error: 'Error updating tutorial' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { id: params.id },
    });

    if (!tutorial) {
      return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 });
    }

    if (tutorial.authorId !== session.user.id && !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.tutorial.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Tutorial deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutorial:', error);
    return NextResponse.json({ error: 'Error deleting tutorial' }, { status: 500 });
  }
}