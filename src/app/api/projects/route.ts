
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { Project } from '@/lib/types';

const jsonPath = path.join(process.cwd(), 'src', 'lib', 'db', 'projects.json');

async function getProjects(): Promise<Project[]> {
    try {
        const data = await fs.readFile(jsonPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function saveProjects(projects: Project[]) {
    await fs.writeFile(jsonPath, JSON.stringify(projects, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category');
  const projects = await getProjects();
  
  if (categoryId) {
    const filteredProjects = projects.filter(p => p.categoryId === categoryId);
    return NextResponse.json(filteredProjects);
  }

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
    const projects = await getProjects();
    const newProjectData = await request.json();
    
    const newProject: Project = {
        id: `proj-${Date.now()}`,
        ...newProjectData,
    };
    
    projects.push(newProject);
    await saveProjects(projects);
    return NextResponse.json(newProject, { status: 201 });
}
