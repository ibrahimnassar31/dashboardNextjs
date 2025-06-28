import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function PATCH(request: Request, context: { params: { taskId: string } }) {
  try {
    const { taskId } = await context.params;
    const body = await request.json();
    const { status } = body;
    if (!status) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'data', 'tasks.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const tasks = JSON.parse(fileContents);
    const idx = tasks.findIndex((t: any) => t.id === taskId);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    tasks[idx].status = status;
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf8');
    return NextResponse.json({ success: true, task: tasks[idx] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
