import ChatHeader from '@/components/chat/ChatHeader';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    serverId: string;
    channelId: string;
  };
};

const ChannelPage = async ({ params: { channelId, serverId } }: Props) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile?.id,
    },
  });

  if (!channel || !member) return redirect('/');

  return (
    <div className='bg-white dark:bg-[#292929] h-full flex flex-col '>
      <ChatHeader
        name={channel.name}
        serverId={serverId}
        type='channel'
        imgUrl=''
      />
    </div>
  );
};

export default ChannelPage;
