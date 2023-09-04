'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useModal } from '@/hooks/useModalStore';
import { useOrigin } from '@/hooks/useOrigin';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { CheckCheck, Copy, RefreshCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const InvitePeopleModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isModalOpen = isOpen && type === 'invite';

  const { server } = data;

  const inviteLink = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const onNewInviteCode = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen('invite', { server: response.data });
    } catch (error: any) {
      console.error(
        '🚀 ~ file: InvitePeopleModal.tsx:44 ~ onNewInviteCode ~ error:',
        error?.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  //! Hydration Error on mount: resolve hydration error
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 px-4 overflow-hidden'>
        <DialogHeader className='p-6'>
          <DialogTitle className='text-3xl font-semibold text-center capitalize'>
            Invite Friends
          </DialogTitle>
          <div className='p-6'>
            <Label className='uppercase text-sm font-semibold text-zinc-500 dark:text-secondary/70 '>
              Server Invite Link
            </Label>

            <div className='flex items-center gap-x-2 mt-2'>
              <Input
                disabled={isLoading}
                value={inviteLink}
                readOnly
                className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
              />
              <Button disabled={isLoading} onClick={onCopy} size='icon'>
                {isCopied ? (
                  <CheckCheck className='h-4 w-4 text-emerald-600' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </Button>
            </div>

            <Button
              onClick={onNewInviteCode}
              disabled={isLoading}
              className='text-xs text-zinc-500 my-4'
              variant='link'
              size='sm'
            >
              Generate new link <RefreshCcw className='h-4 w-4 ml-2' />
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
