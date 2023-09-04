import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    inviteCode: string;
  };
};

const InviteCode = async ({ params: { inviteCode } }: Props) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  if (!inviteCode) return redirect('/');

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const joinServer = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });

  if (joinServer) return redirect(`/servers/${joinServer.id}`);

  return null;
};

export default InviteCode;
