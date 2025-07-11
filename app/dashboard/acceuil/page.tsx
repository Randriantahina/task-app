'use client';

import { db } from '@/src/lib/firebase';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Card, CardContent } from '@/src/components/ui/card';
import Nav from '@/src/components/Nav';

interface Assignment {
  person: string;
  tasks: string;
}

export default function Acceuil() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const load = async () => {
      const q = query(
        collection(db, 'assignments'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const latest = snap.docs[0]?.data()?.result || '';

      const parsed: Assignment[] = latest
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: any) => line && line.includes(':'))
        .map((line: any) => {
          const [person, tasks] = line.split(':');
          return {
            person: person.trim(),
            tasks: tasks.trim(),
          };
        });

      setAssignments(parsed);
    };

    load();
  }, []);

  return (
    <>
      <Nav />
      <div className="p-8 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-4">Répartition des tâches</h2>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Personne</th>
                  <th className="text-left p-2">Tâches</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2 font-medium">{a.person}</td>
                    <td className="p-2">{a.tasks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
