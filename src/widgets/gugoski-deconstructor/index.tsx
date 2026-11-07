'use client';

import * as React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Sparkles,
  Guitar,
} from 'lucide-react';
import {
  DECONSTRUCTOR_TRACKS,
  type DeconstructorTrack,
} from '@/entities/deconstructor-track';
import { getDictionary, useLocaleStore } from '@/shared/i18n';
import { synthEngine } from '@/shared/lib/audio/synth-engine';
import { Button } from '@/shared/ui/button';
import { CircleOfFifthsHud } from './ui/circle-of-fifths-hud';
import { SyncedTabPlayer } from './ui/synced-tab-player';
import { ChordProgressionStrip } from './ui/chord-progression-strip';
import { GugoskiFretboardStage } from './ui/gugoski-fretboard-stage';

export function GugoskiDeconstructorWidget() {
  const { locale } = useLocaleStore();
  const dict = getDictionary(locale);

  const [trackId, setTrackId] = React.useState<string>(DECONSTRUCTOR_TRACKS[0].id);
  const [activeBarIndex, setActiveBarIndex] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [neckWood, setNeckWood] = React.useState<'maple' | 'rosewood'>('maple');

  const activeTrack: DeconstructorTrack = React.useMemo(
    () =>
      DECONSTRUCTOR_TRACKS.find((t) => t.id === trackId) ?? DECONSTRUCTOR_TRACKS[0],
    [trackId]
  );

  const currentBar = activeTrack.bars[activeBarIndex] ?? activeTrack.bars[0];

  const playBarAudio = React.useCallback(async (barIdx: number, track: DeconstructorTrack) => {
    const bar = track.bars[barIdx];
    if (!bar) return;
    const notes = bar.tabEvents.map((e) => e.noteName);
    await synthEngine.playChordOrInterval(notes, 240);
  }, []);

  const handleSelectBar = async (idx: number) => {
    setActiveBarIndex(idx);
    await playBarAudio(idx, activeTrack);
  };

  React.useEffect(() => {
    if (!isPlaying) return;

    playBarAudio(activeBarIndex, activeTrack);

    const timer = setInterval(() => {
      setActiveBarIndex((prev) => {
        const next = (prev + 1) % activeTrack.bars.length;
        playBarAudio(next, activeTrack);
        return next;
      });
    }, 2400);

    return () => clearInterval(timer);
  }, [isPlaying, activeTrack, activeBarIndex, playBarAudio]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Track Selector & Playback Transport Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#181716] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#CEA15A]">
            {dict.deconstructor.selectTrack}
          </span>
          <div className="flex flex-wrap gap-2">
            {DECONSTRUCTOR_TRACKS.map((tr) => {
              const selected = tr.id === activeTrack.id;
              return (
                <button
                  key={tr.id}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setTrackId(tr.id);
                    setActiveBarIndex(0);
                  }}
                  className={`rounded-lg px-3.5 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                    selected
                      ? 'bg-[#CEA15A] text-zinc-950 shadow-md'
                      : 'border border-white/10 bg-[#121211] text-zinc-300 hover:border-white/25'
                  }`}
                >
                  {tr.title[locale]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transport & Neck Wood Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="studio"
            onClick={() =>
              handleSelectBar(
                (activeBarIndex - 1 + activeTrack.bars.length) % activeTrack.bars.length
              )
            }
          >
            <SkipBack className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="sm"
            variant="default"
            onClick={() => setIsPlaying((p) => !p)}
            className="min-w-[8.5rem]"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>{dict.deconstructor.playBtn}</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="studio"
            onClick={() =>
              handleSelectBar((activeBarIndex + 1) % activeTrack.bars.length)
            }
          >
            <SkipForward className="h-3.5 w-3.5" />
          </Button>

          <button
            type="button"
            onClick={() =>
              setNeckWood((w) => (w === 'maple' ? 'rosewood' : 'maple'))
            }
            className="ml-2 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-[#121211] px-3 py-1.5 font-mono text-xs text-zinc-300 hover:border-amber-400/50 cursor-pointer"
          >
            <Guitar className="h-3.5 w-3.5 text-[#CEA15A]" />
            <span>
              {neckWood === 'maple'
                ? dict.deconstructor.neckWoodMaple
                : dict.deconstructor.neckWoodRosewood}
            </span>
          </button>
        </div>
      </div>

      {/* ROW 1: Nikola Gugoski Top HUD (Circle of Fifths Left + Synced Dark Tab Right) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <CircleOfFifthsHud
          activeKey={currentBar.circleActiveKey}
          activeRing={currentBar.circleRing}
          romanNumeral={currentBar.romanNumeral}
          romanSub={currentBar.romanSub}
          diatonicMajors={activeTrack.diatonicMajorNeighbors}
          diatonicMinors={activeTrack.diatonicMinorNeighbors}
          onSelectChord={(chordName) => {
            const idx = activeTrack.bars.findIndex((b) => b.chordName === chordName);
            if (idx >= 0) handleSelectBar(idx);
          }}
        />

        <SyncedTabPlayer
          bars={activeTrack.bars}
          activeBarIndex={activeBarIndex}
          onSelectBar={handleSelectBar}
        />
      </div>

      {/* Live Harmonic Commentary Banner for Active Bar */}
      <div className="flex items-start gap-3 rounded-xl border border-[#CEA15A]/40 bg-[#181716] px-4 py-3.5">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#CEA15A]" />
        <div className="text-sm text-zinc-200 leading-relaxed">
          <span className="mr-2 rounded bg-[#16A34A] px-2 py-0.5 font-mono text-xs font-bold text-white">
            {currentBar.chordName} ({currentBar.romanNumeral})
          </span>
          {currentBar.harmonyCommentary[locale]}
        </div>
      </div>

      {/* ROW 2: Chord Progression Strip with Active Red Highlight Box */}
      <ChordProgressionStrip
        bars={activeTrack.bars}
        activeBarIndex={activeBarIndex}
        onSelectBar={handleSelectBar}
      />

      {/* ROW 3: Fretboard Stage with Green Scale Box, Red Scale Dots & Green Connected Vector Path */}
      <GugoskiFretboardStage
        scaleBadgeLabel={activeTrack.scaleBadgeLabel}
        scaleBoxFretRange={activeTrack.scaleBoxFretRange}
        scaleBoxNotes={activeTrack.scaleBoxNotes}
        activePathNodes={currentBar.activePathNodes}
        neckWood={neckWood}
      />
    </div>
  );
}
