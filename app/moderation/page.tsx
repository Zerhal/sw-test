import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ModerationQueue from '@/components/ModerationQueue';

export default async function ModerationPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
    redirect('/');
  }

  const pendingTutorials = await prisma.tutorial.findMany({
    where: { status: 'PENDING' },
    include: { author: true },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Moderation Queue</h1>
      <ModerationQueue tutorials={pendingTutorials} />
    </div>
  );
}