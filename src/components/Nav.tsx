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
import { useEffect, useState } from 'react';
import Loading from './Loading';

export default function Nav() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userSession, setUserSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserSession(sessionStorage.getItem('user'));
  }, []);

  useEffect(() => {
    if (user === null && !userSession) {
      router.push('/sign-in');
    }
  }, [user, userSession, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <nav className="max-w-[1200px] w-full mx-auto h-auto flex flex-col md:flex-row items-center justify-between p-5 border my-6 rounded-md border-gray-300 gap-4 md:gap-0">
      <div>
        <h1 className="font-bold text-lg text-center md:text-left">
          Bienvenue dans Task
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Lien vers l'accueil */}
        <button
          onClick={() => {
            setLoading(true);
            router.push('/dashboard/acceuil');
          }}
          className="text-gray-700 hover:text-indigo-600 font-medium"
        >
          Accueil
        </button>

        {/* Redirection vers tâche avec Loading */}
        <button
          onClick={() => {
            setLoading(true);
            router.push('/dashboard/new-task');
          }}
          className="text-gray-700 hover:text-indigo-600 font-medium"
        >
          Tâche
        </button>

        <Button
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem('user');
            router.push('/sign-in');
          }}
        >
          <LogOut />
        </Button>
      </div>
    </nav>
  );
}
