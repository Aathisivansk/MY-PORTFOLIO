
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedData = await request.json();

    if (!updatedData.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const { data: updatedCategory, error } = await supabase
      .from('categories')
      .update({ name: updatedData.name })
      .eq('id', params.id)
      .single();

    if (error) {
        if (error.code === '23505') { // Unique violation
            return NextResponse.json({ error: `A category with the name "${updatedData.name}" already exists.` }, { status: 409 });
        }
        throw error;
    }

    return NextResponse.json(updatedCategory);

  } catch (err: any) {
    const errorMessage = err.message || 'An unexpected error occurred.';
    console.error("API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { error } = await supabase.from('categories').delete().eq('id', params.id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Category deleted' }, { status: 200 });

    } catch (err: any) {
        const errorMessage = err.message || 'An unexpected error occurred.';
        console.error("API Error:", err);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
