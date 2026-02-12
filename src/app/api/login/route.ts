import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/users';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    console.log('Login attempt for username:', username);

    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    // Ambil user dari database
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = result[0];

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Cek kecocokan password
    if (!user.password) {
      console.log('User has no password hash');
      return NextResponse.json({ error: 'Password tidak tersedia untuk user ini' }, { status: 500 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log('Password match:', isMatch);

    if (!isMatch) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    // Kalau cocok, kembalikan user info
    return NextResponse.json({
      message: 'Login berhasil!',
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama,
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan saat login' }, { status: 500 });
  }
}
