
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { Project } from '@/lib/types';

const jsonPath = path.join(process.cwd(), 'src', 'lib', 'db', 'projects.json');

async function getProjects(): Promise<Project[]> {
    const data = await fs.readFile(jsonPath, 'utf-8');
    return JSON.parse(data);
}

async function saveProjects(projects: Project[]) {
    await fs.writeFile(jsonPath, JSON.stringify(projects, null, 2));
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const projects = await getProjects();
    const project = projects.find(p => p.id === params.id);
    if (project) {
        return NextResponse.json(project);
    }
    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const projects = await getProjects();
    const projectIndex = projects.findIndex(p => p.id === params.id);
    if (projectIndex === -1) {
        return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    const updatedProject = await request.json();
    projects[projectIndex] = { ...projects[projectIndex], ...updatedProject };
    await saveProjects(projects);
    return NextResponse.json(projects[projectIndex]);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    let projects = await getProjects();
    const projectIndex = projects.findIndex(p => p.id === params.id);
    
    if (projectIndex === -1) {
        return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    projects = projects.filter(p => p.id !== params.id);
    await saveProjects(projects);
    return NextResponse.json({ message: 'Project deleted' }, { status: 200 });
}
