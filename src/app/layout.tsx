import type { Metadata } from 'next';
import {
  Space_Grotesk,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'RiffLore Mobile — Навчання гри на гітарі з Нуля до Про',
  description:
    'Гейміфікований мобільний додаток для вивчення гітари з нуля до рівня про за матеріалами Next Level Guitar (David Taub) та Learn & Master Guitar (Steve Krenz).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased flex flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
