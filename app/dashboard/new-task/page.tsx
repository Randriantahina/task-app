'use client';

import Nav from '@/src/components/Nav';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { Person } from '@/src/components/Person';
import { Task } from '@/src/components/Task';
import { Button } from '@/src/components/ui/button';
import { db } from '@/src/lib/firebase';
import { useSelectionStore } from '@/src/lib/useStore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { toast } from 'sonner';
import Loading from '@/src/components/Loading';

export default function NewTaskPage() {
  const { persons, tasks } = useSelectionStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!persons.length || !tasks.length) {
      toast.warning(
        'Veuillez sélectionner au moins une tâche et une personne.'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks, persons }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Erreur API lors de la génération');
      }

      const data = await res.json();
      const result = data.result;

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Vous devez être connecté pour valider');
      }

      await addDoc(collection(db, 'assignments'), {
        result,
        createdAt: serverTimestamp(),
        uid: user.uid,
      });

      toast.success('Répartition enregistrée !');
      setTimeout(() => {
        router.push('/dashboard/acceuil');
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        toast.error(err.message || 'Une erreur est survenue.');
      } else {
        console.error(err);
        toast.error('Une erreur est survenue.');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 md:p-8">
        {/* La disposition s'adapte avec flex-col sur mobile et flex-row sur md+ */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
          <Person />
          <Task />
        </div>
        {/* La largeur du bouton est responsive */}
        <Button
          className="mt-8 w-full max-w-xs mx-auto"
          onClick={handleSubmit}
          disabled={loading}
        >
          Valider
        </Button>
      </div>
    </>
  );
}
