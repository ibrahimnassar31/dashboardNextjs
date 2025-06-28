import { NextResponse } from 'next/server';
import { getTasks } from '@/lib/data';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const tasks = await getTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'tasks.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const tasks = JSON.parse(fileContents);
    const newTask = {
      id: uuidv4(),
      ...body,
    };
    tasks.push(newTask);
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf8');
    return NextResponse.json({ success: true, task: newTask });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'data', 'tasks.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    let tasks = JSON.parse(fileContents);
    const initialLength = tasks.length;
    tasks = tasks.filter((task: any) => task.id !== id);
    if (tasks.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}