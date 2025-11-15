
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';

export async function GET() {
  const { data: categories, error } = await supabase.from('categories').select('*');

  if (error) {
    return NextResponse.json({ message: 'Could not fetch categories', error }, { status: 500 });
  }

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const newCategoryData = await request.json();
  const newCategory: Omit<Category, 'id'> = {
    ...newCategoryData,
    iconName: 'Folder', // Default icon
  };

  const { data: createdCategory, error } = await supabase
    .from('categories')
    .insert(newCategory)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Could not create category', error }, { status: 500 });
  }

  return NextResponse.json(createdCategory, { status: 201 });
}
