
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const updatedData = await request.json();
  const { data: updatedCategory, error } = await supabase
    .from('categories')
    .update(updatedData)
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Could not update category', error }, { status: 500 });
  }

  return NextResponse.json(updatedCategory);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('categories').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ message: 'Could not delete category', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Category deleted' }, { status: 200 });
}
