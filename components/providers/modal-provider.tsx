'use client';

import { useEffect, useState } from 'react';

import { CreateServerModal } from '@/components/modals/CreateServerModal';
import { InvitePeopleModal } from '@/components/modals/InvitePeopleModal';
import { EditServerModal } from '@/components/modals/EditServerModal';
import { ManageServerMembersModal } from '@/components/modals/ManageServerMembersModal';
import { CreateChannelModal } from '@/components/modals/CreateChannelModal';
import { LeaveServerModal } from '@/components/modals/LeaveServerModal';
import { DeleteServerModal } from '@/components/modals/DeleteServerModal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InvitePeopleModal />
      <EditServerModal />
      <ManageServerMembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
    </>
  );
};
