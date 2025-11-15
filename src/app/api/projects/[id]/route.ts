
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase/firebase';
import type { Project } from '@/lib/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const db = getDb();
    const docRef = db.collection('projects').doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const project = { id: doc.id, ...doc.data() } as Project;
    return NextResponse.json(project);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const db = getDb();
    const docRef = db.collection('projects').doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const updatedData = await request.json();
    await docRef.update(updatedData);

    const updatedDoc = await docRef.get();
    const updatedProject = { id: updatedDoc.id, ...updatedDoc.data() } as Project;

    return NextResponse.json(updatedProject);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const db = getDb();
    const docRef = db.collection('projects').doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    await docRef.delete();
    return NextResponse.json({ message: 'Project deleted' }, { status: 200 });
}
