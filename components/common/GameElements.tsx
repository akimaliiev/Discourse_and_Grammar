import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, Surface, IconButton, ProgressBar } from 'react-native-paper';
import { theme } from '../../constants/theme';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface ProgressHeaderProps {
  progress: number;
  hearts?: number;
  gems?: number;
  streak?: number;
  style?: ViewStyle;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  progress,
  hearts = 5,
  gems = 0,
  streak = 0,
  style,
}) => (
  <Surface style={[styles.progressHeader, style]} elevation={1}>
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Icon name="heart" size={24} color={theme.colors.hearts} />
        <Text style={styles.statText}>{hearts}</Text>
      </View>
      <View style={styles.statItem}>
        <Icon name="diamond-stone" size={24} color={theme.colors.gems} />
        <Text style={styles.statText}>{gems}</Text>
      </View>
      {streak > 0 && (
        <View style={styles.statItem}>
          <Icon name="fire" size={24} color={theme.colors.streak} />
          <Text style={styles.statText}>{streak}</Text>
        </View>
      )}
    </View>
    <ProgressBar
      progress={progress}
      color={theme.colors.primary}
      style={styles.progressBar}
    />
  </Surface>
);

interface AchievementBadgeProps {
  type: 'crown' | 'star' | 'trophy';
  value?: number;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  type,
  value,
  size = 40,
  color,
  style,
}) => {
  const iconMap = {
    crown: 'crown',
    star: 'star',
    trophy: 'trophy',
  };

  return (
    <Surface style={[styles.badge, { width: size, height: size }, style]} elevation={2}>
      <Icon name={iconMap[type]} size={size * 0.6} color={color || theme.colors.crown} />
      {value !== undefined && (
        <Text style={styles.badgeText}>{value}</Text>
      )}
    </Surface>
  );
};

interface LessonCardProps {
  title: string;
  description?: string;
  progress?: number;
  locked?: boolean;
  completed?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  title,
  description,
  progress = 0,
  locked = false,
  completed = false,
  onPress,
  style,
}) => (
  <Surface
    style={[
      styles.lessonCard,
      locked && styles.lockedCard,
      completed && styles.completedCard,
      style,
    ]}
    elevation={2}
  >
    <IconButton
      icon={completed ? 'check-circle' : locked ? 'lock' : 'school'}
      size={32}
      iconColor={completed ? theme.colors.success : locked ? theme.colors.disabled : theme.colors.primary}
      onPress={locked ? undefined : onPress}
    />
    <Text style={styles.lessonTitle}>{title}</Text>
    {description && (
      <Text style={styles.lessonDescription}>{description}</Text>
    )}
    {!completed && !locked && progress > 0 && (
      <ProgressBar
        progress={progress}
        color={theme.colors.primary}
        style={styles.lessonProgress}
      />
    )}
  </Surface>
);

const styles = StyleSheet.create({
  progressHeader: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  badge: {
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  lessonCard: {
    padding: 16,
    margin: 8,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  lockedCard: {
    opacity: 0.7,
  },
  completedCard: {
    backgroundColor: theme.colors.success + '10',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  lessonDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  lessonProgress: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    marginTop: 12,
  },
}); 