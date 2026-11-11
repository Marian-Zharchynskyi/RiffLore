'use client';

import React, { useState } from 'react';
import {
  Flame,
  Search,
  Bell,
  Play,
  CheckCircle2,
  Sparkles,
  Trophy,
  BookOpen,
  Compass,
  User,
  ChevronRight,
  ChevronDown,
  Zap,
  Star,
  Volume2,
  ArrowLeft,
  Check,
  Award,
  Palette,
  Layers,
  Columns2,
  Smartphone,
  Music2,
  Clock,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ZERO_TO_PRO_MODULES,
  CURRICULUM_STATS,
  type CurriculumModule,
  type CurriculumLesson,
  type ChordDiagramData,
  type SkillTier,
} from '@/entities/course/zero-to-pro-curriculum';

// ============================================================================
// DESIGN SYSTEM TOKENS FOR WARM CREAM VARIATIONS (UI/UX BEST PRACTICES)
// ============================================================================

export type PaletteId =
  | 'honey-studio'
  | 'terracotta-sunburst'
  | 'cream-indigo'
  | 'matcha-sage'
  | 'editorial-pop';

export type CardStyleId = 'soft-elevated' | 'crisp-editorial' | 'neo-border';

export interface WarmPaletteConfig {
  id: PaletteId;
  name: string;
  badge: string;
  description: string;
  canvasBg: string;
  cardBg: string;
  subtleSurfaceBg: string;
  topGlowGradient: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primaryBg: string;
  primaryText: string;
  primarySoftBg: string;
  primarySoftText: string;
  secondaryAccent: string;
  secondarySoftBg: string;
  secondarySoftText: string;
  streakBg: string;
  streakBorder: string;
  streakIconBg: string;
  streakTitle: string;
  challengeBg: string;
  challengeText: string;
  challengeSubtext: string;
  borderSubtle: string;
  swatchColors: [string, string, string, string];
}

export const WARM_PALETTES: Record<PaletteId, WarmPaletteConfig> = {
  'honey-studio': {
    id: 'honey-studio',
    name: '1. Honey & Espresso',
    badge: 'Sharda Refined · Рекомендовано',
    description:
      'М’який кремовий фон слонової кістки, глибокий еспресо для контрасту та теплий медово-золотий акцент без різкого жовтого.',
    canvasBg: '#FAF7F0',
    cardBg: '#FFFFFF',
    subtleSurfaceBg: '#F3EFE4',
    topGlowGradient:
      'linear-gradient(180deg, rgba(234, 179, 8, 0.24) 0%, rgba(245, 158, 11, 0.06) 65%, rgba(250, 247, 240, 0) 100%)',
    textPrimary: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#78716C',
    primaryBg: '#1C1917',
    primaryText: '#FAF7F0',
    primarySoftBg: '#FEF3C7',
    primarySoftText: '#92400E',
    secondaryAccent: '#D97706',
    secondarySoftBg: '#FDE68A',
    secondarySoftText: '#78350F',
    streakBg: '#FFFBEB',
    streakBorder: '#FDE68A',
    streakIconBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    streakTitle: '#B45309',
    challengeBg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    challengeText: '#1C1917',
    challengeSubtext: '#78350F',
    borderSubtle: '#E7E0D3',
    swatchColors: ['#FAF7F0', '#1C1917', '#D97706', '#FDE68A'],
  },
  'terracotta-sunburst': {
    id: 'terracotta-sunburst',
    name: '2. Terracotta & Sunburst',
    badge: 'Гітарна акустика · ArtMaster',
    description:
      'Теплий пергаментний фон із насиченим теракотово-бурштиновим акцентом (колір гітарного дерева й лампового підсилювача).',
    canvasBg: '#FBF8F3',
    cardBg: '#FFFFFF',
    subtleSurfaceBg: '#F4EDE2',
    topGlowGradient:
      'linear-gradient(180deg, rgba(234, 88, 12, 0.16) 0%, rgba(251, 146, 60, 0.05) 65%, rgba(251, 248, 243, 0) 100%)',
    textPrimary: '#231B16',
    textSecondary: '#615249',
    textMuted: '#8C7A6B',
    primaryBg: '#EA580C',
    primaryText: '#FFFFFF',
    primarySoftBg: '#FFEDD5',
    primarySoftText: '#9A3412',
    secondaryAccent: '#0D9488',
    secondarySoftBg: '#CCFBF1',
    secondarySoftText: '#115E59',
    streakBg: '#FFF7ED',
    streakBorder: '#FED7AA',
    streakIconBg: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
    streakTitle: '#C2410C',
    challengeBg: 'linear-gradient(135deg, #231B16 0%, #3B2D25 100%)',
    challengeText: '#FFFFFF',
    challengeSubtext: '#FDBA74',
    borderSubtle: '#E8DFD2',
    swatchColors: ['#FBF8F3', '#EA580C', '#231B16', '#0D9488'],
  },
  'cream-indigo': {
    id: 'cream-indigo',
    name: '3. Warm Cream & Royal Indigo',
    badge: 'Pickup Music × Warm Paper',
    description:
      'Свіжий сучасний контраст: теплий паперовий фон поєднується з яскравим індиго-фіолетовим для кнопок і теплим золотом для нагород.',
    canvasBg: '#F8F6F0',
    cardBg: '#FFFFFF',
    subtleSurfaceBg: '#EFECE3',
    topGlowGradient:
      'linear-gradient(180deg, rgba(79, 70, 229, 0.14) 0%, rgba(245, 158, 11, 0.06) 65%, rgba(248, 246, 240, 0) 100%)',
    textPrimary: '#141522',
    textSecondary: '#4B5068',
    textMuted: '#767C96',
    primaryBg: '#4338CA',
    primaryText: '#FFFFFF',
    primarySoftBg: '#E0E7FF',
    primarySoftText: '#3730A3',
    secondaryAccent: '#F59E0B',
    secondarySoftBg: '#FEF3C7',
    secondarySoftText: '#92400E',
    streakBg: '#FFFBEB',
    streakBorder: '#FDE68A',
    streakIconBg: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
    streakTitle: '#B45309',
    challengeBg: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
    challengeText: '#FFFFFF',
    challengeSubtext: '#E0E7FF',
    borderSubtle: '#E2DFD5',
    swatchColors: ['#F8F6F0', '#4338CA', '#F59E0B', '#E0E7FF'],
  },
  'matcha-sage': {
    id: 'matcha-sage',
    name: '4. Oat Milk & Forest Sage',
    badge: 'Спокійний фокус · Soft Nature',
    description:
      'Дуже приємна для очей природна гама: вівсяно-кремовий фон, глибокий смарагдово-шавлієвий акцент і теплий бурштин.',
    canvasBg: '#F7F6F0',
    cardBg: '#FFFFFF',
    subtleSurfaceBg: '#EDEBE1',
    topGlowGradient:
      'linear-gradient(180deg, rgba(16, 185, 129, 0.15) 0%, rgba(245, 158, 11, 0.05) 65%, rgba(247, 246, 240, 0) 100%)',
    textPrimary: '#16211C',
    textSecondary: '#4A5D53',
    textMuted: '#73877C',
    primaryBg: '#065F46',
    primaryText: '#FFFFFF',
    primarySoftBg: '#D1FAE5',
    primarySoftText: '#065F46',
    secondaryAccent: '#D97706',
    secondarySoftBg: '#FEF3C7',
    secondarySoftText: '#92400E',
    streakBg: '#FFFBEB',
    streakBorder: '#FDE68A',
    streakIconBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    streakTitle: '#B45309',
    challengeBg: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
    challengeText: '#FFFFFF',
    challengeSubtext: '#D1FAE5',
    borderSubtle: '#DFDDD2',
    swatchColors: ['#F7F6F0', '#065F46', '#D97706', '#D1FAE5'],
  },
  'editorial-pop': {
    id: 'editorial-pop',
    name: '5. Warm Butter & Ink Pop',
    badge: 'Hazel Thompson Refined',
    description:
      'Оновлена версія референсу Musical Learning: теплий вершковий фон, сонячно-жовті акценти, коралові бейджі та контрастні чорні кнопки.',
    canvasBg: '#F6F2E8',
    cardBg: '#FFFFFF',
    subtleSurfaceBg: '#EDE7D8',
    topGlowGradient:
      'linear-gradient(180deg, rgba(245, 194, 43, 0.36) 0%, rgba(245, 194, 43, 0.08) 65%, rgba(246, 242, 232, 0) 100%)',
    textPrimary: '#141414',
    textSecondary: '#4A4740',
    textMuted: '#787368',
    primaryBg: '#141414',
    primaryText: '#FFFFFF',
    primarySoftBg: '#FDE047',
    primarySoftText: '#141414',
    secondaryAccent: '#F97316',
    secondarySoftBg: '#FFEDD5',
    secondarySoftText: '#9A3412',
    streakBg: '#FEF9C3',
    streakBorder: '#FACC15',
    streakIconBg: 'linear-gradient(135deg, #F97316 0%, #EAB308 100%)',
    streakTitle: '#854D0E',
    challengeBg: 'linear-gradient(135deg, #F5C22B 0%, #EAB308 100%)',
    challengeText: '#141414',
    challengeSubtext: '#422006',
    borderSubtle: '#DCD4C2',
    swatchColors: ['#F6F2E8', '#F5C22B', '#141414', '#F97316'],
  },
};

export const CARD_STYLES: Record<
  CardStyleId,
  { name: string; subtitle: string }
> = {
  'soft-elevated': {
    name: '✨ Soft Elevated (Best Practice)',
    subtitle: 'М’які повітряні тіні, делікатні межі (як у Sharda / Headspace)',
  },
  'crisp-editorial': {
    name: '📐 Crisp Editorial (1px Warm Line)',
    subtitle: 'Чисті тонкі рамки 1px без важких тіней (як у Linear / Apple Books)',
  },
  'neo-border': {
    name: '🖊️ Tactile Ink Border (1.5px)',
    subtitle: 'Акуратний графічний контур (витончена версія Hazel Thompson)',
  },
};

function getCardStyleObj(
  styleId: CardStyleId,
  palette: WarmPaletteConfig,
  customBg?: string
): React.CSSProperties {
  const bg = customBg ?? palette.cardBg;
  if (styleId === 'soft-elevated') {
    return {
      backgroundColor: bg,
      border: `1px solid ${palette.borderSubtle}`,
      boxShadow:
        '0 10px 26px -6px rgba(28, 25, 23, 0.06), 0 2px 6px -1px rgba(28, 25, 23, 0.03)',
    };
  }
  if (styleId === 'crisp-editorial') {
    return {
      backgroundColor: bg,
      border: `1.5px solid ${palette.borderSubtle}`,
      boxShadow: '0 1px 3px rgba(28, 25, 23, 0.02)',
    };
  }
  return {
    backgroundColor: bg,
    border: `1.5px solid ${palette.textPrimary}`,
    boxShadow: `0 3px 0px ${palette.textPrimary}`,
  };
}

// ============================================================================
// WEB AUDIO SYNTHESIZER FOR CHORD PREVIEW
// ============================================================================
function playChordPreview(chordName: string) {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const chordMap: Record<string, number[]> = {
      Em: [82.41, 123.47, 164.81, 196.0, 246.94, 329.63],
      Asus2: [110.0, 164.81, 220.0, 246.94, 329.63],
      Am9: [110.0, 196.0, 293.66, 246.94, 329.63],
      E: [82.41, 123.47, 164.81, 207.65, 246.94, 329.63],
      Am: [110.0, 164.81, 220.0, 261.63, 329.63],
      C: [130.81, 164.81, 196.0, 261.63, 329.63],
    };
    const freqs = chordMap[chordName] ?? [110.0, 164.81, 220.0, 277.18, 329.63];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.045);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.045);
      gain.gain.exponentialRampToValueAtTime(
        0.16,
        ctx.currentTime + idx * 0.045 + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0008,
        ctx.currentTime + idx * 0.045 + 1.25
      );

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.045);
      osc.stop(ctx.currentTime + idx * 0.045 + 1.3);
    });
  } catch {
    // Ignore audio context restrictions
  }
}

// ============================================================================
// INTERACTIVE CHORD DIAGRAM COMPONENT
// ============================================================================
function MiniChordDiagram({
  chord,
  palette,
  cardStyle,
}: {
  chord: ChordDiagramData;
  palette: WarmPaletteConfig;
  cardStyle: CardStyleId;
}) {
  return (
    <button
      type="button"
      onClick={() => playChordPreview(chord.name)}
      style={getCardStyleObj(cardStyle, palette, '#FFFFFF')}
      className="group flex flex-col items-center rounded-2xl p-2.5 transition-all hover:-translate-y-0.5 active:scale-95"
    >
      <div className="flex items-center gap-1">
        <span
          className="text-sm font-extrabold tracking-tight"
          style={{ color: palette.textPrimary }}
        >
          {chord.name}
        </span>
        <Volume2
          className="h-3.5 w-3.5 transition-transform group-hover:scale-110"
          style={{ color: palette.secondaryAccent }}
        />
      </div>
      <span
        className="mb-1.5 text-[10px] font-medium leading-tight text-center"
        style={{ color: palette.textMuted }}
      >
        {chord.subtitle}
      </span>

      <svg width="78" height="86" viewBox="0 0 78 86" className="overflow-visible">
        {chord.baseFret && chord.baseFret > 1 ? (
          <text
            x="1"
            y="28"
            fontSize="8.5"
            fontWeight="800"
            fill={palette.secondaryAccent}
          >
            {chord.baseFret}fr
          </text>
        ) : null}

        {/* Nut */}
        <line
          x1="14"
          y1="14"
          x2="64"
          y2="14"
          stroke={palette.textPrimary}
          strokeWidth={chord.baseFret && chord.baseFret > 1 ? 1.5 : 3.5}
          strokeLinecap="round"
        />

        {/* 4 horizontal frets */}
        {[1, 2, 3, 4].map((f) => (
          <line
            key={f}
            x1="14"
            y1={14 + f * 14}
            x2="64"
            y2={14 + f * 14}
            stroke={palette.textPrimary}
            strokeWidth="1"
            strokeOpacity="0.22"
          />
        ))}

        {/* 6 vertical strings */}
        {[0, 1, 2, 3, 4, 5].map((s) => {
          const x = 14 + s * 10;
          const fretVal = chord.frets[s];
          const fingerVal = chord.fingers[s];
          return (
            <g key={s}>
              <line
                x1={x}
                y1="14"
                x2={x}
                y2="70"
                stroke={palette.textPrimary}
                strokeWidth={s < 2 ? 1.4 : 1}
                strokeOpacity="0.45"
              />
              {fretVal === -1 && (
                <text
                  x={x}
                  y="9"
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="800"
                  fill="#DC2626"
                >
                  ✕
                </text>
              )}
              {fretVal === 0 && (
                <circle
                  cx={x}
                  cy="7"
                  r="3"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="1.6"
                />
              )}
              {fretVal > 0 && (
                <g>
                  <circle
                    cx={x}
                    cy={14 + (fretVal - 0.5) * 14}
                    r="5"
                    fill={palette.primaryBg}
                  />
                  {fingerVal > 0 && (
                    <text
                      x={x}
                      y={14 + (fretVal - 0.5) * 14 + 2.8}
                      textAnchor="middle"
                      fontSize="7.5"
                      fontWeight="800"
                      fill={palette.primaryText}
                    >
                      {fingerVal}
                    </text>
                  )}
                </g>
              )}
              <text
                x={x}
                y="81"
                textAnchor="middle"
                fontSize="7.5"
                fontWeight="700"
                fill={palette.textMuted}
              >
                {fingerVal > 0 ? fingerVal : fretVal === 0 ? '0' : 'X'}
              </text>
            </g>
          );
        })}
      </svg>
    </button>
  );
}

// ============================================================================
// MOBILE PHONE SCREEN COMPONENT (BEST PRACTICE UI/UX)
// ============================================================================
type ActiveTab = 'home' | 'pathway' | 'lesson' | 'leaderboard';

function WarmMobileScreen({
  palette,
  cardStyle,
  activeTab,
  setActiveTab,
  selectedLesson,
  setSelectedLesson,
  showStreakModal,
  setShowStreakModal,
  showCelebration,
  setShowCelebration,
}: {
  palette: WarmPaletteConfig;
  cardStyle: CardStyleId;
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;
  selectedLesson: CurriculumLesson;
  setSelectedLesson: (l: CurriculumLesson) => void;
  showStreakModal: boolean;
  setShowStreakModal: (v: boolean) => void;
  showCelebration: boolean;
  setShowCelebration: (v: boolean) => void;
}) {
  const [tierFilter, setTierFilter] = useState<'all' | SkillTier>('all');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1': false,
    'mod-2': true,
    'mod-3': true,
  });
  const [dailyGoalDone, setDailyGoalDone] = useState(3);
  const [selectedQuizIdx, setSelectedQuizIdx] = useState<number | null>(null);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const filteredModules = ZERO_TO_PRO_MODULES.filter((m) =>
    tierFilter === 'all' ? true : m.tier === tierFilter
  );

  const openLesson = (lesson: CurriculumLesson) => {
    setSelectedLesson(lesson);
    setSelectedQuizIdx(null);
    setShowCelebration(false);
    setActiveTab('lesson');
  };

  // SVG Ring math
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const goalProgress = Math.min(dailyGoalDone / 5, 1);
  const strokeDashoffset = circumference - goalProgress * circumference;

  return (
    <div
      style={{
        backgroundColor: palette.canvasBg,
        color: palette.textPrimary,
      }}
      className="relative mx-auto flex h-[852px] w-[393px] shrink-0 flex-col overflow-hidden rounded-[50px] border-[10px] border-[#1C1917] shadow-[0_25px_60px_-15px_rgba(28,25,23,0.35)] transition-all duration-300"
    >
      {/* Top Ambient Warm Glow */}
      <div
        style={{ background: palette.topGlowGradient }}
        className="pointer-events-none absolute inset-x-0 top-0 h-52 transition-all duration-300"
      />

      {/* iPhone Status Bar + Dynamic Island */}
      <div className="relative z-20 flex items-center justify-between px-7 pt-3 pb-2 text-xs font-bold">
        <span className="tabular-nums">10:15</span>
        <div className="h-6 w-28 rounded-full bg-[#141414]" />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-extrabold opacity-80">5G</span>
          <div
            style={{ borderColor: palette.textPrimary }}
            className="h-3 w-5 rounded-[4px] border p-0.5"
          >
            <div
              style={{ backgroundColor: palette.textPrimary }}
              className="h-full w-3.5 rounded-[1.5px]"
            />
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SCROLLABLE MAIN APP VIEWPORT                                         */}
      {/* ==================================================================== */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pt-1.5 pb-28 scrollbar-none">
        {(activeTab === 'home' || activeTab === 'pathway') && (
          <div className="space-y-4">
            {/* 1. HEADER: Avatar + Greeting + Streak/XP Pills */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    backgroundColor: palette.primarySoftBg,
                    color: palette.primarySoftText,
                    border:
                      cardStyle === 'neo-border'
                        ? `1.5px solid ${palette.textPrimary}`
                        : `1.5px solid ${palette.borderSubtle}`,
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-extrabold shadow-xs"
                >
                  🎸
                </div>
                <div>
                  <p
                    style={{ color: palette.textSecondary }}
                    className="text-xs font-medium leading-none"
                  >
                    Доброго ранку,
                  </p>
                  <h2 className="mt-1 text-[17px] font-extrabold tracking-tight leading-none">
                    Марія 👋
                  </h2>
                </div>
              </div>

              {/* Right Gamification & Action Pills */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowStreakModal(true)}
                  style={getCardStyleObj(cardStyle, palette)}
                  className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-extrabold transition hover:scale-105 active:scale-95 tabular-nums"
                  title="Відкрити Streak-календар"
                >
                  <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                  <span>12</span>
                </button>

                <div
                  style={getCardStyleObj(cardStyle, palette)}
                  className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-extrabold tabular-nums"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  <span>340</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowStreakModal(true)}
                  style={getCardStyleObj(cardStyle, palette)}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full transition active:scale-95"
                >
                  <Bell className="h-3.5 w-3.5" />
                  <span
                    style={{ backgroundColor: palette.secondaryAccent }}
                    className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full"
                  />
                </button>
              </div>
            </div>

            {activeTab === 'home' && (
              <>
                {/* 2. COMPACT STREAK & WEEKLY DAYS WIDGET (Refined Sharda + INDIEON) */}
                <button
                  type="button"
                  onClick={() => setShowStreakModal(true)}
                  style={{
                    backgroundColor: palette.streakBg,
                    border:
                      cardStyle === 'neo-border'
                        ? `1.5px solid ${palette.textPrimary}`
                        : `1px solid ${palette.streakBorder}`,
                    boxShadow:
                      cardStyle === 'neo-border'
                        ? `0 3px 0px ${palette.textPrimary}`
                        : '0 6px 20px -6px rgba(217, 119, 6, 0.12)',
                  }}
                  className="flex w-full items-center gap-3.5 rounded-3xl p-3.5 text-left transition-all active:scale-[0.99]"
                >
                  <div
                    style={{ background: palette.streakIconBg }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                  >
                    <Flame className="h-5 w-5 fill-current" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        style={{ color: palette.streakTitle }}
                        className="text-xs font-extrabold tracking-tight"
                      >
                        12 Днів Стріку! Топ 5% тижня
                      </span>
                      <span
                        style={{ color: palette.streakTitle }}
                        className="text-[11px] font-bold opacity-80"
                      >
                        Деталі →
                      </span>
                    </div>

                    {/* Mini Week Dots */}
                    <div className="mt-2 flex items-center gap-1.5">
                      {[
                        { d: 'Пн', done: true },
                        { d: 'Вт', done: true },
                        { d: 'Ср', done: true },
                        { d: 'Чт', done: true },
                        { d: 'Пт', done: false, today: true },
                        { d: 'Сб', done: false },
                        { d: 'Нд', done: false },
                      ].map((item) => (
                        <div
                          key={item.d}
                          className="flex flex-1 flex-col items-center gap-0.5"
                        >
                          <div
                            style={{
                              backgroundColor: item.done
                                ? palette.secondaryAccent
                                : item.today
                                ? '#FFFFFF'
                                : 'rgba(28,25,23,0.08)',
                              borderColor: item.today
                                ? palette.secondaryAccent
                                : 'transparent',
                              color: item.done
                                ? '#FFFFFF'
                                : palette.textSecondary,
                            }}
                            className={`flex h-5 w-full items-center justify-center rounded-md border text-[10px] font-extrabold`}
                          >
                            {item.done ? '✓' : item.d}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </button>

                {/* 3. CONTINUE LEARNING HERO CARD (Elevated Best-Practice Layout) */}
                <div
                  style={getCardStyleObj(cardStyle, palette)}
                  className="rounded-[28px] p-4 transition-all"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        style={{
                          backgroundColor: palette.primarySoftBg,
                          color: palette.primarySoftText,
                        }}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                      >
                        Модуль 2 · Урок 2.1
                      </span>
                      <span
                        style={{ color: palette.textMuted }}
                        className="flex items-center gap-1 text-xs font-semibold"
                      >
                        <Clock className="h-3 w-3" /> 10 хв
                      </span>
                    </div>
                    <span
                      style={{ color: palette.secondaryAccent }}
                      className="text-xs font-extrabold tabular-nums"
                    >
                      64% пройдено
                    </span>
                  </div>

                  {/* Title & Visual Fretboard Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-extrabold leading-snug tracking-tight">
                        Перші 3 акорди однією формою: Em → Asus2 → Am9
                      </h3>
                      <p
                        style={{ color: palette.textSecondary }}
                        className="mt-1 text-xs leading-relaxed"
                      >
                        Методика Девіда Тауба: вчимо одну аплікатуру з 2 пальців і граємо 3 акорди.
                      </p>
                    </div>

                    {/* Mini Visual Chord Preview Badge */}
                    <button
                      type="button"
                      onClick={() => playChordPreview('Em')}
                      style={{
                        backgroundColor: palette.subtleSurfaceBg,
                        borderColor: palette.borderSubtle,
                      }}
                      className="flex shrink-0 flex-col items-center rounded-2xl border px-3 py-2 text-center transition hover:scale-105 active:scale-95"
                      title="Прослухати акорд Em"
                    >
                      <Volume2
                        style={{ color: palette.secondaryAccent }}
                        className="h-4 w-4"
                      />
                      <span className="mt-0.5 text-xs font-black">Em</span>
                      <span
                        style={{ color: palette.textMuted }}
                        className="text-[9px] font-bold"
                      >
                        Звук
                      </span>
                    </button>
                  </div>

                  {/* Segmented / Smooth Progress Bar */}
                  <div className="mt-3.5">
                    <div
                      style={{ backgroundColor: palette.subtleSurfaceBg }}
                      className="h-2 w-full overflow-hidden rounded-full"
                    >
                      <div
                        style={{
                          width: '64%',
                          backgroundColor: palette.secondaryAccent,
                        }}
                        className="h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>

                  {/* Primary Tactile CTA Button */}
                  <button
                    type="button"
                    onClick={() => openLesson(ZERO_TO_PRO_MODULES[1].lessons[0])}
                    style={{
                      backgroundColor: palette.primaryBg,
                      color: palette.primaryText,
                    }}
                    className="mt-4 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-extrabold shadow-sm transition hover:opacity-95 active:scale-[0.99]"
                  >
                    <span className="flex items-center gap-2">
                      <Play className="h-4 w-4 fill-current" />
                      <span>Продовжити урок</span>
                    </span>
                    <span
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.16)',
                      }}
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums"
                    >
                      +60 XP →
                    </span>
                  </button>
                </div>

                {/* 4. 2-COLUMN BENTO GRID: DAILY GOAL + RHYTHM CHALLENGE */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Daily Goal Ring Card */}
                  <button
                    type="button"
                    onClick={() =>
                      setDailyGoalDone((prev) => (prev >= 5 ? 1 : prev + 1))
                    }
                    style={getCardStyleObj(cardStyle, palette)}
                    className="flex flex-col items-center justify-between rounded-[26px] p-3.5 text-center transition active:scale-95"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-xs font-extrabold">Щоденна ціль</span>
                      <span
                        style={{
                          backgroundColor: palette.subtleSurfaceBg,
                          color: palette.textSecondary,
                        }}
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      >
                        +1 тест
                      </span>
                    </div>

                    <div className="relative my-2 flex items-center justify-center">
                      <svg className="h-16 w-16 -rotate-90 transform">
                        <circle
                          cx="32"
                          cy="32"
                          r={radius}
                          stroke={palette.subtleSurfaceBg}
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r={radius}
                          stroke={palette.primaryBg}
                          strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-sm font-black tabular-nums leading-none">
                          {dailyGoalDone}/5
                        </span>
                      </div>
                    </div>

                    <span
                      style={{ color: palette.textSecondary }}
                      className="text-[11px] font-medium"
                    >
                      {dailyGoalDone >= 5
                        ? '🎉 Ціль виконано!'
                        : 'Уроків за сьогодні'}
                    </span>
                  </button>

                  {/* Challenge Card */}
                  <button
                    type="button"
                    onClick={() => openLesson(ZERO_TO_PRO_MODULES[1].lessons[2])}
                    style={{
                      background: palette.challengeBg,
                      color: palette.challengeText,
                      border:
                        cardStyle === 'neo-border'
                          ? `1.5px solid ${palette.textPrimary}`
                          : `1px solid ${palette.borderSubtle}`,
                      boxShadow:
                        cardStyle === 'neo-border'
                          ? `0 3px 0px ${palette.textPrimary}`
                          : '0 8px 20px -6px rgba(28, 25, 23, 0.08)',
                    }}
                    className="flex flex-col justify-between rounded-[26px] p-3.5 text-left transition active:scale-95"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="flex items-center gap-1 text-xs font-extrabold">
                        <Music2 className="h-3.5 w-3.5" />
                        Челендж
                      </span>
                      <span className="rounded-full bg-black/15 px-2 py-0.5 text-[10px] font-extrabold backdrop-blur-xs">
                        +75 XP
                      </span>
                    </div>

                    <div className="my-1.5">
                      <p className="text-xs font-extrabold leading-snug">
                        Бій D-D-U-U-D-U без зупинки руки
                      </p>
                      <p
                        style={{ color: palette.challengeSubtext }}
                        className="mt-1 text-[11px] font-medium"
                      >
                        Урок 2.3 · Маятник
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1 self-start rounded-full bg-black/15 px-2.5 py-1 text-[10px] font-extrabold">
                      <span>Почати тренування</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* ============================================================== */}
            {/* 5. CURRICULUM PATHWAY: "ВІД НУЛЯ ДО ПРО" (8 MODULES, 29 LESSONS)*/}
            {/* ============================================================== */}
            <div className="pt-1">
              <div className="mb-2.5 flex items-end justify-between">
                <div>
                  <span
                    style={{ color: palette.secondaryAccent }}
                    className="text-[10px] font-extrabold uppercase tracking-wider"
                  >
                    ПОВНА ПРОГРАМА З 2 КНИГ
                  </span>
                  <h3 className="text-base font-extrabold tracking-tight">
                    Шлях гітариста: Від Нуля до Про
                  </h3>
                </div>
                <span
                  style={{ color: palette.textMuted }}
                  className="text-xs font-bold tabular-nums"
                >
                  {CURRICULUM_STATS.totalModules} мод ·{' '}
                  {CURRICULUM_STATS.totalLessons} ур
                </span>
              </div>

              {/* Filter Pills (Sharda / Musical Learning Explore style) */}
              <div className="mb-3.5 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'Усі 8 модулів' },
                  { id: 'beginner', label: 'Новачок (М1–М3)' },
                  { id: 'intermediate', label: 'Середній (М4–М6)' },
                  { id: 'pro', label: 'Профі (М7–М8)' },
                ].map((pill) => {
                  const active = tierFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setTierFilter(pill.id as 'all' | SkillTier)}
                      style={
                        active
                          ? {
                              backgroundColor: palette.primaryBg,
                              color: palette.primaryText,
                            }
                          : {
                              backgroundColor: palette.cardBg,
                              color: palette.textSecondary,
                              border: `1px solid ${palette.borderSubtle}`,
                            }
                      }
                      className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition active:scale-95"
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {/* Sequential Modules Cards */}
              <div className="space-y-3">
                {filteredModules.map((mod: CurriculumModule) => {
                  const isOpen = !!expandedModules[mod.id];
                  const isDone = mod.progressPercent === 100;
                  return (
                    <div
                      key={mod.id}
                      style={getCardStyleObj(cardStyle, palette)}
                      className="overflow-hidden rounded-[26px] transition-all"
                    >
                      {/* Module Header */}
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.id)}
                        className="flex w-full items-start gap-3 p-3.5 text-left"
                      >
                        <div
                          style={{
                            backgroundColor: isDone
                              ? '#D1FAE5'
                              : palette.subtleSurfaceBg,
                            color: isDone ? '#065F46' : palette.textPrimary,
                          }}
                          className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl text-base font-extrabold"
                        >
                          <span>{mod.badgeIcon}</span>
                          <span className="text-[9px] font-black uppercase">
                            М{mod.number}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              style={{
                                backgroundColor: palette.primarySoftBg,
                                color: palette.primarySoftText,
                              }}
                              className="rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase"
                            >
                              {mod.tierLabel}
                            </span>
                            <span
                              style={{ color: palette.textMuted }}
                              className="text-[11px] font-semibold"
                            >
                              • {mod.lessons.length} уроки
                            </span>
                          </div>

                          <h4 className="mt-1 text-xs font-extrabold leading-snug">
                            {mod.title}
                          </h4>
                          <p
                            style={{ color: palette.textMuted }}
                            className="mt-0.5 text-[10px] leading-relaxed"
                          >
                            📚 {mod.sourceSummary}
                          </p>

                          {/* Module Progress Bar */}
                          <div className="mt-2 flex items-center gap-2">
                            <div
                              style={{
                                backgroundColor: palette.subtleSurfaceBg,
                              }}
                              className="h-1.5 flex-1 overflow-hidden rounded-full"
                            >
                              <div
                                style={{
                                  width: `${Math.max(mod.progressPercent, 6)}%`,
                                  backgroundColor: isDone
                                    ? '#10B981'
                                    : palette.secondaryAccent,
                                }}
                                className="h-full rounded-full"
                              />
                            </div>
                            <span
                              style={{ color: palette.textSecondary }}
                              className="text-[10px] font-extrabold tabular-nums"
                            >
                              {mod.progressPercent}%
                            </span>
                          </div>
                        </div>

                        <ChevronDown
                          style={{ color: palette.textMuted }}
                          className={`mt-1 h-4 w-4 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Expanded Lessons Timeline List */}
                      {isOpen && (
                        <div
                          style={{
                            backgroundColor: palette.canvasBg,
                            borderColor: palette.borderSubtle,
                          }}
                          className="divide-y border-t px-3 py-1.5"
                        >
                          {mod.lessons.map((lesson) => {
                            const isCompleted = lesson.status === 'completed';
                            const isCurrent = lesson.status === 'current';

                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                onClick={() => openLesson(lesson)}
                                style={{ borderColor: palette.borderSubtle }}
                                className="flex w-full items-center gap-3 py-2.5 text-left transition hover:opacity-85"
                              >
                                <div
                                  style={
                                    isCompleted
                                      ? {
                                          backgroundColor: '#10B981',
                                          color: '#FFFFFF',
                                        }
                                      : isCurrent
                                      ? {
                                          backgroundColor: palette.primaryBg,
                                          color: palette.primaryText,
                                        }
                                      : {
                                          backgroundColor: '#FFFFFF',
                                          color: palette.textPrimary,
                                          border: `1px solid ${palette.borderSubtle}`,
                                        }
                                  }
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold shadow-2xs"
                                >
                                  {isCompleted ? (
                                    <Check className="h-4 w-4 stroke-[3]" />
                                  ) : isCurrent ? (
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                  ) : (
                                    lesson.code
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      style={{ color: palette.secondaryAccent }}
                                      className="text-[10px] font-extrabold"
                                    >
                                      Урок {lesson.code}
                                    </span>
                                    <span
                                      style={{ color: palette.textMuted }}
                                      className="truncate text-[10px] font-medium"
                                    >
                                      • {lesson.sourceRef}
                                    </span>
                                  </div>
                                  <p className="truncate text-xs font-bold">
                                    {lesson.title}
                                  </p>
                                  <div
                                    style={{ color: palette.textMuted }}
                                    className="mt-0.5 flex items-center gap-2.5 text-[10px] font-medium"
                                  >
                                    <span>⏱ {lesson.durationMin} хв</span>
                                    <span>⭐ +{lesson.xpReward} XP</span>
                                  </div>
                                </div>

                                <ChevronRight
                                  style={{ color: palette.textMuted }}
                                  className="h-4 w-4 shrink-0"
                                />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: INTERACTIVE LESSON SCREEN                                    */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'lesson' && (
          <div className="space-y-4">
            {/* Top Lesson Navigation */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                style={getCardStyleObj(cardStyle, palette)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div className="text-center">
                <span
                  style={{ color: palette.secondaryAccent }}
                  className="text-[10px] font-extrabold uppercase tracking-wider"
                >
                  Урок {selectedLesson.code} · {selectedLesson.durationMin} хв
                </span>
                <p
                  style={{ color: palette.textMuted }}
                  className="text-[10px] font-medium"
                >
                  {selectedLesson.sourceRef}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: palette.primarySoftBg,
                  color: palette.primarySoftText,
                }}
                className="rounded-full px-2.5 py-1 text-xs font-extrabold tabular-nums"
              >
                +{selectedLesson.xpReward} XP
              </div>
            </div>

            {showCelebration ? (
              <div
                style={{
                  backgroundColor: palette.primaryBg,
                  color: palette.primaryText,
                }}
                className="flex flex-col items-center rounded-[30px] p-6 text-center shadow-xl"
              >
                <div className="mb-2 text-4xl">🎉🏆🎸</div>
                <h2 className="text-2xl font-black tracking-tight">
                  Чудова робота!
                </h2>
                <p className="mt-1 text-xs opacity-85">
                  Урок {selectedLesson.code} «{selectedLesson.title}» пройдено!
                </p>

                <div className="my-5 grid w-full grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-white/15 p-2.5">
                    <div className="text-lg font-black">
                      +{selectedLesson.xpReward}
                    </div>
                    <div className="text-[10px] font-bold opacity-80">
                      Досвід XP
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/15 p-2.5">
                    <div className="text-lg font-black">🔥 13</div>
                    <div className="text-[10px] font-bold opacity-80">
                      Днів поспіль
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/15 p-2.5">
                    <div className="text-lg font-black">100%</div>
                    <div className="text-[10px] font-bold opacity-80">
                      Чистота
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowCelebration(false);
                    setActiveTab('home');
                  }}
                  style={{
                    backgroundColor: palette.cardBg,
                    color: palette.textPrimary,
                  }}
                  className="w-full rounded-2xl py-3 text-sm font-black shadow-md transition active:scale-95"
                >
                  Повернутися до програми
                </button>
              </div>
            ) : (
              <>
                {/* Lesson Title Card */}
                <div
                  style={getCardStyleObj(cardStyle, palette)}
                  className="rounded-[26px] p-4"
                >
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {selectedLesson.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          backgroundColor: palette.primarySoftBg,
                          color: palette.primarySoftText,
                        }}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-base font-extrabold leading-snug">
                    {selectedLesson.title}
                  </h2>
                  <p
                    style={{ color: palette.textSecondary }}
                    className="mt-1 text-xs leading-relaxed"
                  >
                    {selectedLesson.subtitle}
                  </p>
                </div>

                {/* Interactive Chord Diagrams */}
                {selectedLesson.chordPreview && (
                  <div
                    style={getCardStyleObj(
                      cardStyle,
                      palette,
                      palette.subtleSurfaceBg
                    )}
                    className="rounded-[26px] p-3.5"
                  >
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="text-xs font-extrabold">
                        🎸 Натисни на схему акорду, щоб почути звук:
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedLesson.chordPreview.map((ch) => (
                        <MiniChordDiagram
                          key={ch.name}
                          chord={ch}
                          palette={palette}
                          cardStyle={cardStyle}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Strum Pattern Visualizer */}
                {selectedLesson.strumPattern && (
                  <div
                    style={getCardStyleObj(cardStyle, palette)}
                    className="rounded-[26px] p-3.5"
                  >
                    <p className="mb-2.5 text-xs font-extrabold">
                      🥁 {selectedLesson.strumPattern.name}
                    </p>
                    <div className="grid grid-cols-8 gap-1">
                      {selectedLesson.strumPattern.beats.map((b, i) => {
                        const isMiss = b.direction.startsWith('miss');
                        return (
                          <div
                            key={i}
                            style={
                              isMiss
                                ? {
                                    backgroundColor: palette.subtleSurfaceBg,
                                    color: palette.textMuted,
                                  }
                                : b.accent
                                ? {
                                    backgroundColor: palette.secondaryAccent,
                                    color: '#FFFFFF',
                                  }
                                : {
                                    backgroundColor: palette.primaryBg,
                                    color: palette.primaryText,
                                  }
                            }
                            className={`flex flex-col items-center rounded-xl py-2 ${
                              isMiss ? 'opacity-45' : 'font-extrabold'
                            }`}
                          >
                            <span className="text-xs">
                              {b.direction === 'D' || b.direction === 'miss-D'
                                ? '↓'
                                : '↑'}
                            </span>
                            <span className="text-[9px] uppercase">
                              {isMiss ? '—' : b.direction}
                            </span>
                            <span className="mt-1 text-[10px] opacity-85">
                              {b.count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab Snippet */}
                {selectedLesson.tabSnippet && (
                  <div
                    style={{ backgroundColor: '#1C1917' }}
                    className="rounded-[26px] p-4 text-amber-200"
                  >
                    <p className="mb-1.5 text-xs font-bold text-amber-400">
                      🎼 {selectedLesson.tabSnippet.title}
                    </p>
                    <pre className="overflow-x-auto font-mono text-[11px] leading-snug text-emerald-300">
                      {selectedLesson.tabSnippet.lines.join('\n')}
                    </pre>
                  </div>
                )}

                {/* Key Takeaways */}
                <div
                  style={getCardStyleObj(cardStyle, palette)}
                  className="rounded-[26px] p-4"
                >
                  <h4 className="mb-2.5 text-xs font-extrabold uppercase tracking-wider">
                    📌 Ключові моменти з уроку:
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedLesson.keyTakeaways.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs leading-relaxed"
                      >
                        <span
                          style={{
                            backgroundColor: palette.primarySoftBg,
                            color: palette.primarySoftText,
                          }}
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black"
                        >
                          {idx + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hands-On Practice Box */}
                <div
                  style={{
                    backgroundColor: palette.streakBg,
                    border: `1px solid ${palette.streakBorder}`,
                  }}
                  className="rounded-[26px] p-4"
                >
                  <div
                    style={{ color: palette.streakTitle }}
                    className="mb-1 flex items-center gap-1.5 text-xs font-black"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Практика з гітарою в руках:</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed">
                    {selectedLesson.practiceTask}
                  </p>
                </div>

                {/* Mini Quiz */}
                {selectedLesson.quizQuestion && (
                  <div
                    style={getCardStyleObj(cardStyle, palette)}
                    className="rounded-[26px] p-4"
                  >
                    <span
                      style={{ color: palette.secondaryAccent }}
                      className="text-[10px] font-extrabold uppercase"
                    >
                      ⚡ Перевірка знань
                    </span>
                    <p className="mt-1 text-xs font-extrabold">
                      {selectedLesson.quizQuestion.prompt}
                    </p>
                    <div className="mt-2.5 space-y-2">
                      {selectedLesson.quizQuestion.options.map((opt, idx) => {
                        const isChosen = selectedQuizIdx === idx;
                        const isCorrect =
                          idx === selectedLesson.quizQuestion?.correctIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedQuizIdx(idx)}
                            style={
                              isChosen
                                ? {
                                    backgroundColor: isCorrect
                                      ? '#059669'
                                      : '#E11D48',
                                    color: '#FFFFFF',
                                  }
                                : {
                                    backgroundColor: palette.subtleSurfaceBg,
                                    color: palette.textPrimary,
                                  }
                            }
                            className="w-full rounded-2xl p-3 text-left text-xs font-bold transition"
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Complete Lesson CTA */}
                <button
                  type="button"
                  onClick={() => {
                    playChordPreview('Em');
                    setShowCelebration(true);
                  }}
                  style={{
                    backgroundColor: palette.primaryBg,
                    color: palette.primaryText,
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black shadow-md transition active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Завершити урок (+{selectedLesson.xpReward} XP)</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: ACHIEVEMENTS & LEADERBOARD                                   */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold">
                🏆 Бейджі та Лідерборд
              </h2>
              <span
                style={{
                  backgroundColor: palette.primarySoftBg,
                  color: palette.primarySoftText,
                }}
                className="rounded-full px-2.5 py-1 text-[10px] font-extrabold"
              >
                Золотий Дивізіон
              </span>
            </div>

            <div
              style={getCardStyleObj(cardStyle, palette)}
              className="rounded-[26px] p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-extrabold">
                  Відкриті бейджі модулів (3/8)
                </span>
                <Award
                  style={{ color: palette.secondaryAccent }}
                  className="h-4 w-4"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {ZERO_TO_PRO_MODULES.map((m) => {
                  const unlocked = m.number <= 3;
                  return (
                    <div
                      key={m.id}
                      style={{
                        backgroundColor: unlocked
                          ? palette.subtleSurfaceBg
                          : '#F5F5F4',
                      }}
                      className={`flex flex-col items-center rounded-2xl p-2.5 text-center ${
                        unlocked ? '' : 'opacity-40 grayscale'
                      }`}
                    >
                      <span className="text-xl">{m.badgeIcon}</span>
                      <span className="mt-1 line-clamp-1 text-[9px] font-extrabold">
                        {m.badgeTitle}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={getCardStyleObj(cardStyle, palette)}
              className="rounded-[26px] p-4"
            >
              <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider">
                Рейтинг тижня
              </h3>
              <div className="space-y-2">
                {[
                  {
                    rank: 1,
                    name: 'Марія (Ти)',
                    xp: '1,450 XP',
                    tier: 'GOLD',
                    highlight: true,
                  },
                  {
                    rank: 2,
                    name: 'Олексій К.',
                    xp: '1,320 XP',
                    tier: 'PLATINUM',
                    highlight: false,
                  },
                  {
                    rank: 3,
                    name: 'Давид Т.',
                    xp: '1,180 XP',
                    tier: 'GOLD',
                    highlight: false,
                  },
                  {
                    rank: 4,
                    name: 'Анна Б.',
                    xp: '940 XP',
                    tier: 'SILVER',
                    highlight: false,
                  },
                ].map((row) => (
                  <div
                    key={row.rank}
                    style={
                      row.highlight
                        ? {
                            backgroundColor: palette.primarySoftBg,
                            color: palette.primarySoftText,
                          }
                        : {
                            backgroundColor: palette.subtleSurfaceBg,
                            color: palette.textPrimary,
                          }
                    }
                    className="flex items-center justify-between rounded-2xl p-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{
                          backgroundColor: palette.primaryBg,
                          color: palette.primaryText,
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-black"
                      >
                        {row.rank}
                      </span>
                      <div>
                        <p className="text-xs font-extrabold">{row.name}</p>
                        <span className="text-[10px] font-semibold opacity-75">
                          {row.tier} • 🔥 12 стрік
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black tabular-nums">
                      {row.xp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* WARM STREAK REWARD MODAL OVERLAY                                     */}
      {/* ==================================================================== */}
      {showStreakModal && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/55 p-5 backdrop-blur-xs">
          <div
            style={{
              backgroundColor: palette.cardBg,
              color: palette.textPrimary,
              border: `1.5px solid ${palette.borderSubtle}`,
            }}
            className="w-full rounded-[32px] p-6 text-center shadow-2xl"
          >
            <div
              style={{ background: palette.streakIconBg }}
              className="mx-auto -mt-12 mb-2 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl text-white shadow-lg"
            >
              🔥
            </div>
            <div className="text-4xl font-black tabular-nums">12</div>
            <div
              style={{ color: palette.textSecondary }}
              className="text-sm font-bold"
            >
              днів практики поспіль!
            </div>

            <div
              style={{ backgroundColor: palette.subtleSurfaceBg }}
              className="my-5 flex justify-between gap-1 rounded-2xl p-3"
            >
              {[
                { day: 'Пн', active: true },
                { day: 'Вт', active: true },
                { day: 'Ср', active: true },
                { day: 'Чт', active: true },
                { day: 'Пт', active: false },
                { day: 'Сб', active: false },
                { day: 'Нд', active: false },
              ].map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1">
                  <div
                    style={
                      d.active
                        ? {
                            background: palette.streakIconBg,
                            color: '#FFFFFF',
                          }
                        : {
                            backgroundColor: palette.cardBg,
                            color: palette.textMuted,
                          }
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full shadow-2xs"
                  >
                    <Zap className="h-4 w-4 fill-current" />
                  </div>
                  <span
                    style={{ color: palette.textSecondary }}
                    className="text-[10px] font-bold"
                  >
                    {d.day}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                backgroundColor: palette.streakBg,
                border: `1px solid ${palette.streakBorder}`,
              }}
              className="mb-4 rounded-2xl p-3"
            >
              <div
                style={{ color: palette.streakTitle }}
                className="text-base font-black"
              >
                💎 +25 Бонус за стабільність
              </div>
              <p
                style={{ color: palette.textSecondary }}
                className="mt-0.5 text-xs"
              >
                15 хвилин щодня — найкращий шлях до чистої гри!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowStreakModal(false)}
              style={{
                backgroundColor: palette.primaryBg,
                color: palette.primaryText,
              }}
              className="w-full rounded-2xl py-3 text-sm font-extrabold transition active:scale-95"
            >
              Продовжити!
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FLOATING BOTTOM NAVIGATION PILL BAR                                  */}
      {/* ==================================================================== */}
      <div className="absolute inset-x-4 bottom-4 z-30">
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            border:
              cardStyle === 'neo-border'
                ? `1.5px solid ${palette.textPrimary}`
                : `1px solid ${palette.borderSubtle}`,
            boxShadow:
              cardStyle === 'neo-border'
                ? `0 3px 0px ${palette.textPrimary}`
                : '0 12px 32px -4px rgba(28, 25, 23, 0.12)',
          }}
          className="flex items-center justify-around rounded-full px-2 py-2 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            style={
              activeTab === 'home'
                ? {
                    backgroundColor: palette.primaryBg,
                    color: palette.primaryText,
                  }
                : { color: palette.textSecondary }
            }
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold transition"
          >
            <Compass className="h-4 w-4" />
            <span>Головна</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pathway')}
            style={
              activeTab === 'pathway'
                ? {
                    backgroundColor: palette.primaryBg,
                    color: palette.primaryText,
                  }
                : { color: palette.textSecondary }
            }
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold transition"
          >
            <BookOpen className="h-4 w-4" />
            <span>Шлях (29)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lesson')}
            style={{
              backgroundColor: palette.secondaryAccent,
              color: '#FFFFFF',
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full shadow-md transition active:scale-95"
            title="Поточний урок"
          >
            <Play className="h-4 w-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            style={
              activeTab === 'leaderboard'
                ? {
                    backgroundColor: palette.primaryBg,
                    color: palette.primaryText,
                  }
                : { color: palette.textSecondary }
            }
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold transition"
          >
            <Trophy className="h-4 w-4" />
            <span>Рейтинг</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN EXPORT: INTERACTIVE WARM CREAM DESIGN STUDIO
// ============================================================================
export function MobileDesignLabView() {
  const [primaryPaletteId, setPrimaryPaletteId] =
    useState<PaletteId>('honey-studio');
  const [secondaryPaletteId, setSecondaryPaletteId] =
    useState<PaletteId>('terracotta-sunburst');
  const [cardStyle, setCardStyle] = useState<CardStyleId>('soft-elevated');
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedLesson, setSelectedLesson] = useState<CurriculumLesson>(
    ZERO_TO_PRO_MODULES[1].lessons[0]
  );
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const primaryPalette = WARM_PALETTES[primaryPaletteId];
  const secondaryPalette = WARM_PALETTES[secondaryPaletteId];

  return (
    <div className="min-h-screen bg-[#ECE7DC] text-[#1C1917] pb-20">
      {/* ==================================================================== */}
      {/* STICKY INTERACTIVE DESIGN STUDIO BAR                                 */}
      {/* ==================================================================== */}
      <div className="sticky top-0 z-50 border-b border-[#D8D0C1] bg-[#FAF7F0]/95 px-4 py-3 shadow-xs backdrop-blur-md">
        <div className="mx-auto max-w-7xl space-y-3">
          {/* Row 1: Locked Design System Status + Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full bg-[#1C1917] px-3 py-1 text-xs font-extrabold text-[#FAF7F0]">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                ОБРАНИЙ ДИЗАЙН
              </span>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold sm:text-base">
                  {primaryPalette.name} • {CARD_STYLES[cardStyle].name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCustomizer((v) => !v)}
                className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-extrabold text-stone-800 transition hover:border-stone-900"
              >
                <Palette className="h-3.5 w-3.5 text-amber-600" />
                <span>
                  {showCustomizer
                    ? 'Сховати налаштування палітри'
                    : 'Налаштування палітри'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCompareMode((v) => !v)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                  compareMode
                    ? 'bg-[#1C1917] text-white'
                    : 'bg-white text-zinc-700 border border-stone-300'
                }`}
              >
                <Columns2 className="h-3.5 w-3.5" />
                <span>{compareMode ? 'Режим 1 екрана' : 'Порівняти 2 поруч'}</span>
              </button>
            </div>
          </div>

          {/* Row 2: Collapsible Customizer */}
          {showCustomizer && (
            <div className="grid grid-cols-1 gap-3 pt-1 lg:grid-cols-12">
            {/* Palette Selector (Left 8 cols) */}
            <div className="lg:col-span-8">
              <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-stone-600">
                <span>
                  🎨 Обирай колірну схему на базі Warm Cream (клік змінює Екран #1):
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {(Object.values(WARM_PALETTES) as WarmPaletteConfig[]).map(
                  (p) => {
                    const isSelected = p.id === primaryPaletteId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPrimaryPaletteId(p.id)}
                        className={`flex flex-col justify-between rounded-2xl p-2.5 text-left transition ${
                          isSelected
                            ? 'bg-[#1C1917] text-white ring-2 ring-amber-500 shadow-sm'
                            : 'bg-white text-stone-900 border border-stone-300/80 hover:border-stone-500'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1 mb-1.5">
                            {p.swatchColors.map((hex, idx) => (
                              <span
                                key={idx}
                                style={{ backgroundColor: hex }}
                                className="h-3.5 w-3.5 rounded-full border border-black/15"
                              />
                            ))}
                          </div>
                          <div className="text-xs font-extrabold leading-tight">
                            {p.name}
                          </div>
                        </div>
                        <div
                          className={`mt-1 text-[10px] font-semibold ${
                            isSelected ? 'text-amber-300' : 'text-stone-500'
                          }`}
                        >
                          {p.badge}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Card Style Selector (Right 4 cols) */}
            <div className="lg:col-span-4">
              <div className="mb-1.5 flex items-center gap-1 text-xs font-bold text-stone-600">
                <Layers className="h-3.5 w-3.5" />
                <span>Стиль рамок і тіней карток:</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  Object.entries(CARD_STYLES) as [
                    CardStyleId,
                    { name: string; subtitle: string },
                  ][]
                ).map(([id, cfg]) => {
                  const active = cardStyle === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCardStyle(id)}
                      className={`flex flex-col justify-between rounded-2xl p-2.5 text-left transition ${
                        active
                          ? 'bg-[#1C1917] text-white ring-2 ring-amber-500'
                          : 'bg-white text-stone-900 border border-stone-300/80 hover:border-stone-500'
                      }`}
                    >
                      <span className="text-xs font-extrabold leading-tight">
                        {cfg.name}
                      </span>
                      <span
                        className={`mt-1 line-clamp-2 text-[10px] leading-tight ${
                          active ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {cfg.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* QUICK SCREEN STATE SHORTCUTS                                         */}
      {/* ==================================================================== */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 pt-4 pb-2">
        <span className="flex items-center gap-1 text-xs font-extrabold text-stone-600">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Швидкий перехід по екранах:
        </span>
        {[
          {
            label: '🏠 Головний екран (Home)',
            onClick: () => {
              setShowStreakModal(false);
              setActiveTab('home');
            },
          },
          {
            label: '🎸 Урок 2.1: Акорди Em → Asus2 → Am9 (зі звуком)',
            onClick: () => {
              setShowStreakModal(false);
              setShowCelebration(false);
              setSelectedLesson(ZERO_TO_PRO_MODULES[1].lessons[0]);
              setActiveTab('lesson');
            },
          },
          {
            label: '🥁 Урок 2.3: Бій D-D-U-U-D-U',
            onClick: () => {
              setShowStreakModal(false);
              setShowCelebration(false);
              setSelectedLesson(ZERO_TO_PRO_MODULES[1].lessons[2]);
              setActiveTab('lesson');
            },
          },
          {
            label: '🔥 Модалка 12 Day Streak',
            onClick: () => setShowStreakModal(true),
          },
          {
            label: '🏆 Екран завершення уроку',
            onClick: () => {
              setShowStreakModal(false);
              setActiveTab('lesson');
              setShowCelebration(true);
            },
          },
          {
            label: '🥇 Бейджі та Рейтинг',
            onClick: () => {
              setShowStreakModal(false);
              setActiveTab('leaderboard');
            },
          },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.onClick}
            className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-800 shadow-2xs transition hover:border-stone-900 active:scale-95"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* MOBILE VIEWPORTS (SINGLE OR SIDE-BY-SIDE COMPARISON)                 */}
      {/* ==================================================================== */}
      <div className="mx-auto mt-4 flex max-w-7xl flex-wrap items-start justify-center gap-10 px-4">
        {/* Phone #1: Selected Primary Warm Palette */}
        <div className="flex flex-col items-center">
          <div className="mb-3 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-1.5 text-xs font-extrabold shadow-2xs">
              <span className="flex gap-1">
                {primaryPalette.swatchColors.map((c, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: c }}
                    className="h-3 w-3 rounded-full border border-black/15"
                  />
                ))}
              </span>
              <span>Екран #1: {primaryPalette.name}</span>
            </div>
            <p className="mt-1 max-w-xs text-xs text-stone-600">
              {primaryPalette.description}
            </p>
          </div>

          <WarmMobileScreen
            palette={primaryPalette}
            cardStyle={cardStyle}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
            showStreakModal={showStreakModal}
            setShowStreakModal={setShowStreakModal}
            showCelebration={showCelebration}
            setShowCelebration={setShowCelebration}
          />
        </div>

        {/* Phone #2: Comparison Warm Palette */}
        {compareMode && (
          <div className="flex flex-col items-center">
            <div className="mb-3 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-extrabold shadow-2xs">
                <span>Екран #2 для порівняння:</span>
                <select
                  value={secondaryPaletteId}
                  onChange={(e) =>
                    setSecondaryPaletteId(e.target.value as PaletteId)
                  }
                  className="rounded-lg bg-stone-100 px-2 py-0.5 text-xs font-extrabold text-stone-900 outline-none"
                >
                  {(Object.values(WARM_PALETTES) as WarmPaletteConfig[]).map(
                    (p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    )
                  )}
                </select>
              </div>
              <p className="mt-1 max-w-xs text-xs text-stone-600">
                {secondaryPalette.description}
              </p>
            </div>

            <WarmMobileScreen
              palette={secondaryPalette}
              cardStyle={cardStyle}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedLesson={selectedLesson}
              setSelectedLesson={setSelectedLesson}
              showStreakModal={showStreakModal}
              setShowStreakModal={setShowStreakModal}
              showCelebration={showCelebration}
              setShowCelebration={setShowCelebration}
            />
          </div>
        )}
      </div>
    </div>
  );
}
