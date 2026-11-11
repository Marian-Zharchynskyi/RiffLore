import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CURRICULUM_STATS,
  CurriculumLesson,
  CurriculumModule,
  SkillTier,
  ZERO_TO_PRO_MODULES,
} from '../entities/course/zeroToProCurriculum';
import { playChordAudio } from '../shared/audio/chordAudio';
import {
  HONEY_STUDIO_THEME,
  SOFT_ELEVATED_CARD,
  SOFT_FLOATING_PILL,
} from '../shared/theme/honeyStudioTheme';
import { ChordDiagramCard } from '../widgets/ChordDiagramCard';

type ActiveTab = 'home' | 'pathway' | 'lesson' | 'leaderboard';
type LessonSubTab = 'theory' | 'practice' | 'quiz';

export function MainMobileApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedLesson, setSelectedLesson] = useState<CurriculumLesson>(
    ZERO_TO_PRO_MODULES[1].lessons[0]
  );
  const [lessonSubTab, setLessonSubTab] = useState<LessonSubTab>('theory');
  const [tierFilter, setTierFilter] = useState<'all' | SkillTier>('all');
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({
    'mod-1': false,
    'mod-2': true,
    'mod-3': true,
  });

  const [dailyGoalDone, setDailyGoalDone] = useState<number>(3);
  const [xpPoints, setXpPoints] = useState<number>(340);
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(
    null
  );
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({
    0: true,
  });

  const filteredModules = ZERO_TO_PRO_MODULES.filter((mod) =>
    tierFilter === 'all' ? true : mod.tier === tierFilter
  );

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const openLesson = (lesson: CurriculumLesson) => {
    setSelectedLesson(lesson);
    setSelectedQuizOption(null);
    setShowCelebration(false);
    setLessonSubTab('theory');
    setActiveTab('lesson');
  };

  const completeLesson = (reward: number) => {
    setXpPoints((prev) => prev + reward);
    setDailyGoalDone((prev) => Math.min(5, prev + 1));
    setShowCelebration(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Warm Honey-Amber Ambient Top Glow */}
      <View pointerEvents="none" style={styles.topAmbientGlow} />

      <View style={styles.appContainer}>
        {/* ================================================================ */}
        {/* SCREEN 1 & 2: HOME DASHBOARD & CURRICULUM PATHWAY                */}
        {/* ================================================================ */}
        {(activeTab === 'home' || activeTab === 'pathway') && (
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. TOP HEADER BAR */}
            <View style={styles.headerRow}>
              <View style={styles.profileRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitial}>М</Text>
                  <View style={styles.onlineDot} />
                </View>
                <View>
                  <Text style={styles.greetingLabel}>Доброго ранку,</Text>
                  <Text style={styles.userNameText}>Марія 👋</Text>
                </View>
              </View>

              <View style={styles.headerPillsRow}>
                <Pressable
                  onPress={() => setShowStreakModal(true)}
                  style={styles.statPill}
                >
                  <Text style={styles.statEmoji}>🔥</Text>
                  <Text style={styles.statValue}>12</Text>
                </Pressable>

                <View style={styles.statPill}>
                  <Text style={styles.statEmoji}>⭐</Text>
                  <Text style={styles.statValue}>{xpPoints}</Text>
                </View>

                <Pressable
                  onPress={() => setShowStreakModal(true)}
                  style={styles.bellButton}
                >
                  <Text style={styles.bellEmoji}>🔔</Text>
                  <View style={styles.bellBadgeDot} />
                </Pressable>
              </View>
            </View>

            {activeTab === 'home' && (
              <>
                {/* 2. 12 DAY STREAK BANNER WITH WEEKLY CHECKMARKS */}
                <Pressable
                  onPress={() => setShowStreakModal(true)}
                  style={styles.streakBanner}
                >
                  <View style={styles.streakIconBox}>
                    <Text style={styles.streakIconEmoji}>🔥</Text>
                  </View>

                  <View style={styles.streakContentCol}>
                    <View style={styles.streakTitleRow}>
                      <Text style={styles.streakBannerTitle}>
                        12 Днів Стріку! Топ 5% тижня
                      </Text>
                      <Text style={styles.streakDetailsLink}>Деталі →</Text>
                    </View>

                    <View style={styles.weekDaysRow}>
                      {[
                        { d: 'Пн', done: true },
                        { d: 'Вт', done: true },
                        { d: 'Ср', done: true },
                        { d: 'Чт', done: true },
                        { d: 'Пт', done: false, today: true },
                        { d: 'Сб', done: false },
                        { d: 'Нд', done: false },
                      ].map((item) => (
                        <View
                          key={item.d}
                          style={[
                            styles.weekDayCell,
                            item.done && styles.weekDayDone,
                            item.today && styles.weekDayToday,
                          ]}
                        >
                          <Text
                            style={[
                              styles.weekDayText,
                              item.done && styles.weekDayTextDone,
                            ]}
                          >
                            {item.done ? '✓' : item.d}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Pressable>

                {/* 3. HERO CARD: CONTINUE LEARNING */}
                <View style={styles.heroCard}>
                  <View style={styles.heroMetaRow}>
                    <View style={styles.heroBadgeGroup}>
                      <View style={styles.modulePill}>
                        <Text style={styles.modulePillText}>
                          МОДУЛЬ 2 · УРОК 2.1
                        </Text>
                      </View>
                      <Text style={styles.durationMetaText}>⏱ 10 хв</Text>
                    </View>
                    <Text style={styles.progressPercentLabel}>64% пройдено</Text>
                  </View>

                  <View style={styles.heroBodyRow}>
                    <View style={styles.heroTextCol}>
                      <Text style={styles.heroTitle}>
                        Перші 3 акорди однією формою: Em → Asus2 → Am9
                      </Text>
                      <Text style={styles.heroSubtitle}>
                        Методика Девіда Тауба: вчимо одну аплікатуру з 2 пальців і
                        граємо 3 акорди.
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => playChordAudio('Em')}
                      style={({ pressed }) => [
                        styles.chordQuickAudioBtn,
                        pressed && { transform: [{ scale: 0.95 }] },
                      ]}
                    >
                      <Text style={styles.chordQuickAudioIcon}>🔊</Text>
                      <Text style={styles.chordQuickAudioName}>Em</Text>
                      <Text style={styles.chordQuickAudioSub}>Звук</Text>
                    </Pressable>
                  </View>

                  <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: '64%' }]} />
                  </View>

                  <Pressable
                    onPress={() => openLesson(ZERO_TO_PRO_MODULES[1].lessons[0])}
                    style={({ pressed }) => [
                      styles.primaryCtaButton,
                      pressed && { opacity: 0.92 },
                    ]}
                  >
                    <Text style={styles.primaryCtaText}>▶ Продовжити урок</Text>
                    <View style={styles.xpRewardPill}>
                      <Text style={styles.xpRewardPillText}>+60 XP →</Text>
                    </View>
                  </Pressable>
                </View>

                {/* 4. 2-COLUMN BENTO GRID: DAILY GOAL + CHALLENGE */}
                <View style={styles.bentoRow}>
                  {/* Daily Goal Card */}
                  <Pressable
                    onPress={() =>
                      setDailyGoalDone((prev) => (prev >= 5 ? 1 : prev + 1))
                    }
                    style={styles.bentoGoalCard}
                  >
                    <View style={styles.bentoCardTopRow}>
                      <Text style={styles.bentoCardTitle}>Щоденна ціль</Text>
                      <View style={styles.testBumpBadge}>
                        <Text style={styles.testBumpText}>+1</Text>
                      </View>
                    </View>

                    <View style={styles.goalCircleOuter}>
                      <View style={styles.goalCircleInner}>
                        <Text style={styles.goalFractionText}>
                          {dailyGoalDone}/5
                        </Text>
                      </View>
                    </View>

                    {/* Segmented 5-step bar */}
                    <View style={styles.goalSegmentsRow}>
                      {[1, 2, 3, 4, 5].map((step) => (
                        <View
                          key={step}
                          style={[
                            styles.goalSegment,
                            step <= dailyGoalDone && styles.goalSegmentActive,
                          ]}
                        />
                      ))}
                    </View>

                    <Text style={styles.bentoFooterCaption}>
                      {dailyGoalDone >= 5
                        ? '🎉 Ціль виконано!'
                        : 'Уроків за сьогодні'}
                    </Text>
                  </Pressable>

                  {/* Rhythm Challenge Card */}
                  <Pressable
                    onPress={() => openLesson(ZERO_TO_PRO_MODULES[1].lessons[2])}
                    style={styles.bentoChallengeCard}
                  >
                    <View style={styles.bentoCardTopRow}>
                      <Text style={styles.challengeHeaderTitle}>🥁 Челендж</Text>
                      <View style={styles.challengeXpBadge}>
                        <Text style={styles.challengeXpText}>+75 XP</Text>
                      </View>
                    </View>

                    <View style={styles.challengeBody}>
                      <Text style={styles.challengeMainTitle}>
                        Бій D-D-U-U-D-U без зупинки руки
                      </Text>
                      <Text style={styles.challengeSubtext}>
                        Урок 2.3 · Маятник руки
                      </Text>
                    </View>

                    <View style={styles.challengeStartPill}>
                      <Text style={styles.challengeStartText}>
                        Почати тренування →
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </>
            )}

            {/* 5. SEQUENTIAL CURRICULUM: ZERO TO PRO (8 MODULES, 29 LESSONS) */}
            <View style={styles.curriculumSection}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={styles.sectionEyebrow}>
                    ПОВНА ПРОГРАМА З 2 КНИГ
                  </Text>
                  <Text style={styles.sectionTitle}>
                    Шлях гітариста: Від Нуля до Про
                  </Text>
                </View>
                <Text style={styles.sectionStatsText}>
                  {CURRICULUM_STATS.totalModules} мод ·{' '}
                  {CURRICULUM_STATS.totalLessons} ур
                </Text>
              </View>

              {/* Filter Pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterPillsRow}
              >
                {[
                  { id: 'all', label: 'Усі 8 модулів' },
                  { id: 'beginner', label: 'Новачок (М1–М3)' },
                  { id: 'intermediate', label: 'Середній (М4–М6)' },
                  { id: 'pro', label: 'Профі (М7–М8)' },
                ].map((pill) => {
                  const active = tierFilter === pill.id;
                  return (
                    <Pressable
                      key={pill.id}
                      onPress={() => setTierFilter(pill.id as 'all' | SkillTier)}
                      style={[
                        styles.filterPill,
                        active && styles.filterPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          active && styles.filterPillTextActive,
                        ]}
                      >
                        {pill.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Module Cards */}
              <View style={styles.modulesList}>
                {filteredModules.map((mod: CurriculumModule) => {
                  const isOpen = !!expandedModules[mod.id];
                  const isDone = mod.progressPercent === 100;

                  return (
                    <View key={mod.id} style={styles.moduleCard}>
                      <Pressable
                        onPress={() => toggleModule(mod.id)}
                        style={styles.moduleHeaderBtn}
                      >
                        <View
                          style={[
                            styles.moduleBadgeBox,
                            isDone && styles.moduleBadgeBoxDone,
                          ]}
                        >
                          <Text style={styles.moduleBadgeEmoji}>
                            {mod.badgeIcon}
                          </Text>
                          <Text style={styles.moduleBadgeCode}>
                            М{mod.number}
                          </Text>
                        </View>

                        <View style={styles.moduleInfoCol}>
                          <View style={styles.moduleTierRow}>
                            <View style={styles.tierTagPill}>
                              <Text style={styles.tierTagText}>
                                {mod.tierLabel}
                              </Text>
                            </View>
                            <Text style={styles.lessonCountText}>
                              • {mod.lessons.length} уроки
                            </Text>
                          </View>

                          <Text style={styles.moduleTitleText}>{mod.title}</Text>
                          <Text style={styles.moduleSourceText}>
                            📚 {mod.sourceSummary}
                          </Text>

                          <View style={styles.moduleProgressRow}>
                            <View style={styles.moduleProgressTrack}>
                              <View
                                style={[
                                  styles.moduleProgressFill,
                                  {
                                    width: `${Math.max(
                                      mod.progressPercent,
                                      6
                                    )}%`,
                                    backgroundColor: isDone
                                      ? HONEY_STUDIO_THEME.successBg
                                      : HONEY_STUDIO_THEME.secondaryAccent,
                                  },
                                ]}
                              />
                            </View>
                            <Text style={styles.moduleProgressLabel}>
                              {mod.progressPercent}%
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.chevronIcon}>
                          {isOpen ? '▲' : '▼'}
                        </Text>
                      </Pressable>

                      {isOpen && (
                        <View style={styles.lessonsListContainer}>
                          {mod.lessons.map((lesson, idx) => {
                            const isCompleted = lesson.status === 'completed';
                            const isCurrent = lesson.status === 'current';

                            return (
                              <Pressable
                                key={lesson.id}
                                onPress={() => openLesson(lesson)}
                                style={[
                                  styles.lessonRowBtn,
                                  idx > 0 && styles.lessonRowBorderTop,
                                ]}
                              >
                                <View
                                  style={[
                                    styles.lessonStatusIcon,
                                    isCompleted && styles.lessonStatusCompleted,
                                    isCurrent && styles.lessonStatusCurrent,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.lessonStatusText,
                                      (isCompleted || isCurrent) && {
                                        color: '#FFFFFF',
                                      },
                                    ]}
                                  >
                                    {isCompleted
                                      ? '✓'
                                      : isCurrent
                                      ? '▶'
                                      : lesson.code}
                                  </Text>
                                </View>

                                <View style={styles.lessonRowInfo}>
                                  <View style={styles.lessonRowMetaTop}>
                                    <Text style={styles.lessonCodeText}>
                                      Урок {lesson.code}
                                    </Text>
                                    <Text
                                      numberOfLines={1}
                                      style={styles.lessonSourceSmall}
                                    >
                                      • {lesson.sourceRef}
                                    </Text>
                                  </View>

                                  <Text
                                    numberOfLines={1}
                                    style={styles.lessonRowTitle}
                                  >
                                    {lesson.title}
                                  </Text>

                                  <View style={styles.lessonRowStats}>
                                    <Text style={styles.lessonStatItem}>
                                      ⏱ {lesson.durationMin} хв
                                    </Text>
                                    <Text style={styles.lessonStatItem}>
                                      ⭐ +{lesson.xpReward} XP
                                    </Text>
                                  </View>
                                </View>

                                <Text style={styles.lessonArrow}>›</Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}

        {/* ================================================================ */}
        {/* SCREEN 3: INTERACTIVE LESSON PLAYER                              */}
        {/* ================================================================ */}
        {activeTab === 'lesson' && (
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Navigation Row */}
            <View style={styles.lessonTopBar}>
              <Pressable
                onPress={() => setActiveTab('home')}
                style={styles.backButtonPill}
              >
                <Text style={styles.backButtonText}>← Назад до програми</Text>
              </Pressable>

              <View style={styles.lessonXpBadge}>
                <Text style={styles.lessonXpBadgeText}>
                  Урок {selectedLesson.code} • +{selectedLesson.xpReward} XP
                </Text>
              </View>
            </View>

            {showCelebration ? (
              <View style={styles.celebrationCard}>
                <View style={styles.celebrationIconCircle}>
                  <Text style={{ fontSize: 34 }}>🏆</Text>
                </View>
                <Text style={styles.celebrationTitle}>Урок пройдено!</Text>
                <Text style={styles.celebrationSubtitle}>
                  Ти опанувала «{selectedLesson.title}» та отримала нагороду!
                </Text>

                <View style={styles.celebrationStatsRow}>
                  <View style={styles.celebrationStatBox}>
                    <Text style={styles.celebrationStatValue}>
                      +{selectedLesson.xpReward} XP
                    </Text>
                    <Text style={styles.celebrationStatLabel}>Досвід</Text>
                  </View>
                  <View style={styles.celebrationStatBox}>
                    <Text style={styles.celebrationStatValue}>🔥 13 днів</Text>
                    <Text style={styles.celebrationStatLabel}>Новий стрік</Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => {
                    setShowCelebration(false);
                    setActiveTab('home');
                  }}
                  style={styles.primaryCtaButton}
                >
                  <Text style={styles.primaryCtaText}>
                    Повернутися на головну →
                  </Text>
                </Pressable>
              </View>
            ) : (
              <>
                {/* Lesson Title Card */}
                <View style={styles.heroCard}>
                  <Text style={styles.lessonSourceEyebrow}>
                    📚 {selectedLesson.sourceBook} ({selectedLesson.sourceRef})
                  </Text>
                  <Text style={styles.lessonFullTitle}>
                    {selectedLesson.title}
                  </Text>
                  <Text style={styles.heroSubtitle}>
                    {selectedLesson.subtitle}
                  </Text>

                  {/* 3-Step Segmented Switcher */}
                  <View style={styles.segmentedTabsBox}>
                    {[
                      { id: 'theory', label: '1. Теорія & Акорди' },
                      { id: 'practice', label: '2. Практика' },
                      { id: 'quiz', label: '3. Міні-тест' },
                    ].map((t) => {
                      const active = lessonSubTab === t.id;
                      return (
                        <Pressable
                          key={t.id}
                          onPress={() => setLessonSubTab(t.id as LessonSubTab)}
                          style={[
                            styles.segmentedTabBtn,
                            active && styles.segmentedTabBtnActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.segmentedTabText,
                              active && styles.segmentedTabTextActive,
                            ]}
                          >
                            {t.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {lessonSubTab === 'theory' && (
                  <>
                    {/* Interactive Chord Diagrams */}
                    {selectedLesson.chordPreview && (
                      <View style={styles.sectionBlock}>
                        <View style={styles.chordHeaderRow}>
                          <Text style={styles.blockSectionTitle}>
                            Інтерактивні аплікатури (натисни для звуку)
                          </Text>
                          <Text style={styles.audioHintLabel}>🔊 Аудіо</Text>
                        </View>
                        <View style={styles.chordGridRow}>
                          {selectedLesson.chordPreview.map((chord) => (
                            <ChordDiagramCard key={chord.name} chord={chord} />
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Strum Pattern Visualizer */}
                    {selectedLesson.strumPattern && (
                      <View style={styles.heroCard}>
                        <Text style={styles.lessonSourceEyebrow}>
                          ТРЕНАЖЕР БОЮ (STRUMMING)
                        </Text>
                        <Text style={styles.blockSectionTitle}>
                          {selectedLesson.strumPattern.name}
                        </Text>
                        <View style={styles.strumBeatsRow}>
                          {selectedLesson.strumPattern.beats.map((b, i) => {
                            const isMiss = b.direction.startsWith('miss');
                            return (
                              <View
                                key={i}
                                style={[
                                  styles.strumBeatCell,
                                  isMiss && styles.strumBeatMiss,
                                  b.accent && styles.strumBeatAccent,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.strumArrowText,
                                    b.accent && { color: '#FAF7F0' },
                                  ]}
                                >
                                  {b.direction.includes('D') ? '↓' : '↑'}
                                </Text>
                                <Text
                                  style={[
                                    styles.strumDirCode,
                                    b.accent && { color: '#FAF7F0' },
                                  ]}
                                >
                                  {isMiss ? '—' : b.direction}
                                </Text>
                                <Text
                                  style={[
                                    styles.strumCountLabel,
                                    b.accent && { color: '#FDE68A' },
                                  ]}
                                >
                                  {b.count}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    )}

                    {/* Key Takeaways */}
                    <View style={styles.heroCard}>
                      <Text style={styles.blockSectionTitle}>
                        Головні правила уроку
                      </Text>
                      <View style={styles.takeawaysList}>
                        {selectedLesson.keyTakeaways.map((item, idx) => (
                          <View key={idx} style={styles.takeawayRow}>
                            <View style={styles.takeawayNumCircle}>
                              <Text style={styles.takeawayNumText}>
                                {idx + 1}
                              </Text>
                            </View>
                            <Text style={styles.takeawayText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Dark Studio TAB Block */}
                    {selectedLesson.tabSnippet && (
                      <View style={styles.darkTabCard}>
                        <Text style={styles.darkTabHeader}>
                          {selectedLesson.tabSnippet.title}
                        </Text>
                        {selectedLesson.tabSnippet.lines.map((line, idx) => (
                          <Text key={idx} style={styles.darkTabLine}>
                            {line}
                          </Text>
                        ))}
                      </View>
                    )}

                    <Pressable
                      onPress={() => setLessonSubTab('practice')}
                      style={styles.primaryCtaButton}
                    >
                      <Text style={styles.primaryCtaText}>
                        Перейти до практики →
                      </Text>
                    </Pressable>
                  </>
                )}

                {lessonSubTab === 'practice' && (
                  <View style={styles.heroCard}>
                    <Text style={styles.lessonSourceEyebrow}>
                      ПРАКТИЧНЕ ЗАВДАННЯ З КНИГИ
                    </Text>
                    <Text style={styles.practiceTaskDescription}>
                      {selectedLesson.practiceTask}
                    </Text>

                    <View style={styles.checklistContainer}>
                      {[
                        'Поставив пальці округло ("куполом") одразу за поріжками ладів',
                        'Перевірив чистоту звучання кожної струни окремо (без глушіння)',
                        'Зіграв вправу в повільному темпі без зупинки правої руки',
                      ].map((stepText, idx) => {
                        const checked = !!checkedSteps[idx];
                        return (
                          <Pressable
                            key={idx}
                            onPress={() =>
                              setCheckedSteps((p) => ({
                                ...p,
                                [idx]: !p[idx],
                              }))
                            }
                            style={[
                              styles.checkItemRow,
                              checked && styles.checkItemRowChecked,
                            ]}
                          >
                            <View
                              style={[
                                styles.checkboxSquare,
                                checked && styles.checkboxSquareChecked,
                              ]}
                            >
                              {checked && (
                                <Text style={styles.checkboxTick}>✓</Text>
                              )}
                            </View>
                            <Text style={styles.checkItemLabel}>{stepText}</Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    <Pressable
                      onPress={() => setLessonSubTab('quiz')}
                      style={[styles.primaryCtaButton, { marginTop: 16 }]}
                    >
                      <Text style={styles.primaryCtaText}>
                        Далі: Перевірка знань →
                      </Text>
                    </Pressable>
                  </View>
                )}

                {lessonSubTab === 'quiz' && (
                  <View style={styles.heroCard}>
                    <Text style={styles.lessonSourceEyebrow}>
                      МІНІ-ТЕСТ УРОКУ
                    </Text>
                    <Text style={styles.quizPromptText}>
                      {selectedLesson.quizQuestion?.prompt ??
                        'Чи виконав ти практичну вправу цього уроку чистим звуком?'}
                    </Text>

                    <View style={styles.quizOptionsList}>
                      {(
                        selectedLesson.quizQuestion?.options ?? [
                          'Так, усі ноти й акорди звучать чисто!',
                          'Ще треную плавність переходів',
                        ]
                      ).map((opt, idx) => {
                        const isSelected = selectedQuizOption === idx;
                        const correctIdx =
                          selectedLesson.quizQuestion?.correctIndex ?? 0;
                        const isCorrect = idx === correctIdx;

                        return (
                          <Pressable
                            key={idx}
                            onPress={() => setSelectedQuizOption(idx)}
                            style={[
                              styles.quizOptionBtn,
                              isSelected &&
                                (isCorrect
                                  ? styles.quizOptionCorrect
                                  : styles.quizOptionWrong),
                            ]}
                          >
                            <Text style={styles.quizOptionText}>{opt}</Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    {selectedQuizOption !== null &&
                      selectedLesson.quizQuestion && (
                        <View style={styles.quizExplanationBox}>
                          <Text style={styles.quizExplanationText}>
                            💡 {selectedLesson.quizQuestion.explanation}
                          </Text>
                        </View>
                      )}

                    <Pressable
                      onPress={() => completeLesson(selectedLesson.xpReward)}
                      style={[styles.primaryCtaButton, { marginTop: 16 }]}
                    >
                      <Text style={styles.primaryCtaText}>
                        Завершити урок (+{selectedLesson.xpReward} XP) 🎉
                      </Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        )}

        {/* ================================================================ */}
        {/* SCREEN 4: LEADERBOARD & ACHIEVEMENT BADGES                       */}
        {/* ================================================================ */}
        {activeTab === 'leaderboard' && (
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroCard}>
              <Text style={styles.blockSectionTitle}>
                🏅 Твої нагороди (Badges)
              </Text>
              <View style={styles.badgesGrid}>
                {[
                  { icon: '🎸', name: 'Перші 3 акорди', unlocked: true },
                  { icon: '🔥', name: '12 Day Streak', unlocked: true },
                  { icon: '🥁', name: 'Майстер Ритму', unlocked: true },
                  { icon: '⚡', name: 'Титан Баре', unlocked: false },
                  { icon: '🧭', name: 'Штурман Грифу', unlocked: false },
                  { icon: '👑', name: 'Магістр Соло', unlocked: false },
                ].map((b) => (
                  <View
                    key={b.name}
                    style={[
                      styles.badgeItemCard,
                      !b.unlocked && { opacity: 0.45 },
                    ]}
                  >
                    <Text style={{ fontSize: 22 }}>{b.icon}</Text>
                    <Text style={styles.badgeItemTitle}>{b.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.heroCard}>
              <Text style={styles.blockSectionTitle}>🏆 Рейтинг тижня</Text>
              <View style={styles.leaderboardList}>
                {[
                  {
                    rank: 1,
                    name: 'Марія (Ти)',
                    xp: `${xpPoints + 1110} XP`,
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
                  <View
                    key={row.rank}
                    style={[
                      styles.leaderRow,
                      row.highlight && styles.leaderRowHighlight,
                    ]}
                  >
                    <View style={styles.leaderLeft}>
                      <View style={styles.leaderRankCircle}>
                        <Text style={styles.leaderRankText}>{row.rank}</Text>
                      </View>
                      <View>
                        <Text style={styles.leaderNameText}>{row.name}</Text>
                        <Text style={styles.leaderMetaText}>
                          {row.tier} • 🔥 12 стрік
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.leaderXpText}>{row.xp}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        {/* ================================================================ */}
        {/* FLOATING PILL BOTTOM NAVIGATION BAR (SOFT ELEVATED)              */}
        {/* ================================================================ */}
        <View style={styles.bottomNavWrapper}>
          <View style={styles.bottomNavPill}>
            <Pressable
              onPress={() => setActiveTab('home')}
              style={[
                styles.navTabBtn,
                activeTab === 'home' && styles.navTabBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.navTabLabel,
                  activeTab === 'home' && styles.navTabLabelActive,
                ]}
              >
                🧭 Головна
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('pathway')}
              style={[
                styles.navTabBtn,
                activeTab === 'pathway' && styles.navTabBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.navTabLabel,
                  activeTab === 'pathway' && styles.navTabLabelActive,
                ]}
              >
                📖 Шлях (29)
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('lesson')}
              style={styles.centerPlayFab}
            >
              <Text style={styles.centerPlayFabIcon}>▶</Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('leaderboard')}
              style={[
                styles.navTabBtn,
                activeTab === 'leaderboard' && styles.navTabBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.navTabLabel,
                  activeTab === 'leaderboard' && styles.navTabLabelActive,
                ]}
              >
                🏆 Рейтинг
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ================================================================== */}
      {/* 12 DAY STREAK MODAL OVERLAY                                        */}
      {/* ================================================================== */}
      <Modal
        visible={showStreakModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStreakModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalFlameBadge}>
              <Text style={{ fontSize: 28 }}>🔥</Text>
            </View>
            <Text style={styles.modalStreakCount}>12</Text>
            <Text style={styles.modalStreakLabel}>днів практики поспіль!</Text>

            <View style={styles.modalWeekBox}>
              {[
                { day: 'Пн', active: true },
                { day: 'Вт', active: true },
                { day: 'Ср', active: true },
                { day: 'Чт', active: true },
                { day: 'Пт', active: false },
                { day: 'Сб', active: false },
                { day: 'Нд', active: false },
              ].map((d) => (
                <View key={d.day} style={styles.modalDayCol}>
                  <View
                    style={[
                      styles.modalBoltCircle,
                      d.active && styles.modalBoltCircleActive,
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: d.active ? '#FFFFFF' : '#A8A29E',
                      }}
                    >
                      ⚡
                    </Text>
                  </View>
                  <Text style={styles.modalDayName}>{d.day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.modalBonusBanner}>
              <Text style={styles.modalBonusTitle}>
                💎 +25 Бонус за стабільність
              </Text>
              <Text style={styles.modalBonusSub}>
                15 хвилин щодня — найкращий шлях до чистої гри на гітарі!
              </Text>
            </View>

            <Pressable
              onPress={() => setShowStreakModal(false)}
              style={styles.primaryCtaButton}
            >
              <Text style={styles.primaryCtaText}>Продовжити!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: HONEY_STUDIO_THEME.canvasBg,
  },
  topAmbientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(234, 179, 8, 0.12)',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    position: 'relative',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 18 : 10,
    paddingBottom: 110,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: HONEY_STUDIO_THEME.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarInitial: {
    color: HONEY_STUDIO_THEME.primaryText,
    fontSize: 16,
    fontWeight: '800',
  },
  onlineDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: HONEY_STUDIO_THEME.successBg,
    borderWidth: 2,
    borderColor: HONEY_STUDIO_THEME.canvasBg,
  },
  greetingLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  userNameText: {
    fontSize: 17,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  headerPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statPill: {
    ...SOFT_ELEVATED_CARD,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statEmoji: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  bellButton: {
    ...SOFT_ELEVATED_CARD,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellEmoji: {
    fontSize: 13,
  },
  bellBadgeDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: HONEY_STUDIO_THEME.secondaryAccent,
  },
  streakBanner: {
    backgroundColor: HONEY_STUDIO_THEME.streakBg,
    borderWidth: 1,
    borderColor: HONEY_STUDIO_THEME.streakBorder,
    borderRadius: 24,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: HONEY_STUDIO_THEME.streakIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakIconEmoji: {
    fontSize: 20,
  },
  streakContentCol: {
    flex: 1,
  },
  streakTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.streakTitle,
  },
  streakDetailsLink: {
    fontSize: 11,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.streakTitle,
  },
  weekDaysRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 8,
  },
  weekDayCell: {
    flex: 1,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(28, 25, 23, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayDone: {
    backgroundColor: HONEY_STUDIO_THEME.secondaryAccent,
  },
  weekDayToday: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: HONEY_STUDIO_THEME.secondaryAccent,
  },
  weekDayText: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  weekDayTextDone: {
    color: '#FFFFFF',
  },
  heroCard: {
    ...SOFT_ELEVATED_CARD,
    borderRadius: 26,
    padding: 16,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modulePill: {
    backgroundColor: HONEY_STUDIO_THEME.primarySoftBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  modulePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.primarySoftText,
  },
  durationMetaText: {
    fontSize: 11,
    fontWeight: '600',
    color: HONEY_STUDIO_THEME.textMuted,
  },
  progressPercentLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.secondaryAccent,
  },
  heroBodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  heroTextCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
    lineHeight: 22,
  },
  heroSubtitle: {
    fontSize: 12,
    color: HONEY_STUDIO_THEME.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  chordQuickAudioBtn: {
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
    borderWidth: 1,
    borderColor: HONEY_STUDIO_THEME.borderSubtle,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  chordQuickAudioIcon: {
    fontSize: 14,
  },
  chordQuickAudioName: {
    fontSize: 12,
    fontWeight: '900',
    color: HONEY_STUDIO_THEME.textPrimary,
    marginTop: 2,
  },
  chordQuickAudioSub: {
    fontSize: 9,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.textMuted,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
    overflow: 'hidden',
    marginTop: 14,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: HONEY_STUDIO_THEME.secondaryAccent,
  },
  primaryCtaButton: {
    marginTop: 14,
    backgroundColor: HONEY_STUDIO_THEME.primaryBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryCtaText: {
    color: HONEY_STUDIO_THEME.primaryText,
    fontSize: 13,
    fontWeight: '800',
  },
  xpRewardPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  xpRewardPillText: {
    color: HONEY_STUDIO_THEME.primaryText,
    fontSize: 11,
    fontWeight: '800',
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoGoalCard: {
    ...SOFT_ELEVATED_CARD,
    flex: 1,
    borderRadius: 24,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bentoCardTopRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bentoCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  testBumpBadge: {
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  testBumpText: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  goalCircleOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: HONEY_STUDIO_THEME.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  goalCircleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalFractionText: {
    fontSize: 14,
    fontWeight: '900',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  goalSegmentsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 6,
  },
  goalSegment: {
    flex: 1,
    height: 5,
    borderRadius: 999,
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
  },
  goalSegmentActive: {
    backgroundColor: HONEY_STUDIO_THEME.secondaryAccent,
  },
  bentoFooterCaption: {
    fontSize: 11,
    fontWeight: '600',
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  bentoChallengeCard: {
    flex: 1,
    backgroundColor: HONEY_STUDIO_THEME.challengeBg,
    borderWidth: 1,
    borderColor: HONEY_STUDIO_THEME.challengeBorder,
    borderRadius: 24,
    padding: 14,
    justifyContent: 'space-between',
  },
  challengeHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.challengeText,
  },
  challengeXpBadge: {
    backgroundColor: 'rgba(28, 25, 23, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  challengeXpText: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.challengeText,
  },
  challengeBody: {
    marginVertical: 8,
  },
  challengeMainTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.challengeText,
    lineHeight: 18,
  },
  challengeSubtext: {
    fontSize: 11,
    fontWeight: '600',
    color: HONEY_STUDIO_THEME.challengeSubtext,
    marginTop: 3,
  },
  challengeStartPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(28, 25, 23, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  challengeStartText: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.challengeText,
  },
  curriculumSection: {
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.secondaryAccent,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  sectionStatsText: {
    fontSize: 12,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.textMuted,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 10,
  },
  filterPill: {
    backgroundColor: HONEY_STUDIO_THEME.cardBg,
    borderWidth: 1,
    borderColor: HONEY_STUDIO_THEME.borderSubtle,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  filterPillActive: {
    backgroundColor: HONEY_STUDIO_THEME.primaryBg,
    borderColor: HONEY_STUDIO_THEME.primaryBg,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  filterPillTextActive: {
    color: HONEY_STUDIO_THEME.primaryText,
  },
  modulesList: {
    gap: 12,
  },
  moduleCard: {
    ...SOFT_ELEVATED_CARD,
    borderRadius: 24,
    overflow: 'hidden',
  },
  moduleHeaderBtn: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  moduleBadgeBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleBadgeBoxDone: {
    backgroundColor: HONEY_STUDIO_THEME.successSoftBg,
  },
  moduleBadgeEmoji: {
    fontSize: 16,
  },
  moduleBadgeCode: {
    fontSize: 9,
    fontWeight: '900',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  moduleInfoCol: {
    flex: 1,
  },
  moduleTierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tierTagPill: {
    backgroundColor: HONEY_STUDIO_THEME.primarySoftBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  tierTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.primarySoftText,
  },
  lessonCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: HONEY_STUDIO_THEME.textMuted,
  },
  moduleTitleText: {
    fontSize: 13,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
    marginTop: 4,
  },
  moduleSourceText: {
    fontSize: 10,
    color: HONEY_STUDIO_THEME.textMuted,
    marginTop: 2,
  },
  moduleProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  moduleProgressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
    overflow: 'hidden',
  },
  moduleProgressFill: {
    height: '100%',
    borderRadius: 999,
  },
  moduleProgressLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  chevronIcon: {
    fontSize: 11,
    color: HONEY_STUDIO_THEME.textMuted,
    marginTop: 4,
  },
  lessonsListContainer: {
    backgroundColor: HONEY_STUDIO_THEME.canvasBg,
    borderTopWidth: 1,
    borderTopColor: HONEY_STUDIO_THEME.borderSubtle,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  lessonRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  lessonRowBorderTop: {
    borderTopWidth: 1,
    borderTopColor: HONEY_STUDIO_THEME.borderSubtle,
  },
  lessonStatusIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: HONEY_STUDIO_THEME.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonStatusCompleted: {
    backgroundColor: HONEY_STUDIO_THEME.successBg,
    borderColor: HONEY_STUDIO_THEME.successBg,
  },
  lessonStatusCurrent: {
    backgroundColor: HONEY_STUDIO_THEME.primaryBg,
    borderColor: HONEY_STUDIO_THEME.primaryBg,
  },
  lessonStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  lessonRowInfo: {
    flex: 1,
  },
  lessonRowMetaTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonCodeText: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.secondaryAccent,
  },
  lessonSourceSmall: {
    fontSize: 10,
    color: HONEY_STUDIO_THEME.textMuted,
    flex: 1,
  },
  lessonRowTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.textPrimary,
    marginTop: 1,
  },
  lessonRowStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  lessonStatItem: {
    fontSize: 10,
    color: HONEY_STUDIO_THEME.textMuted,
  },
  lessonArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.textMuted,
  },
  lessonTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButtonPill: {
    ...SOFT_ELEVATED_CARD,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  lessonXpBadge: {
    backgroundColor: HONEY_STUDIO_THEME.primarySoftBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  lessonXpBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.primarySoftText,
  },
  lessonSourceEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.secondaryAccent,
    textTransform: 'uppercase',
  },
  lessonFullTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
    marginTop: 4,
  },
  segmentedTabsBox: {
    flexDirection: 'row',
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
    borderRadius: 14,
    padding: 4,
    marginTop: 14,
  },
  segmentedTabBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentedTabBtnActive: {
    backgroundColor: HONEY_STUDIO_THEME.primaryBg,
  },
  segmentedTabText: {
    fontSize: 11,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  segmentedTabTextActive: {
    color: HONEY_STUDIO_THEME.primaryText,
  },
  sectionBlock: {
    gap: 8,
  },
  chordHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blockSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  audioHintLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.secondaryAccent,
  },
  chordGridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  strumBeatsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
  },
  strumBeatCell: {
    flex: 1,
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  strumBeatMiss: {
    opacity: 0.35,
  },
  strumBeatAccent: {
    backgroundColor: HONEY_STUDIO_THEME.primaryBg,
  },
  strumArrowText: {
    fontSize: 14,
    fontWeight: '900',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  strumDirCode: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  strumCountLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.textMuted,
    marginTop: 2,
  },
  takeawaysList: {
    gap: 10,
    marginTop: 10,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  takeawayNumCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: HONEY_STUDIO_THEME.primarySoftBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  takeawayNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.primarySoftText,
  },
  takeawayText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  darkTabCard: {
    backgroundColor: HONEY_STUDIO_THEME.darkTabBg,
    borderRadius: 22,
    padding: 16,
  },
  darkTabHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FBBF24',
    marginBottom: 8,
  },
  darkTabLine: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    color: '#FEF3C7',
    lineHeight: 17,
  },
  practiceTaskDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: HONEY_STUDIO_THEME.textPrimary,
    marginTop: 6,
    lineHeight: 19,
  },
  checklistContainer: {
    gap: 8,
    marginTop: 12,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
  },
  checkItemRowChecked: {
    backgroundColor: HONEY_STUDIO_THEME.successSoftBg,
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: HONEY_STUDIO_THEME.textMuted,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSquareChecked: {
    backgroundColor: HONEY_STUDIO_THEME.successBg,
    borderColor: HONEY_STUDIO_THEME.successBg,
  },
  checkboxTick: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  checkItemLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  quizPromptText: {
    fontSize: 14,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
    marginTop: 6,
    lineHeight: 20,
  },
  quizOptionsList: {
    gap: 8,
    marginTop: 12,
  },
  quizOptionBtn: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  quizOptionCorrect: {
    backgroundColor: HONEY_STUDIO_THEME.successSoftBg,
    borderColor: HONEY_STUDIO_THEME.successBg,
  },
  quizOptionWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  quizOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  quizExplanationBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: HONEY_STUDIO_THEME.primarySoftBg,
  },
  quizExplanationText: {
    fontSize: 12,
    fontWeight: '600',
    color: HONEY_STUDIO_THEME.primarySoftText,
  },
  celebrationCard: {
    ...SOFT_ELEVATED_CARD,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  celebrationIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: HONEY_STUDIO_THEME.primarySoftBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  celebrationTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  celebrationSubtitle: {
    fontSize: 12,
    color: HONEY_STUDIO_THEME.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  celebrationStatsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginVertical: 16,
  },
  celebrationStatBox: {
    flex: 1,
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  celebrationStatValue: {
    fontSize: 16,
    fontWeight: '900',
    color: HONEY_STUDIO_THEME.secondaryAccent,
  },
  celebrationStatLabel: {
    fontSize: 11,
    color: HONEY_STUDIO_THEME.textMuted,
    marginTop: 2,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  badgeItemCard: {
    width: '31%',
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  badgeItemTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
    textAlign: 'center',
    marginTop: 4,
  },
  leaderboardList: {
    gap: 8,
    marginTop: 12,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
  },
  leaderRowHighlight: {
    backgroundColor: HONEY_STUDIO_THEME.primarySoftBg,
  },
  leaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  leaderRankCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: HONEY_STUDIO_THEME.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderRankText: {
    color: HONEY_STUDIO_THEME.primaryText,
    fontSize: 12,
    fontWeight: '900',
  },
  leaderNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  leaderMetaText: {
    fontSize: 10,
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  leaderXpText: {
    fontSize: 12,
    fontWeight: '900',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  bottomNavWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  bottomNavPill: {
    ...SOFT_FLOATING_PILL,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navTabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  navTabBtnActive: {
    backgroundColor: HONEY_STUDIO_THEME.primaryBg,
  },
  navTabLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  navTabLabelActive: {
    color: HONEY_STUDIO_THEME.primaryText,
  },
  centerPlayFab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: HONEY_STUDIO_THEME.secondaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPlayFabIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: HONEY_STUDIO_THEME.cardBg,
    borderRadius: 30,
    padding: 22,
    alignItems: 'center',
  },
  modalFlameBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: HONEY_STUDIO_THEME.streakIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -42,
    marginBottom: 8,
  },
  modalStreakCount: {
    fontSize: 36,
    fontWeight: '900',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  modalStreakLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  modalWeekBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: HONEY_STUDIO_THEME.subtleSurfaceBg,
    borderRadius: 18,
    padding: 12,
    marginVertical: 16,
  },
  modalDayCol: {
    alignItems: 'center',
    gap: 4,
  },
  modalBoltCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: HONEY_STUDIO_THEME.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBoltCircleActive: {
    backgroundColor: HONEY_STUDIO_THEME.secondaryAccent,
  },
  modalDayName: {
    fontSize: 10,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  modalBonusBanner: {
    width: '100%',
    backgroundColor: HONEY_STUDIO_THEME.streakBg,
    borderWidth: 1,
    borderColor: HONEY_STUDIO_THEME.streakBorder,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 4,
  },
  modalBonusTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: HONEY_STUDIO_THEME.streakTitle,
  },
  modalBonusSub: {
    fontSize: 11,
    color: HONEY_STUDIO_THEME.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
