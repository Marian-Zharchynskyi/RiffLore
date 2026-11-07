import type { Metadata } from 'next';
import {
  Space_Grotesk,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';
import { StudioHeader } from '@/widgets/studio-header';

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
  title: 'RiffLore — Interactive Guitar Theory & Rock Lore Studio',
  description:
    'Інтерактивна платформа для гітаристів: музична теорія, живий SVG-гриф зі звуком Tone.js, розбір культових рифів та лор рок-музики.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#0B0C0E] text-[#F3F4F6] selection:bg-amber-500/30 selection:text-amber-200 flex flex-col">
        <StudioHeader />
        <main className="flex-1">{children}</main>
        <footer className="mt-16 border-t border-white/10 bg-[#0B0C0E] py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-zinc-500 sm:flex-row sm:px-6">
            <div className="font-mono">
              <strong className="text-zinc-300">RIFFLORE STUDIO</strong> · Tube Amp &amp; Boutique
              Design System · Feature-Sliced Architecture
            </div>
            <div className="font-mono">
              Powered by Next.js · Tonal.js · Tone.js · Open-Access Dual-Mode
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
