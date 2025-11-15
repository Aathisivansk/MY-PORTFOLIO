
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase/firebase';
import type { Project } from '@/lib/types';

export const revalidate = 0;

export async function GET(request: Request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category');

  let projectsQuery = db.collection('projects');

  if (categoryId) {
    // The following line is a valid Firestore query
    // @ts-ignore
    projectsQuery = projectsQuery.where('categoryId', '==', categoryId);
  }

  const snapshot = await projectsQuery.get();
  const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const db = getDb();
  const newProjectData = await request.json();
  const newProject: Omit<Project, 'id'> = {
    ...newProjectData,
  };

  const docRef = await db.collection('projects').add(newProject);
  const createdProject = { id: docRef.id, ...newProject };

  return NextResponse.json(createdProject, { status: 201 });
}
