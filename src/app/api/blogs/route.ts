
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase/firebase';
import type { BlogPost } from '@/lib/types';

export const revalidate = 0;

export async function GET() {
  const db = getDb();
  const snapshot = await db.collection('blogs').get();
  const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  const db = getDb();
  const newBlog = await request.json();
  const blog: Omit<BlogPost, 'id'> = {
    ...newBlog,
    createdAt: new Date().toISOString().split('T')[0],
  };

  const docRef = await db.collection('blogs').add(blog);
  const createdBlog = { id: docRef.id, ...blog };
  return NextResponse.json(createdBlog, { status: 201 });
}
