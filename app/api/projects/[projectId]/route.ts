import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
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

export async function DELETE(request: Request, context: { params: { projectId: string } }) {
  const params = await context.params;
  try {
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    let projects = JSON.parse(fileContents);
    const beforeCount = projects.length;
    projects = projects.filter((p: any) => String(p.id) !== String(params.projectId));
    if (projects.length === beforeCount) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}