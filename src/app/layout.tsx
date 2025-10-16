export const metadata = {
  title: 'AI Chat',
  description: 'Image/PDF analyzer',
  icons: {
    icon: '/Mystify.ico',
  },
};

import './globals.css';
import { ReactNode } from 'react';
import localFont from 'next/font/local';
import { Text } from '../components/Text';

const appFontTitle = localFont({
  src: '../assets/ms_sans_serif_bold.woff2',
  display: 'swap',
  variable: '--font-title',
});

const appFontText = localFont({
  src: '../assets/ms_sans_serif.woff2',
  display: 'swap',
  variable: '--font-text',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${appFontTitle.variable} ${appFontText.variable}`}
    >
      <body
        className={`h-screen w-screen overflow-hidden bg-white text-gray-900 font-text flex flex-col`}
      >
        <div className="zoom-container h-full w-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
