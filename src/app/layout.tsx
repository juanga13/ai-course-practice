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
      <body className={`h-screen w-screen bg-white text-gray-900 font-text`}>
        <div className="zoom-container">{children}</div>
      </body>
    </html>
  );
}
