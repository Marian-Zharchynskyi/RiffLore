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
  title: 'RiffLore — Interactive Guitar Method, Drills & Riff Deconstructor',
  description:
    'Interactive guitar learning platform (UA / EN): step-by-step fretboard lessons from zero, 60-second note drills, spaced repetition, and Nikola Gugoski-style visual Riff & Solo Deconstructor.',
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
      <body className="min-h-screen bg-[#121211] text-[#F3F4F6] selection:bg-[#CEA15A]/30 selection:text-amber-200 flex flex-col">
        <StudioHeader />
        <main className="flex-1">{children}</main>
        <footer className="mt-16 border-t border-[#2C2A28] bg-[#121211] py-6">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-zinc-500 sm:flex-row sm:px-6">
            <div className="font-mono">
              <strong className="text-zinc-300">RIFFLORE STAGE v2.0</strong> · App-First Studio Design · UA / EN
            </div>
            <div className="font-mono">
              Next.js · Tonal.js · Tone.js · Feature-Sliced Architecture
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
