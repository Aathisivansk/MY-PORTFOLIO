
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');

    let query = supabase.from('projects').select('*');

    if (categoryId) {
      // FIX: Use the correct snake_case column name for filtering
      query = query.eq('category_id', categoryId);
    }

    const { data: projects, error } = await query;

    if (error) {
      throw error;
    }

    // FIX: Map snake_case from DB to camelCase for the client
    const projectsCamelCase = projects?.map(project => ({
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
    }));

    return NextResponse.json(projectsCamelCase);
  } catch (err: any) {
    const errorMessage = err.message || 'An unexpected error occurred.';
    console.error("API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProjectData = await request.json();

    if (!newProjectData.title || !newProjectData.categoryId) {
      return NextResponse.json({ error: 'Title and categoryId are required.' }, { status: 400 });
    }

    // FIX: Map camelCase from client to snake_case for the DB
    const projectToInsert = {
      title: newProjectData.title,
      description: newProjectData.description,
      category_id: newProjectData.categoryId,
      my_contribution: newProjectData.myContribution,
      tech_stack: newProjectData.techStack,
      github_url: newProjectData.githubUrl,
      social_url: newProjectData.socialUrl,
      flowchart_url: newProjectData.flowchart_url,
      demo_photo_url: newProjectData.demo_photo_url,
      demo_video_url: newProjectData.demo_video_url,
      other_files: newProjectData.otherFiles,
    };
    
    const { data: createdProject, error } = await supabase
      .from('projects')
      .insert(projectToInsert)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(createdProject, { status: 201 });
  } catch (err: any) {
    const errorMessage = err.message || 'An unexpected error occurred.';
    console.error("API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
