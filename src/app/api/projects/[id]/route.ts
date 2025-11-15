
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Could not fetch project', error }, { status: 500 });
  }

  return NextResponse.json(project);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const updatedData = await request.json();
  const { data: updatedProject, error } = await supabase
    .from('projects')
    .update(updatedData)
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Could not update project', error }, { status: 500 });
  }

  return NextResponse.json(updatedProject);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('projects').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ message: 'Could not delete project', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Project deleted' }, { status: 200 });
}
