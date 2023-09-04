'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useModal } from '@/hooks/useModalStore';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export const LeaveServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === 'leaveServer';

  const { server } = data;

  const handleLeaveServer = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push('/');
    } catch (error: any) {
      console.error(
        '🚀 ~ fil leaveServer ~ onNewInviteCode ~ error:',
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
            Leave Server
          </DialogTitle>

          <DialogDescription className='text-center'>
            Are you sure you want to leave{' '}
            <span className='text-indigo-500 capitalize'>{server?.name}</span>?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='bg-gray-100 px-6 py-4 '>
          <div className='w-full  flex items-center justify-between'>
            <Button
              disabled={isLoading}
              variant='ghost'
              className='block'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant='primary'
              className='block'
              onClick={handleLeaveServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
