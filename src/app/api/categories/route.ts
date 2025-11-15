
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase/firebase';
import type { Category } from '@/lib/types';

export const revalidate = 0;

export async function GET() {
  const db = getDb();
  const snapshot = await db.collection('categories').get();
  const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const db = getDb();
  const newCategoryData = await request.json();
  const newCategory: Omit<Category, 'id'> = {
    ...newCategoryData,
    iconName: 'Folder', // Default icon
  };

  const slug = newCategoryData.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const docRef = db.collection('categories').doc(slug);

  await docRef.set(newCategory);

  const createdCategory = { id: docRef.id, ...newCategory };

  return NextResponse.json(createdCategory, { status: 201 });
}
