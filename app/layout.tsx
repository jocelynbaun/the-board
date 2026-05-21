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

// Inline no-flash script: runs before paint, sets data-theme on <html>
// from localStorage (or OS preference) so dark-mode users never see a
// white flash on load. Kept inline + small on purpose.
const themeInitScript = `
(function() {
  try {
    var stored = window.localStorage.getItem('board-theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${sourceSerif4.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
