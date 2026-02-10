/**
 * Athkar Screen
 * Browse athkar categories and track dhikr with tap counter
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useSettings } from '../hooks';
import { athkarData, AthkarCategory, Dhikr } from '../data/athkar';
import { getAthkarProgress, saveAthkarProgress } from '../utils/storage';
import { ThemeColors, Typography, Spacing, BorderRadius } from '../theme';

// ============================================================
// Category List View
// ============================================================
function CategoryList({
  colors,
  onSelectCategory,
}: {
  colors: ThemeColors;
  onSelectCategory: (cat: AthkarCategory) => void;
}) {
  const styles = makeCategoryStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Athkar & Supplications</Text>
      <Text style={styles.pageSubtitle}>
        Daily remembrances from the Quran and Sunnah
      </Text>

      {athkarData.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryCard}
          onPress={() => onSelectCategory(category)}
          activeOpacity={0.7}
        >
          <View style={styles.categoryIcon}>
            <Ionicons
              name={
                category.id === 'morning'
                  ? 'sunny-outline'
                  : category.id === 'evening'
                  ? 'moon-outline'
                  : category.id === 'after_prayer'
                  ? 'hand-left-outline'
                  : 'bed-outline'
              }
              size={28}
              color={colors.primary}
            />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryDesc}>{category.description}</Text>
            <Text style={styles.categoryCount}>
              {category.items.length} supplications
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const makeCategoryStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
    pageTitle: { ...Typography.h1, color: colors.text, marginBottom: Spacing.xs },
    pageSubtitle: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
      marginBottom: Spacing.lg,
    },
    categoryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 2,
    },
    categoryIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.prayerHighlight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    categoryInfo: { flex: 1 },
    categoryTitle: { ...Typography.h3, color: colors.text },
    categoryDesc: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
      marginTop: 2,
    },
    categoryCount: {
      ...Typography.caption,
      color: colors.primary,
      marginTop: 4,
      fontWeight: '600',
    },
  });

// ============================================================
// Dhikr Detail View with Counter
// ============================================================
function DhikrView({
  category,
  colors,
  onBack,
}: {
  category: AthkarCategory;
  colors: ThemeColors;
  onBack: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const dhikr = category.items[currentIndex];
  const currentCount = counts[dhikr.id] || 0;
  const isComplete = currentCount >= dhikr.repeat;
  const progress = Math.min(currentCount / dhikr.repeat, 1);

  const handleTap = useCallback(() => {
    if (isComplete) return;

    Vibration.vibrate(10);
    const newCount = currentCount + 1;
    setCounts((prev) => ({ ...prev, [dhikr.id]: newCount }));

    // Auto-advance when complete
    if (newCount >= dhikr.repeat && currentIndex < category.items.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 600);
    }
  }, [currentCount, dhikr, isComplete, currentIndex, category.items.length]);

  const goNext = () => {
    if (currentIndex < category.items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const styles = makeDhikrStyles(colors);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{category.title}</Text>
          <Text style={styles.headerProgress}>
            {currentIndex + 1} / {category.items.length}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Dhikr Content */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.arabicText}>{dhikr.arabic}</Text>
        <Text style={styles.transliteration}>{dhikr.transliteration}</Text>
        <View style={styles.translationBox}>
          <Text style={styles.translation}>{dhikr.translation}</Text>
        </View>
        <Text style={styles.reference}>{dhikr.reference}</Text>
      </ScrollView>

      {/* Counter Section */}
      <View style={styles.counterSection}>
        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>

        {/* Navigation + Counter */}
        <View style={styles.counterRow}>
          <TouchableOpacity
            onPress={goPrev}
            disabled={currentIndex === 0}
            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentIndex === 0 ? colors.textMuted : colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleTap}
            style={[styles.counterButton, isComplete && styles.counterButtonComplete]}
            activeOpacity={0.8}
          >
            {isComplete ? (
              <Ionicons name="checkmark-circle" size={32} color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.counterNumber}>
                  {currentCount}
                </Text>
                <Text style={styles.counterTotal}>/ {dhikr.repeat}</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goNext}
            disabled={currentIndex === category.items.length - 1}
            style={[
              styles.navButton,
              currentIndex === category.items.length - 1 && styles.navButtonDisabled,
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={
                currentIndex === category.items.length - 1
                  ? colors.textMuted
                  : colors.text
              }
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.tapHint}>
          {isComplete ? 'Completed ✓' : 'Tap to count'}
        </Text>
      </View>
    </View>
  );
}

const makeDhikrStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: { padding: Spacing.sm },
    headerCenter: { alignItems: 'center' },
    headerTitle: { ...Typography.h3, color: colors.text },
    headerProgress: { ...Typography.caption, color: colors.textSecondary },

    contentScroll: { flex: 1 },
    contentContainer: {
      padding: Spacing.lg,
      alignItems: 'center',
    },
    arabicText: {
      ...Typography.arabicLarge,
      color: colors.text,
      textAlign: 'center',
      marginBottom: Spacing.lg,
      writingDirection: 'rtl',
    },
    transliteration: {
      ...Typography.body,
      color: colors.primary,
      textAlign: 'center',
      fontStyle: 'italic',
      marginBottom: Spacing.md,
    },
    translationBox: {
      backgroundColor: colors.surfaceAlt,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      width: '100%',
      marginBottom: Spacing.md,
    },
    translation: {
      ...Typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    reference: {
      ...Typography.caption,
      color: colors.textMuted,
    },

    // Counter
    counterSection: {
      paddingHorizontal: Spacing.md,
      paddingBottom: Spacing.xl,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    progressBarContainer: {
      height: 4,
      backgroundColor: colors.progressBg,
      borderRadius: 2,
      marginTop: Spacing.md,
      marginBottom: Spacing.md,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.progressFill,
      borderRadius: 2,
    },
    counterRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.xl,
    },
    navButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surfaceAlt,
      justifyContent: 'center',
      alignItems: 'center',
    },
    navButtonDisabled: {
      opacity: 0.4,
    },
    counterButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    counterButtonComplete: {
      backgroundColor: colors.success,
    },
    counterNumber: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    counterTotal: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.7)',
    },
    tapHint: {
      ...Typography.caption,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: Spacing.sm,
    },
  });

// ============================================================
// Main Athkar Screen
// ============================================================
export default function AthkarScreen() {
  const { settings } = useSettings();
  const { colors } = useTheme(settings?.theme);
  const [selectedCategory, setSelectedCategory] = useState<AthkarCategory | null>(null);

  if (selectedCategory) {
    return (
      <DhikrView
        category={selectedCategory}
        colors={colors}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <CategoryList
      colors={colors}
      onSelectCategory={setSelectedCategory}
    />
  );
}
