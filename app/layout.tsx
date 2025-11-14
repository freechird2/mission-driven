import DialogContainer from '@/components/dialog/DialogContainer';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mission Driven 과제 전형',
  description: 'Mission Driven 과제 전형',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <DialogContainer />
        <Toaster
          className="test"
          position="top-center"
          // offset={{
          //   top: '40px',
          // }}
          toastOptions={{
            duration: 1300,
          }}
        />
      </body>
    </html>
  );
}
