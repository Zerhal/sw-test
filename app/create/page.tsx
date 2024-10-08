import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import TutorialForm from '@/components/TutorialForm';

export default async function CreateTutorial() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <div>Please sign in to create a tutorial.</div>;
  }

  async function createTutorial(data: { title: string; content: string }) {
    'use server'
    const tutorial = await prisma.tutorial.create({
      data: {
        ...data,
        authorId: session.user.id,
        status: session.user.role === 'USER' ? 'PENDING' : 'APPROVED',
      },
    });
    redirect('/dashboard');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Tutorial</h1>
      <TutorialForm onSubmit={createTutorial} />
    </div>
  );
}