import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChordDiagramData } from '../entities/course/zeroToProCurriculum';
import {
  HONEY_STUDIO_THEME,
  SOFT_ELEVATED_CARD,
} from '../shared/theme/honeyStudioTheme';
import { playChordAudio } from '../shared/audio/chordAudio';

interface ChordDiagramCardProps {
  chord: ChordDiagramData;
}

const STRING_INDICES = [0, 1, 2, 3, 4, 5];
const FRET_ROWS = [1, 2, 3, 4];
const GRID_WIDTH = 86;
const FRET_HEIGHT = 17;

export function ChordDiagramCard({ chord }: ChordDiagramCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePress = () => {
    playChordAudio(chord.name);
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 550);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        isPlaying && styles.cardActive,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.chordName}>{chord.name}</Text>
        <View
          style={[
            styles.soundPill,
            isPlaying && { backgroundColor: HONEY_STUDIO_THEME.secondaryAccent },
          ]}
        >
          <Text
            style={[
              styles.soundIcon,
              isPlaying && { color: '#FFFFFF' },
            ]}
          >
            {isPlaying ? '♪' : '🔊'}
          </Text>
        </View>
      </View>

      <Text numberOfLines={1} style={styles.subtitle}>
        {chord.subtitle}
      </Text>

      {/* Open / Muted indicators above nut */}
      <View style={styles.topIndicatorsRow}>
        {STRING_INDICES.map((strIdx) => {
          const fretVal = chord.frets[strIdx];
          return (
            <View key={strIdx} style={styles.indicatorCell}>
              <Text
                style={[
                  styles.indicatorText,
                  fretVal === -1 && styles.mutedText,
                  fretVal === 0 && styles.openText,
                ]}
              >
                {fretVal === -1 ? '×' : fretVal === 0 ? '○' : ' '}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Fretboard Grid */}
      <View style={styles.gridWrapper}>
        {chord.baseFret && chord.baseFret > 1 ? (
          <Text style={styles.baseFretLabel}>{chord.baseFret}fr</Text>
        ) : null}

        <View
          style={[
            styles.nutLine,
            chord.baseFret && chord.baseFret > 1 ? styles.thinNutLine : null,
          ]}
        />

        {FRET_ROWS.map((fretNum) => (
          <View key={fretNum} style={styles.fretRow}>
            {/* Vertical string lines & finger dots */}
            {STRING_INDICES.map((strIdx) => {
              const fretVal = chord.frets[strIdx];
              const fingerVal = chord.fingers[strIdx];
              const isFingerHere = fretVal === fretNum;

              return (
                <View key={strIdx} style={styles.stringColumn}>
                  <View
                    style={[
                      styles.stringLine,
                      strIdx < 2 ? styles.bassStringLine : null,
                    ]}
                  />
                  {isFingerHere && (
                    <View
                      style={[
                        styles.fingerDot,
                        isPlaying && {
                          backgroundColor: HONEY_STUDIO_THEME.secondaryAccent,
                        },
                      ]}
                    >
                      <Text style={styles.fingerNumber}>
                        {fingerVal > 0 ? String(fingerVal) : ''}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* Bottom finger summary row */}
      <View style={styles.bottomFingersRow}>
        {STRING_INDICES.map((strIdx) => {
          const fingerVal = chord.fingers[strIdx];
          const fretVal = chord.frets[strIdx];
          return (
            <View key={strIdx} style={styles.indicatorCell}>
              <Text style={styles.bottomFingerText}>
                {fingerVal > 0 ? fingerVal : fretVal === 0 ? '0' : '×'}
              </Text>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...SOFT_ELEVATED_CARD,
    flex: 1,
    minWidth: 98,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  cardActive: {
    borderColor: HONEY_STUDIO_THEME.secondaryAccent,
    backgroundColor: '#FFFBEB',
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  chordName: {
    fontSize: 14,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.textPrimary,
  },
  soundPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: HONEY_STUDIO_THEME.primarySoftBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundIcon: {
    fontSize: 10,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.primarySoftText,
  },
  subtitle: {
    fontSize: 10,
    color: HONEY_STUDIO_THEME.textMuted,
    marginTop: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  topIndicatorsRow: {
    width: GRID_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  indicatorCell: {
    width: GRID_WIDTH / 6,
    alignItems: 'center',
  },
  indicatorText: {
    fontSize: 10,
    fontWeight: '800',
  },
  mutedText: {
    color: '#EF4444',
  },
  openText: {
    color: HONEY_STUDIO_THEME.textSecondary,
  },
  gridWrapper: {
    width: GRID_WIDTH,
    position: 'relative',
  },
  baseFretLabel: {
    position: 'absolute',
    left: -18,
    top: 2,
    fontSize: 9,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.secondaryAccent,
  },
  nutLine: {
    width: '100%',
    height: 3.5,
    backgroundColor: HONEY_STUDIO_THEME.textPrimary,
    borderRadius: 2,
  },
  thinNutLine: {
    height: 1.5,
    backgroundColor: '#A8A29E',
  },
  fretRow: {
    width: GRID_WIDTH,
    height: FRET_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D6D3D1',
  },
  stringColumn: {
    width: GRID_WIDTH / 6,
    height: FRET_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stringLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#A8A29E',
  },
  bassStringLine: {
    width: 1.5,
    backgroundColor: '#78716C',
  },
  fingerDot: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: HONEY_STUDIO_THEME.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  fingerNumber: {
    fontSize: 8,
    fontWeight: '800',
    color: HONEY_STUDIO_THEME.primaryText,
  },
  bottomFingersRow: {
    width: GRID_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  bottomFingerText: {
    fontSize: 9,
    fontWeight: '700',
    color: HONEY_STUDIO_THEME.textMuted,
  },
});
