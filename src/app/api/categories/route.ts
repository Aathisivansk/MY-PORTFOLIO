
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { Folder, Code, Cloud, Bot } from 'lucide-react';
import type { Category } from '@/lib/types';

const jsonPath = path.join(process.cwd(), 'src', 'lib', 'db', 'categories.json');

async function getCategories(): Promise<any[]> {
    try {
        const data = await fs.readFile(jsonPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function saveCategories(categories: any[]) {
    await fs.writeFile(jsonPath, JSON.stringify(categories, null, 2));
}

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
    const categories = await getCategories();
    const newCategoryData = await request.json();
    
    const newCategory = {
        id: newCategoryData.name.toLowerCase().replace(/\s+/g, '-'),
        ...newCategoryData,
        iconName: 'Folder',
    };
    
    categories.push(newCategory);
    await saveCategories(categories);
    return NextResponse.json(newCategory, { status: 201 });
}
