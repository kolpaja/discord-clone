'use client';

import { useModal } from '@/hooks/useModalStore';
import { ServerWithMembersWithProfile } from '@/types';
import { MemberRole, ChanelType } from '@prisma/client';
import React from 'react';
import ActionTooltip from '../navigation/ActionTooltip';
import { Plus, Settings } from 'lucide-react';

type Props = {
  label: string;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  server?: ServerWithMembersWithProfile;
  channelType?: ChanelType;
};

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: Props) => {
  const { onOpen } = useModal();

  const handleManageMembers = () => onOpen('manageMembers', { server });
  const handleCreateChannel = () => onOpen('createChannel', { channelType });
  return (
    <div className='flex items-center justify-between py-2'>
      <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 '>
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip side='top' label='Create Channel'>
          <button
            onClick={handleCreateChannel}
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Plus className='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip side='top' label='Manage Members'>
          <button
            onClick={handleManageMembers}
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Settings className='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
