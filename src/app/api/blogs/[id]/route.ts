
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { BlogPost } from '@/lib/types';

const jsonPath = path.join(process.cwd(), 'src', 'lib', 'db', 'blogs.json');

async function getBlogs(): Promise<BlogPost[]> {
    const data = await fs.readFile(jsonPath, 'utf-8');
    return JSON.parse(data);
}

async function saveBlogs(blogs: BlogPost[]) {
    await fs.writeFile(jsonPath, JSON.stringify(blogs, null, 2));
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const blogs = await getBlogs();
    const blog = blogs.find(b => b.id === params.id);
    if (blog) {
        return NextResponse.json(blog);
    }
    return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const blogs = await getBlogs();
    const blogIndex = blogs.findIndex(b => b.id === params.id);
    if (blogIndex === -1) {
        return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }
    const updatedBlog = await request.json();
    blogs[blogIndex] = { ...blogs[blogIndex], ...updatedBlog };
    await saveBlogs(blogs);
    return NextResponse.json(blogs[blogIndex]);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    let blogs = await getBlogs();
    const blogIndex = blogs.findIndex(p => p.id === params.id);
    
    if (blogIndex === -1) {
        return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }
    
    blogs = blogs.filter(p => p.id !== params.id);
    await saveBlogs(blogs);
    return NextResponse.json({ message: 'Blog deleted' }, { status: 200 });
}
