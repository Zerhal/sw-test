import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Tutorials() {
  const tutorials = await prisma.tutorial.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Summoner Wars Tutorials</h1>
      <div className="space-y-6">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="border p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">{tutorial.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              By {tutorial.author.name} on {new Date(tutorial.createdAt).toLocaleDateString()}
            </p>
            <p className="mb-4">{tutorial.content.substring(0, 150)}...</p>
            <Button asChild>
              <Link href={`/tutorials/${tutorial.id}`}>Read More</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}