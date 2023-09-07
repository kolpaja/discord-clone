import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react';
import NavigationAction from './NavigationAction';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import NavigationItem from './NavigationItem';
import { ModeToggle } from '../dark-mode';
import { UserButton } from '@clerk/nextjs';

type Props = {};

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) return redirect('/');

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className='space-y-4 flex flex-col items-center h-full text-primary w-full pt-2 dark:bg-stone-900 bg-gray-300'>
      <NavigationAction />

      <Separator className='h-[2px] w-10 mx-auto bg-zinc-300 dark:bg-zinc-700 rounded-md' />

      <ScrollArea className='flex-1 w-full'>
        {servers.map((server) => (
          <div key={server.id} className='mb-4'>
            <NavigationItem
              imageUrl={server.imgUrl}
              id={server.id}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>

      <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
        <ModeToggle />

        <UserButton
          afterSignOutUrl='/'
          appearance={{
            elements: {
              avatarBox: 'h-12 w-12',
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
