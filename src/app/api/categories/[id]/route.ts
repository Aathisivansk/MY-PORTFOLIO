
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase/firebase';
import type { Category } from '@/lib/types';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const db = getDb();
    const docRef = db.collection('categories').doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    const updatedData = await request.json();
    await docRef.update(updatedData);

    const updatedDoc = await docRef.get();
    const updatedCategory = { id: updatedDoc.id, ...updatedDoc.data() } as Category;

    return NextResponse.json(updatedCategory);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const db = getDb();
    const docRef = db.collection('categories').doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    await docRef.delete();
    return NextResponse.json({ message: 'Category deleted' }, { status: 200 });
}
