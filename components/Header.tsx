import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from './ui/button';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-primary text-primary-foreground">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Summoner Wars Tutorials
        </Link>
        <div>
          {session ? (
            <>
              <Link href="/dashboard" className="mr-4">
                Dashboard
              </Link>
              <Button onClick={() => signOut()}>Sign out</Button>
            </>
          ) : (
            <Button onClick={() => signIn()}>Sign in</Button>
          )}
        </div>
      </nav>
    </header>
  );
}