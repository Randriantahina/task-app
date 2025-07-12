'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import {
  useSignInWithEmailAndPassword,
  useAuthState,
} from 'react-firebase-hooks/auth';

import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/src/components/Loading';

const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [signInWithEmailAndPassword, , signInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);

  const [user, authLoading] = useAuthState(auth);

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard/acceuil');
    }
  }, [user, authLoading, router]);

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);

      if (!res || !res.user) {
        toast.warning('Aucun utilisateur trouvé.');
        return;
      }

      const uid = res.user.uid;

      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        toast.error(
          "Ce compte n'est pas encore enregistré dans la base de données."
        );
        return;
      }

      toast.success('Connexion réussie !');
      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');
    } catch (e) {
      console.error('Erreur lors de la connexion :', e);
      toast.error('Erreur de connexion. Vérifiez votre email et mot de passe.');
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  if (authLoading || signInLoading) {
    return <Loading />;
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Container responsive */}
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h1 className="text-white text-2xl mb-5 text-center font-pacifico">
          Connexion
        </h1>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />

        {/* Password input avec bouton toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500 pr-10"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            tabIndex={-1}
            aria-label={
              showPassword
                ? 'Masquer le mot de passe'
                : 'Afficher le mot de passe'
            }
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Bouton de connexion */}
        <button
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500 transition-colors duration-200"
        >
          Connexion
        </button>

        {/* Affichage erreur si erreur de signin */}
        {signInError && (
          <p className="text-red-500 mt-4 text-sm">
            Erreur : {signInError.message}
          </p>
        )}

        {/* Lien d'inscription */}
        <div className="mt-4 text-center">
          <Button asChild variant="link">
            <Link href="/sign-up" className="text-white hover:underline">
              Pas de compte ? S'inscrire
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
