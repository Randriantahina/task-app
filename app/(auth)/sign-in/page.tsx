'use client';
import { useState, ChangeEvent } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';

const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      console.log('Tentative de connexion avec :', email, password);
      const res = await signInWithEmailAndPassword(email, password);

      if (!res || !res.user) {
        console.warn('Aucun utilisateur trouvé');
        return;
      }

      const uid = res.user.uid;

      // 🔍 Vérifie si le document utilisateur existe dans Firestore
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.warn(" L'utilisateur n'existe pas dans Firestore !");
        alert("Ce compte n'est pas encore enregistré dans la base de données.");
        return;
      }

      // ✅ Connexion et utilisateur trouvé dans Firestore
      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (e) {
      console.error('Erreur lors de la connexion :', e);
      alert('Erreur de connexion. Vérifiez votre email et mot de passe.');
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5 text-center">Sign In</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />

        <button
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          {loading ? 'Connexion...' : 'Sign In'}
        </button>

        {error && (
          <p className="text-red-500 mt-4 text-sm">Erreur : {error.message}</p>
        )}

        <div className="text-center">
          <Button asChild variant="link">
            <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
