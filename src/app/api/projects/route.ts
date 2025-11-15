
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category');

  let query = supabase.from('projects').select('*');

  if (categoryId) {
    query = query.eq('categoryId', categoryId);
  }

  const { data: projects, error } = await query;

  if (error) {
    return NextResponse.json({ message: 'Could not fetch projects', error }, { status: 500 });
  }

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const newProjectData = await request.json();
  const newProject: Omit<Project, 'id'> = {
    ...newProjectData,
  };

  const { data: createdProject, error } = await supabase
    .from('projects')
    .insert(newProject)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Could not create project', error }, { status: 500 });
  }

  return NextResponse.json(createdProject, { status: 201 });
}
