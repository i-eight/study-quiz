import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Study Quiz App',
  description: 'Take a photo of a textbook page and generate quiz questions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <main className="container mx-auto max-w-4xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
