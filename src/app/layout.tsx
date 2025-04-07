import AntStyledComponentsRegistry from '@/webpages/ui/ant/AntRegistryClient';
import RootLayoutClient from '@/webpages/ui/layout/RootLayoutClient';
import { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'JSON Constructor Agent',
  description: 'Scout technical exercise',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntStyledComponentsRegistry>
          <RootLayoutClient>{children}</RootLayoutClient>
        </AntStyledComponentsRegistry>
      </body>
    </html>
  );
}
