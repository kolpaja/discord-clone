import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChanelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';
import ServerHeader from './ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch, { ServerSearchProps } from './ServerSearch';
import { Hash, Mic, ShieldAlert, Video } from 'lucide-react';
import { Separator } from '../ui/separator';
import ServerSection from './ServerSection';
import ServerChannel from './ServerChannel';
import ServerMember from './ServerMember';

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

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChanelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChanelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
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
    <div className='h-full w-full flex flex-col text-primary  dark:bg-[#1f1f1f] bg-gray-200'>
      <ServerHeader server={server} role={role as MemberRole} />

      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channel',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channel',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: 'Video Channel',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
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

        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />

        {!!textChannels?.length ? (
          <div className='mb-2'>
            <ServerSection
              label='Text Channels'
              sectionType='channels'
              role={role}
              channelType={ChanelType.TEXT}
            />
            <div className='my-2'>
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        ) : null}

        {!!audioChannels?.length ? (
          <div className='mb-2'>
            <ServerSection
              label='Voice Channels'
              sectionType='channels'
              role={role}
              channelType={ChanelType.AUDIO}
            />
            <div className='my-2'>
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        ) : null}

        {!!videoChannels?.length ? (
          <div className='mb-2'>
            <ServerSection
              label='Video Channels'
              sectionType='channels'
              role={role}
              channelType={ChanelType.VIDEO}
            />
            <div className='my-2'>
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        ) : null}

        {!!members?.length ? (
          <div className='mb-2'>
            <ServerSection
              label='Members'
              sectionType='members'
              role={role}
              server={server}
            />
            <div className='my-2'>
              {members
                .filter((i) => i.profileId !== profile.id)
                .map((member) => (
                  <ServerMember
                    key={member.id}
                    server={server}
                    member={member}
                  />
                ))}
            </div>
          </div>
        ) : null}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
