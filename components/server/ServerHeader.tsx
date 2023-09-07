'use client';

import { ServerWithMembersWithProfile } from '@/types';
import { MemberRole } from '@prisma/client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  ChevronDown,
  LogOutIcon,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react';
import { useModal } from '@/hooks/useModalStore';

type Props = {
  server: ServerWithMembersWithProfile;
  role: MemberRole;
};

const ServerHeader = ({ server, role }: Props) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  const { onOpen } = useModal();

  const handleInvitePeople = () => onOpen('invite', { server });
  const handleEditServer = () => onOpen('editServer', { server });
  const handleManageMembers = () => onOpen('manageMembers', { server });
  const handleCreateChannel = () => onOpen('createChannel', { server });
  const handleLeaveServer = () => onOpen('leaveServer', { server });
  const handleDeleteServer = () => onOpen('deleteServer', { server });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='w-full h-12 text-md font-semibold flex items-center px-3 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
          {server.name}
          <ChevronDown className='ml-auto mr-6 h-5 w-5' />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56 text-sm text-black font-medium dark:text-neutral-400 space-y-1'>
        {isModerator && (
          <>
            <DropdownMenuItem
              onClick={handleInvitePeople}
              className='text-indigo-600 dark:text-indigo-400 text-sm cursor-pointer px-3 py-2'
            >
              Invite People <UserPlus className='h-4 w-4 ml-auto' />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleCreateChannel}
              className=' text-sm cursor-pointer px-3 py-2'
            >
              Create A Channel <PlusCircle className='h-4 w-4 ml-auto' />
            </DropdownMenuItem>
          </>
        )}
        {isAdmin && (
          <>
            <DropdownMenuItem
              onClick={handleEditServer}
              className=' text-sm cursor-pointer px-3 py-2'
            >
              Server Settings <Settings className='h-4 w-4 ml-auto' />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleManageMembers}
              className=' text-sm cursor-pointer px-3 py-2'
            >
              Manage Users <Users className='h-4 w-4 ml-auto' />
            </DropdownMenuItem>
          </>
        )}
        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem
            onClick={handleDeleteServer}
            className='text-rose-500 text-sm cursor-pointer px-3 py-2'
          >
            Delete Server <Trash className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem
            onClick={handleLeaveServer}
            className='text-rose-500 text-sm cursor-pointer px-3 py-2'
          >
            Leave Server <LogOutIcon className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
