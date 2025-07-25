import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/src/components/ui/sonner';
import { Pacifico } from 'next/font/google';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Task',
  description: 'Task app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${pacifico.className} antialiased bg-white`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
