'use client';

import { useParams, useRouter } from 'next/navigation';
import ActionTooltip from './ActionTooltip';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type Props = {
  id: string;
  imageUrl: string;
  name: string;
};

const NavigationItem = ({ id, imageUrl, name }: Props) => {
  const params = useParams();
  const router = useRouter();

  const isCurrentItem = params.serverId === id;

  const handleClick = () => router.push(`/servers/${id}`);

  return (
    <ActionTooltip align='center' side='right' label={name}>
      <button
        onClick={handleClick}
        disabled={isCurrentItem}
        className='group flex items-center relative'
      >
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-1',
            !isCurrentItem && 'group-hover:h-5',
            isCurrentItem ? 'h-9' : 'h-2'
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-12 w-12 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            isCurrentItem && 'bg-primary/10 text-primary rounded-[16px]'
          )}
        >
          <Image fill src={imageUrl} alt='channel' />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
