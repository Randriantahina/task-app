'use client';

import { db } from '@/src/lib/firebase';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  where,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Card, CardContent } from '@/src/components/ui/card';
import Nav from '@/src/components/Nav';
import { Button } from '@/src/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Assignment {
  id: string;
  person: string;
  tasks: string;
}

export default function Acceuil() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [docId, setDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const auth = getAuth();

      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setAssignments([]);
          setDocId(null);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, 'assignments'),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const snap = await getDocs(q);
        const firstDoc = snap.docs[0];
        if (!firstDoc) {
          setAssignments([]);
          setDocId(null);
          setLoading(false);
          return;
        }

        setDocId(firstDoc.id);

        const result = firstDoc.data()?.result || '';
        const parsed: Assignment[] = result
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line && line.includes(':'))
          .map((line: string, index: number) => {
            const [person, tasks] = line.split(':');
            return {
              id: `${index}`,
              person: person.trim(),
              tasks: tasks.trim(),
            };
          });

        setAssignments(parsed);
        setLoading(false);
      });
    };

    load();
  }, []);

  const handleDelete = async () => {
    if (!docId) return;
    await deleteDoc(doc(db, 'assignments', docId));
    setAssignments([]);
    setDocId(null);
  };
  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Répartition des tâches', 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [['Personne', 'Tâches']],
      body: assignments.map((a) => [a.person, a.tasks]),
      styles: { fontSize: 12 },
    });

    doc.save('repartition-taches.pdf');
  };

  return (
    <>
      <Nav />
      <div className="p-4 md:p-8 flex flex-col items-center gap-6">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 md:gap-0">
              <h2 className="text-xl md:text-2xl font-bold">
                Répartition des tâches
              </h2>
              {docId && (
                <Button variant="destructive" onClick={handleDelete}>
                  Supprimer
                </Button>
              )}
            </div>

            {loading ? (
              <p>Chargement...</p>
            ) : assignments.length === 0 ? (
              <p>Aucune répartition trouvée.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Personne</th>
                      <th className="text-left p-2">Tâches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((a) => (
                      <tr key={a.id} className="border-b">
                        <td className="p-2 font-medium">{a.person}</td>
                        <td className="p-2">{a.tasks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          {assignments.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleDownload}
                className="flex items-center px-4 py-2"
              >
                <Download className="mr-2" size={18} />
                Télécharger
              </Button>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
