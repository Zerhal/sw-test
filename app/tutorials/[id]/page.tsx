import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function TutorialPage({ params }: { params: { id: string } }) {
  const tutorial = await prisma.tutorial.findUnique({
    where: { id: params.id },
    include: { author: true },
  });

  if (!tutorial) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{tutorial.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        By {tutorial.author.name} on {new Date(tutorial.createdAt).toLocaleDateString()}
      </p>
      <div className="prose max-w-none">
        {tutorial.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </div>
  );
}