import type { Metadata } from 'next';
import { Lora, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lora-loaded',
  display: 'swap',
});

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-source-serif-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Board',
  description: 'A personal to-do list for the one thing that matters today.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${sourceSerif4.variable}`}>
      <body>{children}</body>
    </html>
  );
}
