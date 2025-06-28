import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getProjects } from '@/lib/data';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const projects = JSON.parse(fileContents);
    const newProject = { ...body, id: String(Date.now()) };
    projects.push(newProject);
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2), 'utf8');
    return NextResponse.json({ success: true, project: newProject });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

