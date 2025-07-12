'use client';
import { useState, ChangeEvent } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/src/lib/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/src/components/Loading';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [createUserWithEmailAndPassword, , loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);

      if (!res || !res.user) {
        toast.error('Erreur lors de la création du compte.');
        return;
      }

      const uid = res.user.uid;
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: res.user.email,
          createdAt: new Date(),
        });
      }

      toast.success('Compte créé avec succès !');
      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');
      router.push('/sign-in');
    } catch (e) {
      console.error('Erreur inscription :', e);
      toast.error('Impossible de créer un compte. Vérifiez les informations.');
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Container responsive */}
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h1 className="text-white text-2xl mb-5 text-center">Inscription</h1>

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

        {/* Bouton d'inscription */}
        <button
          onClick={handleSignUp}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500 transition-colors duration-200"
        >
          S&rsquo;inscrire
        </button>

        {/* Affichage erreur */}
        {error && (
          <p className="text-red-500 mt-4 text-sm">Erreur : {error.message}</p>
        )}

        {/* Lien de connexion */}
        <div className="mt-4 text-center">
          <Button asChild variant="link">
            <Link href="/sign-in" className="text-white hover:underline">
              Vous avez déjà un compte ? Se connecter
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
