'use client';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

export type ServerSearchProps = {
  data: {
    label: string;
    type: 'channel' | 'member';
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
};

const ServerSearch = ({ data }: ServerSearchProps) => {
  const isMac = navigator.userAgent.toLowerCase().includes('mac');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition  '
      >
        <Search className='h-4 w-4 text-zinc-500 dark:text-zinc-400' />
        <p className='font-semibold text-zinc-500 dark:text-zinc-400 text-sm group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition'>
          Search
        </p>
        <kbd className='ml-auto pointer-events-none inline-flex items-center gap-1 rounded bg-muted font-mono text-[10px] font-medium text-muted-foreground  h-5 px-1.5 '>
          <span className='text-xs'>{isMac ? 'CMD' : 'CTRL'}</span> + K
        </kbd>
      </button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder='Search channels & members' />
        <CommandList>
          <CommandEmpty>No Results Found</CommandEmpty>

          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, name, icon }) => (
                  <CommandItem key={id}>
                    {icon} <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
