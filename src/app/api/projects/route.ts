import { NextResponse } from 'next/server';
import { PROJECTS } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category');
  
  if (categoryId) {
    const filteredProjects = PROJECTS.filter(p => p.categoryId === categoryId);
    return NextResponse.json(filteredProjects);
  }

  const projectId = searchParams.get('id');
  if(projectId) {
    const project = PROJECTS.find(p => p.id === projectId);
    if (project) {
        return NextResponse.json(project);
    } else {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
  }

  return NextResponse.json(PROJECTS);
}
