
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data: blogs, error } = await supabase.from('blogs').select('*');

    if (error) {
      throw error;
    }

    // FIX: Map snake_case from DB to camelCase for the client
    const blogsCamelCase = blogs?.map(blog => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        createdAt: blog.created_at, // snake_case to camelCase
        author: blog.author
    }));

    return NextResponse.json(blogsCamelCase);

  } catch (err: any) {
    const errorMessage = err.message || 'An unexpected error occurred.';
    console.error("API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newBlogData = await request.json();

    if (!newBlogData.title || !newBlogData.content || !newBlogData.author) {
        return NextResponse.json({ error: 'Title, content, and author are required.' }, { status: 400 });
    }

    // FIX: Map camelCase from client to snake_case for the DB
    const blogToInsert = {
        title: newBlogData.title,
        content: newBlogData.content,
        author: newBlogData.author,
        created_at: new Date().toISOString(), // The DB will use this snake_case name
    };

    const { data: createdBlog, error } = await supabase
      .from('blogs')
      .insert(blogToInsert)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(createdBlog, { status: 201 });

  } catch (err: any) {
    const errorMessage = err.message || 'An unexpected error occurred.';
    console.error("API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
