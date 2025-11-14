import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/lib/data';

export async function GET() {
  return NextResponse.json(BLOG_POSTS);
}
