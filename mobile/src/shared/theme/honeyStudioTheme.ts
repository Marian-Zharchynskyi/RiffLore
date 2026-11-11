import { Platform, ViewStyle } from 'react-native';

/**
 * Approved RiffLore Mobile Design System:
 * "1. Honey & Espresso + Soft Elevated" (Warm Cream UI/UX Best Practice)
 */
export const HONEY_STUDIO_THEME = {
  id: 'honey-studio',
  name: '1. Honey & Espresso (Soft Elevated)',
  canvasBg: '#FAF7F0',
  cardBg: '#FFFFFF',
  subtleSurfaceBg: '#F3EFE4',
  darkTabBg: '#18181B',
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
  streakIconBg: '#D97706',
  streakTitle: '#B45309',
  challengeBg: '#FEF3C7',
  challengeBorder: '#FDE68A',
  challengeText: '#1C1917',
  challengeSubtext: '#78350F',
  successBg: '#10B981',
  successSoftBg: '#D1FAE5',
  successSoftText: '#065F46',
  borderSubtle: '#E7E0D3',
} as const;

export const SOFT_ELEVATED_CARD: ViewStyle = {
  backgroundColor: HONEY_STUDIO_THEME.cardBg,
  borderWidth: 1,
  borderColor: HONEY_STUDIO_THEME.borderSubtle,
  ...Platform.select({
    ios: {
      shadowColor: '#1C1917',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
    },
    android: {
      elevation: 3,
    },
    default: {
      shadowColor: '#1C1917',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 20,
    },
  }),
};

export const SOFT_FLOATING_PILL: ViewStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.96)',
  borderWidth: 1,
  borderColor: HONEY_STUDIO_THEME.borderSubtle,
  ...Platform.select({
    ios: {
      shadowColor: '#1C1917',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: {
      elevation: 8,
    },
    default: {
      shadowColor: '#1C1917',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
  }),
};
