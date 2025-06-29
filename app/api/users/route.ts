import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/data';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const users = JSON.parse(fileContents);
    const newUser = { id: uuidv4(), ...body };
    users.push(newUser);
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');
    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'معرّف العضو مطلوب' }, { status: 400 });
    }
    const usersRaw = await fs.readFile(USERS_PATH, 'utf-8');
    const users = JSON.parse(usersRaw);
    const filtered = users.filter((user: any) => user.id !== id);
    if (filtered.length === users.length) {
      return NextResponse.json({ success: false, error: 'العضو غير موجود' }, { status: 404 });
    }
    await fs.writeFile(USERS_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء حذف العضو' }, { status: 500 });
  }
}
