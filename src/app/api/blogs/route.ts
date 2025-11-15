
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { BlogPost } from '@/lib/types';

export const revalidate = 0;

const jsonPath = path.join(process.cwd(), 'src', 'lib', 'db', 'blogs.json');

async function getBlogs(): Promise<BlogPost[]> {
    try {
        const data = await fs.readFile(jsonPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, return an empty array
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function saveBlogs(blogs: BlogPost[]) {
    await fs.writeFile(jsonPath, JSON.stringify(blogs, null, 2));
}

export async function GET() {
  const blogs = await getBlogs();
  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
    const blogs = await getBlogs();
    const newBlog = await request.json();
    
    const blog: BlogPost = {
        id: `blog-${Date.now()}`,
        ...newBlog,
        createdAt: new Date().toISOString().split('T')[0],
    };
    
    blogs.push(blog);
    await saveBlogs(blogs);
    return NextResponse.json(blog, { status: 201 });
}
