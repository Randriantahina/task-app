'use client';

import Nav from '@/src/components/Nav';
import { Person } from '@/src/components/Person';
import { Task } from '@/src/components/Task';
import { Button } from '@/src/components/ui/button';
import { db } from '@/src/lib/firebase';
import { useSelectionStore } from '@/src/lib/useStore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NewTaskPage() {
  const { persons, tasks } = useSelectionStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!persons.length || !tasks.length) {
      toast.warning(
        'Veuillez sélectionner au moins une tâche et une personne.'
      );
      return;
    }

    setLoading(true);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks, persons }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erreur API :', errorText);
      toast.error('Erreur API lors de la génération');
      setLoading(false);
      return;
    }

    const data = await res.json(); // maintenant c’est sûr qu’il y a du JSON
    const result = data.result;

    // Enregistrement dans Firestore
    await addDoc(collection(db, 'assignments'), {
      result,
      createdAt: serverTimestamp(),
    });

    setLoading(false);
    toast.success('Répartition enregistrée !');
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
        <div className="flex gap-4">
          <Person />
          <Task />
        </div>
        <Button
          className="mt-8 mx-auto"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Valider'}
        </Button>
      </div>
    </>
  );
}
