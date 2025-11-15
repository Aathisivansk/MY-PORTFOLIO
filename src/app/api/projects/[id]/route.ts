
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      throw error;
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // FIX: Map snake_case from DB to camelCase for the client
    const projectCamelCase = {
        id: project.id,
        title: project.title,
        description: project.description,
        categoryId: project.category_id,
        myContribution: project.my_contribution,
        techStack: project.tech_stack,
        githubUrl: project.github_url,
        socialUrl: project.social_url,
        flowchart_url: project.flowchart_url,
        demo_photo_url: project.demo_photo_url,
        demo_video_url: project.demo_video_url,
        otherFiles: project.other_files
    };

    return NextResponse.json(projectCamelCase);

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
    const projectToUpdate = {
      title: updatedData.title,
      description: updatedData.description,
      category_id: updatedData.categoryId,
      my_contribution: updatedData.myContribution,
      tech_stack: updatedData.techStack,
      github_url: updatedData.githubUrl,
      social_url: updatedData.socialUrl,
      flowchart_url: updatedData.flowchart_url,
      demo_photo_url: updatedData.demo_photo_url,
      demo_video_url: updatedData.demo_video_url,
      other_files: updatedData.otherFiles,
    };

    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update(projectToUpdate)
      .eq('id', params.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(updatedProject);

  } catch (err: any) {
    const errorMessage = err.message || 'An unexpected error occurred.';
    console.error("API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from('projects').delete().eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Project deleted' }, { status: 200 });

  } catch (err: any) {
    const errorMessage = err.message || 'An unexpected error occurred.';
    console.error("API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
