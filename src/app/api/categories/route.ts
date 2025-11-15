
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';

export async function GET() {
  const { data: categories, error } = await supabase.from('categories').select('*');

  if (error) {
    return NextResponse.json({ message: 'Could not fetch categories', error: error.message }, { status: 500 });
  }

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    const newCategoryData = await request.json();
    
    if (!newCategoryData.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const newCategory: Omit<Category, 'id'> = {
      name: newCategoryData.name,
      iconName: 'Folder', // Default icon
    };

    const { data: createdCategory, error } = await supabase
      .from('categories')
      .insert(newCategory)
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ error: `A category with the name "${newCategory.name}" already exists.` }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(createdCategory, { status: 201 });

  } catch (err: any) {
    const errorMessage = err.message || 'An unexpected error occurred.';
    console.error("API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
