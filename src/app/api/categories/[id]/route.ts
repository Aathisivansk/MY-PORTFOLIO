
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { Category } from '@/lib/types';

const jsonPath = path.join(process.cwd(), 'src', 'lib', 'db', 'categories.json');

async function getCategories(): Promise<any[]> {
    const data = await fs.readFile(jsonPath, 'utf-8');
    return JSON.parse(data);
}

async function saveCategories(categories: any[]) {
    await fs.writeFile(jsonPath, JSON.stringify(categories, null, 2));
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const categories = await getCategories();
    const categoryIndex = categories.findIndex(c => c.id === params.id);
    if (categoryIndex === -1) {
        return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    const updatedCategoryData = await request.json();
    categories[categoryIndex] = { ...categories[categoryIndex], ...updatedCategoryData };
    await saveCategories(categories);
    return NextResponse.json(categories[categoryIndex]);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    let categories = await getCategories();
    const categoryIndex = categories.findIndex(p => p.id === params.id);
    
    if (categoryIndex === -1) {
        return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    
    categories = categories.filter(p => p.id !== params.id);
    await saveCategories(categories);
    return NextResponse.json({ message: 'Category deleted' }, { status: 200 });
}
