
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { BlogPost } from '@/lib/types';

export async function GET() {
  const { data: blogs, error } = await supabase.from('blogs').select('*');

  if (error) {
    return NextResponse.json({ message: 'Could not fetch blogs', error }, { status: 500 });
  }

  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  const newBlog = await request.json();
  const blog: Omit<BlogPost, 'id'> = {
    ...newBlog,
    createdAt: new Date().toISOString().split('T')[0],
  };

  const { data: createdBlog, error } = await supabase
    .from('blogs')
    .insert(blog)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Could not create blog', error }, { status: 500 });
  }

  return NextResponse.json(createdBlog, { status: 201 });
}
