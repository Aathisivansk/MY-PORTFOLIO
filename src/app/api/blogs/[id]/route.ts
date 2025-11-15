
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase/firebase';
import type { BlogPost } from '@/lib/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const db = getDb();
    const docRef = db.collection('blogs').doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    const blog = { id: doc.id, ...doc.data() } as BlogPost;
    return NextResponse.json(blog);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const db = getDb();
    const docRef = db.collection('blogs').doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    const updatedData = await request.json();
    await docRef.update(updatedData);

    const updatedDoc = await docRef.get();
    const updatedBlog = { id: updatedDoc.id, ...updatedDoc.data() } as BlogPost;

    return NextResponse.json(updatedBlog);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const db = getDb();
    const docRef = db.collection('blogs').doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    await docRef.delete();
    return NextResponse.json({ message: 'Blog deleted' }, { status: 200 });
}
