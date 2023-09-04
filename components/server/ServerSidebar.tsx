import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChanelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';
import ServerHeader from './ServerHeader';

type Props = {
  serverId: string;
};

const ServerSidebar = async ({ serverId }: Props) => {
  const profile = await currentProfile();

  if (!profile) return redirect('/');

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
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

  const textChannel = server?.channels.filter(
    (channel) => channel.type === ChanelType.TEXT
  );
  const audioChannel = server?.channels.filter(
    (channel) => channel.type === ChanelType.AUDIO
  );
  const videoChannel = server?.channels.filter(
    (channel) => channel.type === ChanelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile?.id
  );

  if (!server) return redirect('/');

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className='h-full w-full flex flex-col text-primary dark:bg-stone-800 bg-gray-200'>
      <ServerHeader server={server} role={role as MemberRole} />
    </div>
  );
};

export default ServerSidebar;
