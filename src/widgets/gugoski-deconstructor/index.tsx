'use client';

import * as React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Sparkles,
  Guitar,
  PlusCircle,
  Download,
  Upload,
  Wand2,
  X,
} from 'lucide-react';
import {
  DECONSTRUCTOR_TRACKS,
  parseAsciiTabToDeconstructorTrack,
  type DeconstructorTrack,
} from '@/entities/deconstructor-track';
import { getDictionary, useLocaleStore } from '@/shared/i18n';
import { synthEngine } from '@/shared/lib/audio/synth-engine';
import { Button } from '@/shared/ui/button';
import { CircleOfFifthsHud } from './ui/circle-of-fifths-hud';
import { SyncedTabPlayer } from './ui/synced-tab-player';
import { ChordProgressionStrip } from './ui/chord-progression-strip';
import { GugoskiFretboardStage } from './ui/gugoski-fretboard-stage';

const CUSTOM_TRACKS_STORAGE_KEY = 'rifflore-custom-deconstructor-tracks-v1';

const SAMPLE_ASCII_TAB = `e|---0-------0-------|-------7---0-------|-------0-----------|-------------------|
B|-----0---0---0-----|-----0-------0-----|-----5-------7-----|-------0-----------|
G|-------0-------0---|---0-----------0---|---5-------7-------|-----2-------2-----|
D|-------------------|-------------------|-------------------|---1-------1-------|
A|-------------------|-------------------|-3-------5---------|-2-----------------|
E|-0-----------------|-0-----------------|-------------------|-------------------|`;

export function GugoskiDeconstructorWidget() {
  const { locale } = useLocaleStore();
  const dict = getDictionary(locale);

  const [customTracks, setCustomTracks] = React.useState<DeconstructorTrack[]>([]);
  const [trackId, setTrackId] = React.useState<string>(DECONSTRUCTOR_TRACKS[0].id);
  const [activeBarIndex, setActiveBarIndex] = React.useState<number>(0);
  const [activeNoteIndex, setActiveNoteIndex] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [neckWood, setNeckWood] = React.useState<'maple' | 'rosewood'>('maple');

  // Importer / Creator Studio Drawer state
  const [showImporter, setShowImporter] = React.useState(false);
  const [importTitle, setImportTitle] = React.useState('My Custom Riff Breakdown');
  const [importKeyRoot, setImportKeyRoot] = React.useState('E');
  const [importKeyMode, setImportKeyMode] = React.useState<'minor' | 'major'>('minor');
  const [importChords, setImportChords] = React.useState('Em, Em, C, B7');
  const [importMinFret, setImportMinFret] = React.useState(0);
  const [importMaxFret, setImportMaxFret] = React.useState(7);
  const [importAscii, setImportAscii] = React.useState(SAMPLE_ASCII_TAB);

  // Load saved custom tracks from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_TRACKS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DeconstructorTrack[];
        if (Array.isArray(parsed)) {
          setCustomTracks(parsed);
        }
      }
    } catch {
      // Ignore malformed storage
    }
  }, []);

  const allTracks = React.useMemo(
    () => [...DECONSTRUCTOR_TRACKS, ...customTracks],
    [customTracks]
  );

  const activeTrack: DeconstructorTrack = React.useMemo(
    () => allTracks.find((t) => t.id === trackId) ?? allTracks[0],
    [allTracks, trackId]
  );

  const currentBar = activeTrack.bars[activeBarIndex] ?? activeTrack.bars[0];
  const currentNoteEvent =
    currentBar.tabEvents[activeNoteIndex] ?? currentBar.tabEvents[0];

  const handleSelectBarAndNote = async (barIdx: number, noteIdx = 0) => {
    const bar = activeTrack.bars[barIdx];
    if (!bar) return;
    const clampedNoteIdx = Math.max(0, Math.min(noteIdx, bar.tabEvents.length - 1));
    setActiveBarIndex(barIdx);
    setActiveNoteIndex(clampedNoteIdx);

    const targetEv = bar.tabEvents[clampedNoteIdx];
    if (targetEv) {
      await synthEngine.playNote(targetEv.noteName, '2n');
    }
  };

  // True Note-by-Note Sequencer (plays every tab note in order and moves cursor)
  const stepCursorRef = React.useRef({ barIdx: 0, noteIdx: 0 });
  React.useEffect(() => {
    stepCursorRef.current = { barIdx: activeBarIndex, noteIdx: activeNoteIndex };
  }, [activeBarIndex, activeNoteIndex]);

  React.useEffect(() => {
    if (!isPlaying) return;

    // Play current note immediately when Play is pressed
    const initialBar = activeTrack.bars[stepCursorRef.current.barIdx];
    const initialEv = initialBar?.tabEvents[stepCursorRef.current.noteIdx];
    if (initialEv) {
      synthEngine.playNote(initialEv.noteName, '2n');
    }

    const stepMs = Math.max(220, Math.round((60 / activeTrack.bpm) * 580));

    const timer = setInterval(() => {
      const { barIdx, noteIdx } = stepCursorRef.current;
      const bar = activeTrack.bars[barIdx] ?? activeTrack.bars[0];
      let nextBarIdx = barIdx;
      let nextNoteIdx = noteIdx + 1;

      if (nextNoteIdx >= bar.tabEvents.length) {
        nextNoteIdx = 0;
        nextBarIdx = (barIdx + 1) % activeTrack.bars.length;
      }

      stepCursorRef.current = { barIdx: nextBarIdx, noteIdx: nextNoteIdx };
      setActiveBarIndex(nextBarIdx);
      setActiveNoteIndex(nextNoteIdx);

      const nextBar = activeTrack.bars[nextBarIdx];
      const nextEv = nextBar?.tabEvents[nextNoteIdx];
      if (nextEv) {
        synthEngine.playNote(nextEv.noteName, '2n');
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [isPlaying, activeTrack]);

  const handleCompileAsciiTrack = () => {
    const minF = Math.max(0, Math.min(15, importMinFret));
    const maxF = Math.max(minF + 2, Math.min(15, importMaxFret));
    const compiled = parseAsciiTabToDeconstructorTrack({
      title: importTitle.trim() || 'Custom Riff Breakdown',
      keyRoot: importKeyRoot,
      keyMode: importKeyMode,
      chordsCsv: importChords,
      boxRange: [minF, maxF],
      asciiTab: importAscii,
    });

    const updated = [compiled, ...customTracks];
    setCustomTracks(updated);
    try {
      localStorage.setItem(CUSTOM_TRACKS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }

    setIsPlaying(false);
    setTrackId(compiled.id);
    setActiveBarIndex(0);
    setActiveNoteIndex(0);
    setShowImporter(false);
  };

  const handleExportCurrentTrackJson = () => {
    const blob = new Blob([JSON.stringify(activeTrack, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTrack.id}.rifflore.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadJsonOrTabFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result ?? '');
      try {
        const parsed = JSON.parse(content) as DeconstructorTrack;
        if (parsed && parsed.id && Array.isArray(parsed.bars)) {
          const withUniqueId: DeconstructorTrack = {
            ...parsed,
            id: `${parsed.id}-${Date.now()}`,
          };
          const updated = [withUniqueId, ...customTracks];
          setCustomTracks(updated);
          localStorage.setItem(CUSTOM_TRACKS_STORAGE_KEY, JSON.stringify(updated));
          setIsPlaying(false);
          setTrackId(withUniqueId.id);
          setActiveBarIndex(0);
          setActiveNoteIndex(0);
          setShowImporter(false);
          return;
        }
      } catch {
        setImportTitle(file.name.replace(/\.[^.]+$/, ''));
        setImportAscii(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title & Action Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#2C2A28] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#22C55E]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{dict.deconstructor.badge}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-zinc-100 sm:text-3xl">
            {dict.deconstructor.title}
          </h1>
          <p className="mt-1 max-w-3xl text-xs text-zinc-400 sm:text-sm">
            {dict.deconstructor.subtitle}
          </p>
        </div>

        {/* Importer & JSON Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="studio"
            onClick={handleExportCurrentTrackJson}
            title="Export current riff breakdown as JSON"
          >
            <Download className="h-3.5 w-3.5 text-[#CEA15A]" />
            <span>{locale === 'uk' ? 'Експорт JSON' : 'Export JSON'}</span>
          </Button>

          <Button
            size="sm"
            variant="default"
            onClick={() => setShowImporter((prev) => !prev)}
          >
            <PlusCircle className="h-4 w-4" />
            <span>
              {locale === 'uk'
                ? '+ Імпорт Табу / Створити Розбір'
                : '+ Import Tab / Create Breakdown'}
            </span>
          </Button>
        </div>
      </div>

      {/* Collapsible Tab Importer & Auto-Harmony Compiler Studio */}
      {showImporter && (
        <div className="rounded-2xl border border-[#CEA15A]/50 bg-[#181716] p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#2C2A28] pb-3">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-[#CEA15A]" />
              <h2 className="font-display text-base font-bold text-zinc-100">
                {locale === 'uk'
                  ? 'Авто-Компілятор Розборів (ASCII Tab / JSON → Nikola Gugoski HUD)'
                  : 'Auto-Harmony Deconstructor Studio (ASCII Tab / JSON → Gugoski HUD)'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowImporter(false)}
              className="text-zinc-400 hover:text-zinc-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-xs text-zinc-400">
            {locale === 'uk'
              ? 'Встав стандартну 6-рядкову ASCII-табулатуру (наприклад, з Ultimate Guitar чи Songsterr) або завантаж .json файл. Наш рушій @tonaljs/tonal сам обчислить Римські цифри для Квінтового кола, побудує діаграми акордів, червоні точки гами та зелені векторні лінії!'
              : 'Paste any standard 6-line ASCII tab (from Ultimate Guitar / Songsterr) or upload a .json file. Our @tonaljs/tonal compiler automatically computes the Circle of Fifths Roman numerals, chord diagrams, red scale box dots, and green target vectors!'}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="block font-mono text-[11px] uppercase text-zinc-400">
                {locale === 'uk' ? 'Назва пісні / рифу' : 'Song / Riff Title'}
              </label>
              <input
                type="text"
                value={importTitle}
                onChange={(e) => setImportTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2C2A28] bg-[#121211] px-3 py-2 text-xs text-zinc-100"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase text-zinc-400">
                {locale === 'uk' ? 'Тональність (Root & Mode)' : 'Key (Root & Mode)'}
              </label>
              <div className="mt-1 flex gap-2">
                <select
                  value={importKeyRoot}
                  onChange={(e) => setImportKeyRoot(e.target.value)}
                  className="w-1/2 rounded-lg border border-[#2C2A28] bg-[#121211] px-2.5 py-2 font-mono text-xs text-zinc-100"
                >
                  {['A', 'B', 'C', 'D', 'E', 'F', 'F#', 'G', 'Bb'].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <select
                  value={importKeyMode}
                  onChange={(e) =>
                    setImportKeyMode(e.target.value as 'minor' | 'major')
                  }
                  className="w-1/2 rounded-lg border border-[#2C2A28] bg-[#121211] px-2.5 py-2 font-mono text-xs text-zinc-100"
                >
                  <option value="minor">Natural Minor</option>
                  <option value="major">Major</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase text-zinc-400">
                {locale === 'uk'
                  ? 'Акорди по тактах (через кому)'
                  : 'Chords per bar (comma-separated)'}
              </label>
              <input
                type="text"
                value={importChords}
                onChange={(e) => setImportChords(e.target.value)}
                placeholder="Em, Em, C, B7"
                className="mt-1 w-full rounded-lg border border-[#2C2A28] bg-[#121211] px-3 py-2 font-mono text-xs text-zinc-100"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase text-zinc-400">
                {locale === 'uk'
                  ? 'Лади зеленого боксу (Мін – Макс)'
                  : 'Green Scale Box Frets (Min – Max)'}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={importMinFret}
                  onChange={(e) => setImportMinFret(Number(e.target.value))}
                  className="w-1/2 rounded-lg border border-[#2C2A28] bg-[#121211] px-3 py-2 font-mono text-xs text-zinc-100"
                />
                <span className="text-zinc-500">–</span>
                <input
                  type="number"
                  min={2}
                  max={15}
                  value={importMaxFret}
                  onChange={(e) => setImportMaxFret(Number(e.target.value))}
                  className="w-1/2 rounded-lg border border-[#2C2A28] bg-[#121211] px-3 py-2 font-mono text-xs text-zinc-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase text-zinc-400">
                {locale === 'uk'
                  ? '6-рядкова ASCII Табулатура (Такти розділені символом | )'
                  : '6-Line ASCII Tab (Bars separated by | )'}
              </label>
              <label className="inline-flex items-center gap-1.5 font-mono text-xs text-[#CEA15A] hover:underline cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                <span>
                  {locale === 'uk'
                    ? 'Завантажити .json або .txt файл'
                    : 'Upload .json or .txt file'}
                </span>
                <input
                  type="file"
                  accept=".json,.txt,.tab"
                  onChange={handleUploadJsonOrTabFile}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              rows={6}
              value={importAscii}
              onChange={(e) => setImportAscii(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#2C2A28] bg-[#121211] p-3 font-mono text-xs leading-relaxed text-emerald-300"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              size="sm"
              variant="studio"
              onClick={() => setShowImporter(false)}
            >
              {locale === 'uk' ? 'Скасувати' : 'Cancel'}
            </Button>
            <Button size="sm" variant="default" onClick={handleCompileAsciiTrack}>
              <Wand2 className="h-4 w-4" />
              <span>
                {locale === 'uk'
                  ? 'Згенерувати Візуальний Розбір'
                  : 'Compile Visual Breakdown'}
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Top Track Selector & Playback Transport Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#181716] p-4">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[#CEA15A]">
            {dict.deconstructor.selectTrack} ({allTracks.length})
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {allTracks.map((tr) => {
              const selected = tr.id === activeTrack.id;
              return (
                <button
                  key={tr.id}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setTrackId(tr.id);
                    setActiveBarIndex(0);
                    setActiveNoteIndex(0);
                  }}
                  className={`flex flex-col justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-all cursor-pointer ${
                    selected
                      ? 'bg-[#CEA15A] text-zinc-950 font-bold shadow-[0_0_20px_rgba(206,161,90,0.3)]'
                      : 'border border-white/10 bg-[#121211] text-zinc-300 hover:border-[#CEA15A]/40'
                  }`}
                >
                  <span className="line-clamp-1">{tr.title[locale]}</span>
                  <span
                    className={`mt-1 font-mono text-[10px] ${
                      selected ? 'text-zinc-900 font-semibold' : 'text-zinc-500'
                    }`}
                  >
                    {tr.scaleBadgeLabel} · Frets {tr.scaleBoxFretRange[0]}–
                    {tr.scaleBoxFretRange[1]} · {tr.bpm} BPM
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transport & Neck Wood Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
          <div className="text-xs text-zinc-400">
            <strong className="text-zinc-200">{activeTrack.title[locale]}:</strong>{' '}
            {activeTrack.subtitle[locale]}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="studio"
              onClick={() =>
                handleSelectBarAndNote(
                  (activeBarIndex - 1 + activeTrack.bars.length) %
                    activeTrack.bars.length,
                  0
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
                handleSelectBarAndNote(
                  (activeBarIndex + 1) % activeTrack.bars.length,
                  0
                )
              }
            >
              <SkipForward className="h-3.5 w-3.5" />
            </Button>

            <button
              type="button"
              onClick={() =>
                setNeckWood((w) => (w === 'maple' ? 'rosewood' : 'maple'))
              }
              className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-[#121211] px-3 py-1.5 font-mono text-xs text-zinc-300 hover:border-amber-400/50 cursor-pointer"
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
      </div>

      {/* ROW 1: Nikola Gugoski Top Split — Circle of Fifths (Left) + Dark Synced Tab (Right) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#181716] p-4 lg:col-span-4">
          <div className="mb-2 w-full flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
              {dict.deconstructor.circleTitle}
            </span>
            <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-bold text-emerald-400 border border-emerald-500/30">
              {currentBar.chordName} ({currentBar.romanNumeral})
            </span>
          </div>
          <CircleOfFifthsHud
            activeKey={currentBar.circleActiveKey}
            activeRing={currentBar.circleRing}
            romanNumeral={currentBar.romanNumeral}
            romanSub={currentBar.romanSub}
            diatonicMajors={activeTrack.diatonicMajorNeighbors}
            diatonicMinors={activeTrack.diatonicMinorNeighbors}
          />
        </div>

        <div className="flex flex-col justify-between gap-4 lg:col-span-8">
          <SyncedTabPlayer
            bars={activeTrack.bars}
            activeBarIndex={activeBarIndex}
            activeNoteIndex={activeNoteIndex}
            onSelectBar={(bIdx, nIdx) => handleSelectBarAndNote(bIdx, nIdx ?? 0)}
          />

          {/* Live Harmonic Insight Banner */}
          <div className="rounded-xl border border-[#CEA15A]/30 bg-[#1B1916] p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#CEA15A]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  {locale === 'uk' ? 'Гармонічний аналіз такту' : 'Bar Harmonic Analysis'} #
                  {currentBar.barNumber}: {currentBar.chordName} ({currentBar.romanNumeral})
                </span>
              </div>
              {currentNoteEvent && (
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-xs font-bold text-emerald-300 border border-emerald-500/40">
                  {locale === 'uk' ? 'Нота:' : 'Playing:'} {currentNoteEvent.noteName} (
                  {locale === 'uk' ? 'Струна' : 'Str'} {currentNoteEvent.string},{' '}
                  {locale === 'uk' ? 'Лад' : 'Fret'} {currentNoteEvent.fret})
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm text-zinc-200 leading-relaxed">
              {currentBar.harmonyCommentary[locale]}
            </p>
          </div>
        </div>
      </div>

      {/* ROW 2: Chord Progression Diagrams with Red Highlight Frame */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          {dict.deconstructor.chordStripTitle}
        </span>
        <ChordProgressionStrip
          bars={activeTrack.bars}
          activeBarIndex={activeBarIndex}
          onSelectBar={(bIdx) => handleSelectBarAndNote(bIdx, 0)}
        />
      </div>

      {/* ROW 3: Realistic Fretboard with Green Scale Box + Red Scale Notes + Green Active Vector Path */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            {dict.deconstructor.fretboardTitle}
          </span>
        </div>

        <GugoskiFretboardStage
          neckWood={neckWood}
          scaleBadgeLabel={activeTrack.scaleBadgeLabel}
          scaleBoxFretRange={activeTrack.scaleBoxFretRange}
          scaleBoxNotes={activeTrack.scaleBoxNotes}
          activePathNodes={currentBar.activePathNodes}
          currentPlayingCoord={
            currentNoteEvent
              ? { string: currentNoteEvent.string, fret: currentNoteEvent.fret }
              : null
          }
        />
      </div>
    </div>
  );
}
