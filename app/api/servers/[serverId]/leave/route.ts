import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { serverId } = params;

    if (!profile) return new NextResponse('unauthorized', { status: 401 });
    if (!serverId)
      return new NextResponse('Server Id not provided', { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile?.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('🚀 ~ file: route.ts:5 ~ PATCH ~ error:', error);
    return new NextResponse('internal server error', { status: 500 });
  }
}
