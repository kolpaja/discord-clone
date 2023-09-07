'use client';

import { cn } from '@/lib/utils';
import { ChanelType, Channel, MemberRole, Server } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ActionTooltip from '../navigation/ActionTooltip';
import { useModal } from '@/hooks/useModalStore';

type Props = {
  channel: Channel;
  server: Server;
  role?: MemberRole;
};

const iconMap = {
  [ChanelType.TEXT]: Hash,
  [ChanelType.AUDIO]: Mic,
  [ChanelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: Props) => {
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];

  const { onOpen } = useModal();

  const handleChannelClick = () =>
    router.push(`/servers/${params?.serverId}/channels/${channel?.id}`);
  const handleEditChannel = () => onOpen('editChannel', { server, channel });
  const handleDeleteChannel = () =>
    onOpen('deleteChannel', { server, channel });

  return (
    <button
      onClick={handleChannelClick}
      className={cn(
        'group p-2 rounded-md flex items-center gap-x-2  w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.channelId == channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <Icon className='flex-shrink-0 h-5 w-5 text-zinc-500 dark:text-zinc-400' />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500  group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.channelId == channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionTooltip label='Edit' side='top'>
            <Edit
              onClick={handleEditChannel}
              className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
          <ActionTooltip label='Delete' side='top'>
            <Trash
              onClick={handleDeleteChannel}
              className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className='ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400' />
      )}
    </button>
  );
};

export default ServerChannel;
