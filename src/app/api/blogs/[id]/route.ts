
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Could not fetch blog', error }, { status: 500 });
  }

  return NextResponse.json(blog);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const updatedData = await request.json();
  const { data: updatedBlog, error } = await supabase
    .from('blogs')
    .update(updatedData)
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Could not update blog', error }, { status: 500 });
  }

  return NextResponse.json(updatedBlog);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('blogs').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ message: 'Could not delete blog', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Blog deleted' }, { status: 200 });
}
