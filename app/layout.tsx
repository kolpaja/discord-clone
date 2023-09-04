import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';

import { ModalProvider } from '@/components/providers/modal-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

import { cn } from '@/lib/utils';

import './globals.css';

const customFont = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Team Chat',
  description: 'Team chat app similar to discord app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          className={cn(customFont.className, 'bg-white dark:bg-[#313338]')}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            storageKey='discord-theme'
            enableSystem={false}
          >
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
