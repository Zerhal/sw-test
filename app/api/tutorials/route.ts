import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await request.json();

  try {
    const tutorial = await prisma.tutorial.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        status: session.user.role === 'USER' ? 'PENDING' : 'APPROVED',
      },
    });

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error('Error creating tutorial:', error);
    return NextResponse.json({ error: 'Error creating tutorial' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    const tutorials = await prisma.tutorial.findMany({
      where: status ? { status: status as any } : {},
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tutorials);
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return NextResponse.json({ error: 'Error fetching tutorials' }, { status: 500 });
  }
}