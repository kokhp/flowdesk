import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

import { product } from '@/config/product';

const productName = product.name;
const productDescription = product.description || 'Built with SaaS Chassis';

export const metadata: Metadata = {
  title: { default: productName, template: `%s | ${productName}` },
  description: productDescription,
  openGraph: {
    title: productName,
    description: productDescription,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
