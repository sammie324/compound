import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Compound - Visual Execution Board',
  description: 'Track outcomes, not tasks. Execute your goals with momentum.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-theme text-theme antialiased`}>
        {children}
      </body>
    </html>
  );
}