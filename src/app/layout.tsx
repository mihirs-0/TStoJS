import AntStyledComponentsRegistry from '@/webpages/ui/ant/AntRegistryClient';
import RootLayoutClient from '@/webpages/ui/layout/RootLayoutClient';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
      <body className={inter.variable}>
        <AntStyledComponentsRegistry>
          <RootLayoutClient>{children}</RootLayoutClient>
        </AntStyledComponentsRegistry>
      </body>
    </html>
  );
}
