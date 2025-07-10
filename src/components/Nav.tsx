'use client';

import LogoMdc from '../../public/next.svg';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LogOut } from 'lucide-react';
import { Home, PlusSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Nav() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [userSession, setUserSession] = useState<string | null>(null);

  // Récupérer la session côté client uniquement
  useEffect(() => {
    setUserSession(sessionStorage.getItem('user'));
  }, []);

  // Redirection si pas connecté ni session
  useEffect(() => {
    if (user === null && !userSession) {
      router.push('/sign-in');
    }
  }, [user, userSession, router]);

  return (
    <nav className="max-w-[1200px] w-full mx-auto h-[60px] flex items-center justify-between p-5 border  my-6 rounded-md  border-gray-300">
      <div>
        {user && user.displayName ? (
          <span className="text-lg font-semibold text-gray-800">
            Bienvenu, {user.displayName ?? user.email}!
          </span>
        ) : (
          <Link href="/">
            <Image
              width={30}
              height={30}
              src={LogoMdc}
              className="w-12 h-12"
              alt=""
            />
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Lien vers l'accueil */}
        <Link
          href="/dashboard/acceuil"
          className="text-gray-700 hover:text-indigo-600 font-medium"
        >
          Acceuil
        </Link>
        {/* Lien vers la création de tâche */}
        <Link
          href="/dashboard/new-task"
          className="text-gray-700 hover:text-indigo-600 font-medium"
        >
          New task
        </Link>

        <Button
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem('user');
            router.push('/sign-in'); // tu peux rediriger après logout aussi
          }}
        >
          <LogOut />
        </Button>
      </div>
    </nav>
  );
}
