import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/users';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    // Ambil user dari database
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = result[0];

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Cek kecocokan password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    // Kalau cocok, kembalikan user info
    return NextResponse.json({
      message: 'Login berhasil!',
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama, // pastikan field ini ada di tabel users
        roleId: user.roleId
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan saat login' }, { status: 500 });
  }
}
