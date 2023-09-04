'use client';

import axios from 'axios';
import qs from 'query-string';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModalStore';
import { ServerWithMembersWithProfile } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../UserAvatar';
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemberRole } from '@prisma/client';

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='h-4 w-4 mx-1' />,
  ADMIN: <ShieldAlert className='h-4 w-4 mx-1 text-rose-500' />,
};

export const ManageServerMembersModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState<string>('');

  const { server } = data as { server: ServerWithMembersWithProfile };

  const isModalOpen = isOpen && type === 'manageMembers';

  const handleClose = () => {
    onClose();
  };

  const onMemberKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      const updatedServer = await axios.delete(url);
      router.refresh();
      onOpen('manageMembers', { server: updatedServer.data });
    } catch (error: any) {
      console.error(
        '🚀 ~ file: ManageServerMembersModal.tsx:68 ~ onRoleChange ~ error:',
        error?.message
      );
    } finally {
      setLoadingId('');
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      const updatedServer = await axios.patch(url, { role });
      router.refresh();
      onOpen('manageMembers', { server: updatedServer.data });
    } catch (error: any) {
      console.error(
        '🚀 ~ file: ManageServerMembersModal.tsx:68 ~ onRoleChange ~ error:',
        error?.message
      );
    } finally {
      setLoadingId('');
    }
  };

  //! Hydration Error on mount: resolve hydration error
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black  overflow-hidden'>
        <DialogHeader className='p-6'>
          <DialogTitle className='text-3xl font-semibold text-center capitalize'>
            Manage Members
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            {server?.members?.length} members
          </DialogDescription>
        </DialogHeader>

        <div className='p-6'>
          <ScrollArea className='max-w-[470px] mt-8 pr-6'>
            {server?.members?.map((member) => (
              <div
                key={member.id}
                className='flex items center gap-x-2 mb-6 shadow-sm pb-1'
              >
                <UserAvatar src={member.profile.imgUrl} />

                <div className='flex flex-col gap-y-1'>
                  <div className='text-xs font-semibold flex items-center'>
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className='text-xs text-zinc-500'>
                    {member.profile.email}
                  </p>
                </div>

                {/* actions */}
                {server.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <div className='ml-auto'>
                      <DropdownMenu>
                        <DropdownMenuTrigger className='hover:cursor-pointer'>
                          <MoreVertical className='h-4 w-4 text-zinc-500' />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent side='left'>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className='flex items-center'>
                              <ShieldQuestion className='h-4 w-4 mr-2' />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>

                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  className='hover:cursor-pointer'
                                  onClick={() =>
                                    onRoleChange(member.id, 'GUEST')
                                  }
                                >
                                  <Shield className='h-4 w-4 mr-2' />
                                  Guest
                                  {member.role === 'GUEST' && (
                                    <Check className='h-4 w-4 ml-2' />
                                  )}
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className='hover:cursor-pointer'
                                  onClick={() =>
                                    onRoleChange(member.id, 'MODERATOR')
                                  }
                                >
                                  <ShieldCheck className='h-4 w-4 mr-2' />
                                  Moderator
                                  {member.role === 'MODERATOR' && (
                                    <Check className='h-4 w-4 ml-2' />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onMemberKick(member.id)}
                            className='hover:cursor-pointer'
                          >
                            <Gavel className='h-4 w-4 mr-2' /> Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <Loader2 className='animate-spin h-4 w-4 ml-auto text-zinc-500 ' />
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
