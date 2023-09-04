import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get('serverId');
    const memberId = params.memberId;

    if (!serverId) {
      return new NextResponse('Server id missing', { status: 400 });
    }

    if (!memberId) {
      return new NextResponse('Member id missing', { status: 400 });
    }

    if (!profile) {
      return new NextResponse('unauthorized', { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);
    const { memberId } = params;
    const serverId = searchParams.get('serverId');

    if (!serverId) {
      return new NextResponse('Server id missing', { status: 400 });
    }

    if (!memberId) {
      return new NextResponse('Member id missing', { status: 400 });
    }

    if (!profile) {
      return new NextResponse('unauthorized', { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('🚀 ~ file: route.ts:69 ~ DELETE ~ error:', error);
    return new NextResponse('Internal server Error', { status: 500 });
  }
}
