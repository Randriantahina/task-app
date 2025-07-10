'use client';
import { useState, ChangeEvent } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/src/lib/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      if (!res || !res.user) {
        console.warn('Erreur création utilisateur');
        return;
      }

      const uid = res.user.uid;
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      // Si l'utilisateur n'existe pas déjà dans Firestore, on le crée
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: res.user.email,
          createdAt: new Date(),
        });
      }

      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');
      router.push('/'); // Redirige vers page d'accueil
    } catch (e) {
      console.error('Erreur inscription :', e);
      alert('Impossible de créer un compte.');
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
        <h1 className="text-white text-2xl mb-5 text-center">Sign Up</h1>

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
          onClick={handleSignUp}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          {loading ? 'Création...' : 'Sign Up'}
        </button>

        {error && (
          <p className="text-red-500 mt-4 text-sm">Erreur : {error.message}</p>
        )}
        <div className="text-center text-white">
          <Button asChild variant="link">
            <Link href="/sign-in">Already have an account? Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
