import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

import ServerSidebar from '@/components/server/ServerSidebar';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const { serverId } = params;
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return redirect('/');

  return (
    <div className='h-full'>
      <div className='h-full hidden md:flex flex-col fixed w-60 z-20 inset-y-0'>
        <ServerSidebar serverId={serverId} />
      </div>
      <main className='h-full md:pl-60'>{children}</main>
    </div>
  );
};

export default ServerIdLayout;
