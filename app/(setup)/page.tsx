import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import React from 'react';
import { OnboardingModal } from '@/components/modals/OnboardingModal';

type Props = {};

const Setup = async (props: Props) => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <OnboardingModal />;
};

export default Setup;
