'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, BookOpen, Compass, Volume2, VolumeX, Radio } from 'lucide-react';
import { synthEngine, type SynthTonePreset } from '@/shared/lib/audio/synth-engine';
import { Button } from '@/shared/ui/button';

export function StudioHeader() {
  const pathname = usePathname();
  const [muted, setMuted] = React.useState(false);
  const [preset, setPreset] = React.useState<SynthTonePreset>('warm-crunch');

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
    { href: '/', label: 'Студія (Hub)', icon: Flame },
    { href: '/theory', label: 'Уроки Теорії', icon: BookOpen },
    { href: '/sandbox', label: 'Пісочниця Грифу', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0C0E]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo + Tube Pilot Light */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/40 bg-[#131519] shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-transform group-hover:scale-105">
            <Flame className="h-5 w-5 text-amber-400" />
            <span
              className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]"
              title="Tube Amp Standby: ON"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-zinc-100">
                RIFF<span className="text-amber-400">LORE</span>
              </span>
              <span className="hidden rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-300 sm:inline-block">
                Studio v0.1
              </span>
            </div>
            <p className="hidden text-[11px] text-zinc-400 sm:block">
              Guitar Theory &amp; Rock Lore Lab
            </p>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#131519] p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 font-semibold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Amp Channel & Master Audio Controls */}
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#131519] px-2 py-1">
            <Radio className="mr-1 h-3.5 w-3.5 text-amber-400" />
            {(
              [
                { id: 'clean-tube', label: 'Clean' },
                { id: 'warm-crunch', label: 'Crunch' },
                { id: 'harmonic-bell', label: 'Bell' },
              ] as const
            ).map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => handlePresetChange(ch.id)}
                className={`rounded px-2 py-0.5 font-mono text-[11px] transition-colors cursor-pointer ${
                  preset === ch.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          <Button
            size="icon"
            variant="studio"
            onClick={toggleMute}
            aria-label={muted ? 'Увімкнути звук' : 'Вимкнути звук'}
            title={muted ? 'Увімкнути звук (Tone.js)' : 'Вимкнути звук'}
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-red-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-amber-400" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
