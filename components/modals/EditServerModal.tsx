'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModalStore';

const serverFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Server name is required',
  }),
  imageUrl: z.string().min(2, {
    message: 'Server image is required',
  }),
});

export const EditServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();

  const { server } = data;

  const isModalOpen = isOpen && type === 'editServer';

  const form = useForm({
    resolver: zodResolver(serverFormSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name);
      form.setValue('imageUrl', server.imgUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof serverFormSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);
      onClose();
      form.reset();
      router.refresh();
    } catch (error) {
      console.error(
        '🚀 ~ file: EditServerModal.tsx:55 ~ onSubmit ~ error:',
        error
      );
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  //! Hydration Error on mount: resolve hydration error
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 px-4 overflow-hidden'>
        <DialogHeader className='p-6'>
          <DialogTitle className='text-3xl font-semibold text-center capitalize'>
            Edit server {server?.name}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <div className='flex justify-center items-center text-center'>
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint='serverImage'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold text-lg'>
                    Server Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Enter server name...'
                      {...field}
                      className='bg-gray-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                    />
                  </FormControl>

                  <FormMessage className='text-red-600' />
                </FormItem>
              )}
            />

            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button type='submit' variant='primary' disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
