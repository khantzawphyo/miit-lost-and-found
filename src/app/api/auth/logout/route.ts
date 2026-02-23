import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST() {
  // req: Request
  try {
    // const cookieHeader = req.headers.get('cookie');
    // const sessionId = cookieHeader?.split('; ').find((row) => row.startsWith('sessionId='))?.split('=')[1];

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    if (sessionId) {
      await prisma.session.deleteMany({
        where: { sessionId },
      });
    }

    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

    response.cookies.set('sessionId', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });
    
    // cookieStore.delete('sessionId');

    return response;
  } catch (error) {
    console.error('LOGOUT_ERROR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
