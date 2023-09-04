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
import { Button } from '@/components/ui/button';

export const DeleteServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === 'deleteServer';

  const { server } = data;

  const handleDeleteServer = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/servers/${server?.id}`);

      onClose();
      router.refresh();
      router.push('/');
    } catch (error: any) {
      console.error(
        '🚀 ~ fil deleteServer ~ onNewInviteCode ~ error:',
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
            Delete Server
          </DialogTitle>

          <DialogDescription className='text-center'>
            Are you sure you want to do this?
            <br />
            <span className='text-indigo-500 font-semibold mx-1 capitalize'>
              {server?.name}
            </span>
            will be permanently deleted.
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
              onClick={handleDeleteServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
