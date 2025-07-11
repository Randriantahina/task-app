import { generateTaskAssignment } from '@/src/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { tasks, persons } = await req.json();

  if (!tasks?.length || !persons?.length) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const result = await generateTaskAssignment(tasks, persons);
  return NextResponse.json({ result });
}
