import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChanelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';
import ServerHeader from './ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch, { ServerSearchProps } from './ServerSearch';
import { Hash, Mic, ShieldAlert, Video } from 'lucide-react';

type Props = {
  serverId: string;
};

const channelIconMap = {
  [ChanelType.TEXT]: <Hash className='mr-1 h-4 w-4' />,
  [ChanelType.AUDIO]: <Mic className='mr-1 h-4 w-4' />,
  [ChanelType.VIDEO]: <Video className='mr-1 h-4 w-4' />,
};

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className='mr-1 h-4 w-4 text-rose-500' />,
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldAlert className='mr-1 h-4 w-4 text-indigo-500' />
  ),
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

      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channel',
                type: 'channel',
                data: textChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channel',
                type: 'channel',
                data: audioChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: 'Video Channel',
                type: 'channel',
                data: videoChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
