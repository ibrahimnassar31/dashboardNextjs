import { NextResponse } from 'next/server';
import { getProject, getTasksByProject } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const project = await getProject(params.projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const tasks = await getTasksByProject(params.projectId);
    
    return NextResponse.json({
      ...project,
      taskDetails: tasks
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}