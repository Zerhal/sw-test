import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Summoner Wars Tutorials</h1>
      <p className="text-xl mb-8">Learn strategies, share your knowledge, and improve your game!</p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/tutorials">Browse Tutorials</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/create">Create Tutorial</Link>
        </Button>
      </div>
    </div>
  );
}