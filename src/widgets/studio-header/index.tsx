'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  BookOpen,
  Gamepad2,
  Disc3,
  Compass,
  Volume2,
  VolumeX,
  Globe,
  Music2,
} from 'lucide-react';
import { synthEngine, type SynthTonePreset } from '@/shared/lib/audio/synth-engine';
import { useLocaleStore, getDictionary } from '@/shared/i18n';
import { useProgressStore } from '@/shared/store/use-progress-store';

export function StudioHeader() {
  const pathname = usePathname();
  const { locale, setLocale, noteNaming, setNoteNaming } = useLocaleStore();
  const dict = getDictionary(locale);
  const { streakDays, xp, reviewQueue } = useProgressStore();

  const [muted, setMuted] = React.useState(false);
  const [preset, setPreset] = React.useState<SynthTonePreset>('clean-tube');

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    synthEngine.setMuted(next);
  };

  const handlePresetChange = (nextPreset: SynthTonePreset) => {
    setPreset(nextPreset);
    synthEngine.setPreset(nextPreset);
    synthEngine.playNote('E3', '16n');
  };

  const navItems = [
    { href: '/', label: dict.nav.learn, icon: BookOpen },
    {
      href: '/play',
      label: dict.nav.play,
      icon: Gamepad2,
      badgeCount: reviewQueue.length,
    },
    { href: '/deconstructor', label: dict.nav.deconstructor, icon: Disc3 },
    { href: '/sandbox', label: dict.nav.sandbox, icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#2C2A28] bg-[#121211]/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
        {/* Brand Logo (Gitori-inspired warm gold + matte charcoal) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#CEA15A]/40 bg-[#1B1A19] shadow-[0_0_16px_rgba(206,161,90,0.2)] transition-transform group-hover:scale-105">
            <Flame className="h-5 w-5 text-[#CEA15A]" />
            <span
              className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]"
              title="Audio Stage Active"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-extrabold tracking-tight text-zinc-100">
                RIFF<span className="text-[#CEA15A]">LORE</span>
              </span>
              <span className="hidden rounded-md border border-[#CEA15A]/30 bg-[#CEA15A]/10 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#CEA15A] sm:inline-block">
                STAGE v2.0
              </span>
            </div>
            <p className="hidden text-[11px] text-zinc-400 lg:block">
              {locale === 'uk'
                ? 'Інтерактивна школа гітари & Деконструктор рифів'
                : 'Interactive Guitar Method & Riff Deconstructor'}
            </p>
          </div>
        </Link>

        {/* Center App Navigation */}
        <nav className="order-3 flex w-full items-center justify-start gap-1 overflow-x-auto rounded-xl border border-[#2C2A28] bg-[#181716] p-1 lg:order-2 lg:w-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/' || pathname === '/theory'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#CEA15A] text-zinc-950 shadow-[0_0_12px_rgba(206,161,90,0.25)]'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
                {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                  <span
                    className={`ml-0.5 rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#9F3A23] text-white'
                        : 'bg-[#9F3A23] text-amber-100'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Streak, Language (UA/EN), Note Nomenclature (C / До), Synth */}
        <div className="order-2 flex items-center gap-2 lg:order-3">
          {/* Streak & XP Pill */}
          <div className="hidden items-center gap-2 rounded-xl border border-[#2C2A28] bg-[#181716] px-2.5 py-1 sm:flex">
            <span className="flex items-center gap-1 font-mono text-xs font-bold text-[#CEA15A]">
              🔥 {streakDays}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="font-mono text-xs font-semibold text-zinc-300">
              {xp} XP
            </span>
          </div>

          {/* Note Nomenclature Switcher: C D E vs C (До) */}
          <button
            type="button"
            onClick={() => setNoteNaming(noteNaming === 'dual' ? 'letter' : 'dual')}
            title={
              noteNaming === 'dual'
                ? dict.header.noteModeDual
                : dict.header.noteModeLetter
            }
            className="flex items-center gap-1.5 rounded-xl border border-[#2C2A28] bg-[#181716] px-2.5 py-1.5 font-mono text-[11px] font-semibold text-zinc-200 hover:border-[#CEA15A]/50 cursor-pointer"
          >
            <Music2 className="h-3.5 w-3.5 text-[#CEA15A]" />
            <span>{noteNaming === 'dual' ? 'C (До)' : 'C D E'}</span>
          </button>

          {/* Language Switcher: UA | EN */}
          <div className="flex items-center rounded-xl border border-[#2C2A28] bg-[#181716] p-0.5">
            <Globe className="ml-2 mr-1 h-3.5 w-3.5 text-zinc-400 hidden sm:inline" />
            <button
              type="button"
              onClick={() => setLocale('uk')}
              className={`rounded-lg px-2 py-1 font-mono text-[11px] font-bold transition-colors cursor-pointer ${
                locale === 'uk'
                  ? 'bg-[#CEA15A] text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              UA
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`rounded-lg px-2 py-1 font-mono text-[11px] font-bold transition-colors cursor-pointer ${
                locale === 'en'
                  ? 'bg-[#CEA15A] text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              EN
            </button>
          </div>

          {/* Amp Tone Channel + Mute */}
          <div className="hidden items-center gap-1 rounded-xl border border-[#2C2A28] bg-[#181716] p-1 xl:flex">
            {(
              [
                { id: 'clean-tube', label: dict.header.toneClean },
                { id: 'warm-crunch', label: dict.header.toneCrunch },
                { id: 'harmonic-bell', label: dict.header.toneBell },
              ] as const
            ).map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => handlePresetChange(ch.id)}
                className={`rounded-lg px-2 py-0.5 font-mono text-[10px] transition-colors cursor-pointer ${
                  preset === ch.id
                    ? 'bg-[#CEA15A]/20 text-[#CEA15A] border border-[#CEA15A]/40 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#2C2A28] bg-[#181716] text-zinc-300 hover:border-[#CEA15A]/40 cursor-pointer"
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-red-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-[#CEA15A]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
