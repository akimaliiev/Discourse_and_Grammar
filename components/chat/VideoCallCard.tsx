import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, Avatar } from 'react-native-paper';
import { theme } from '../../constants/theme';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface VideoCallCardProps {
  tutorName: string;
  tutorAvatar?: string;
  xpReward: number;
  onPress: () => void;
}

export const VideoCallCard: React.FC<VideoCallCardProps> = ({
  tutorName,
  tutorAvatar,
  xpReward,
  onPress,
}) => {
  return (
    <Surface style={styles.container} elevation={1}>
      <Text style={styles.title}>Video Call</Text>
      
      <View style={styles.tutorContainer}>
        <Avatar.Image
          size={80}
          source={
            tutorAvatar
              ? { uri: tutorAvatar }
              : require('../../assets/default-avatar.png')
          }
          style={styles.avatar}
        />
        <View style={styles.onlineIndicator} />
        <Text style={styles.tutorName}>{tutorName}</Text>
      </View>

      <TouchableOpacity
        style={styles.callButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Icon name="video" size={24} color="#FFFFFF" />
        <Text style={styles.callButtonText}>
          CALL {tutorName.toUpperCase()} +{xpReward} XP
        </Text>
      </TouchableOpacity>

      <View style={styles.practiceSection}>
        <Text style={styles.practiceTitle}>Skill practice</Text>
        <View style={styles.practiceGrid}>
          <PracticeItem icon="chat" label="Roleplay" />
          <PracticeItem icon="refresh" label="Mistakes" />
          <PracticeItem icon="cards" label="Words" />
          <PracticeItem icon="headphones" label="Listen" />
        </View>
      </View>
    </Surface>
  );
};

interface PracticeItemProps {
  icon: string;
  label: string;
}

const PracticeItem: React.FC<PracticeItemProps> = ({ icon, label }) => (
  <Surface style={styles.practiceItem} elevation={0}>
    <Icon name={icon} size={24} color={theme.colors.primary} />
    <Text style={styles.practiceLabel}>{label}</Text>
  </Surface>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 24,
  },
  tutorContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: theme.colors.primary + '20',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    position: 'absolute',
    bottom: 40,
    right: '40%',
  },
  tutorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: 8,
  },
  callButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  practiceSection: {
    marginTop: 8,
  },
  practiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  practiceGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  practiceLabel: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginLeft: 12,
  },
}); 