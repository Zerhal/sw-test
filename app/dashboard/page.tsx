import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { tutorials: true },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Your Tutorials</h2>
      {user?.tutorials.length ? (
        <ul className="space-y-4">
          {user.tutorials.map((tutorial) => (
            <li key={tutorial.id} className="border p-4 rounded-lg">
              <h3 className="text-xl font-semibold">{tutorial.title}</h3>
              <p>Status: {tutorial.status}</p>
              <Button asChild className="mt-2">
                <Link href={`/tutorials/${tutorial.id}`}>View</Link>
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't created any tutorials yet.</p>
      )}
      <Button asChild className="mt-6">
        <Link href="/create">Create New Tutorial</Link>
      </Button>
    </div>
  );
}