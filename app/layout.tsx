import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import image from '@/public/kris.png'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Krishna AI",
  description: "Let god solve all of your problems",
  metadataBase: new URL('https://krishna-ai.vercel.app'),
  openGraph: {
    images: image.src,

  },
  twitter: {
    card: "summary_large_image",
    title: "Krishna Ai",
    creator: "Dhruv Bhavsar",
    creatorId: "@devsbond007",
    site: 'krishna-ai.vercel.app',
    images: image.src,
    description: 'Talk to god.',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
