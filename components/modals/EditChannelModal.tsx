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
  DialogTrigger,
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
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModalStore';
import { ChanelType } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import qs from 'query-string';

const serverFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Channel name is required',
    })
    .refine((name) => name !== 'general', {
      message: "Channel name can not be 'general'",
    }),
  type: z.nativeEnum(ChanelType),
});

export const EditChannelModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();

  const { server, channel } = data;

  const isModalOpen = isOpen && type === 'editChannel';

  const form = useForm({
    resolver: zodResolver(serverFormSchema),
    defaultValues: {
      name: '',
      type: channel?.type || ChanelType.TEXT,
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue('type', channel.type);
      form.setValue('name', channel.name);
    }
  }, [channel, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof serverFormSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.patch(url, values);
      onClose();
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(
        '🚀 ~ file: EditChannelModal.tsx:93 ~ onSubmit ~ error:',
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
          <DialogTitle className='text-3xl font-semibold text-center'>
            Edit Channel #{channel?.name}
          </DialogTitle>

          <DialogDescription className='text-center'></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold text-lg'>
                    Channel Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Enter channel name...'
                      {...field}
                      className='bg-gray-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                    />
                  </FormControl>

                  <FormMessage className='text-red-600' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold text-lg'>
                    Channel Type
                  </FormLabel>

                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='bg-zinc-300/50 border-0 text-black capitalize outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0'>
                          <SelectValue placeholder='select a channel type' />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {Object.values(ChanelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className='capitalize'
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
