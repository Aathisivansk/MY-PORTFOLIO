
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      throw error;
    }

    if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // FIX: Map snake_case from DB to camelCase for the client
    const blogCamelCase = {
        id: blog.id,
        title: blog.title,
        content: blog.content,
        createdAt: blog.created_at, // snake_case to camelCase
        author: blog.author
    };

    return NextResponse.json(blogCamelCase);

  } catch (err: any) {
    const errorMessage = err.message || 'An unexpected error occurred.';
    console.error("API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedData = await request.json();

    // FIX: Map camelCase from client to snake_case for the DB
    const blogToUpdate = {
        title: updatedData.title,
        content: updatedData.content,
        author: updatedData.author,
    };

    const { data: updatedBlog, error } = await supabase
      .from('blogs')
      .update(blogToUpdate)
      .eq('id', params.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(updatedBlog);

  } catch (err: any) {
    const errorMessage = err.message || 'An unexpected error occurred.';
    console.error("API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from('blogs').delete().eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Blog deleted' }, { status: 200 });

  } catch (err: any) {
    const errorMessage = err.message || 'An unexpected error occurred.';
    console.error("API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
