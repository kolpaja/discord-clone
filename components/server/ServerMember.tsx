'use client';

import { cn } from '@/lib/utils';
import {
  ChanelType,
  Channel,
  Member,
  MemberRole,
  Profile,
  Server,
} from '@prisma/client';
import {
  Edit,
  Hash,
  Lock,
  Mic,
  ShieldAlert,
  ShieldCheck,
  Trash,
  Video,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ActionTooltip from '../navigation/ActionTooltip';
import { useModal } from '@/hooks/useModalStore';
import UserAvatar from '../UserAvatar';

type Props = {
  server: Server;
  member: Member & { profile: Profile };
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 text-rose-500' />,
  [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 text-indigo-500' />,
};

const ServerMember = ({ server, member }: Props) => {
  const params = useParams();
  const router = useRouter();

  const { onOpen } = useModal();

  const icon = roleIconMap[member.role];

  return (
    <button
      onClick={() => {}}
      className={cn(
        'group p-2 rounded-md flex items-center gap-x-2  w-full hover:bg-zinc-800/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.memberId == member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar
        src={member.profile.imgUrl}
        className='h-8 w-8 md:h-8 md:w-8'
      />
      {icon}
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500  group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.channelId == member.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {member?.profile?.name}
      </p>
    </button>
  );
};

export default ServerMember;
