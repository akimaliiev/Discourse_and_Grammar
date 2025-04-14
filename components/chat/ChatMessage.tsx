import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import { TreeData } from '../../types/tree';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'tree_explanation' | 'learning_guidance';
  metadata?: {
    tree?: TreeData;
    language?: string;
    topic?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isUser, 
  timestamp,
  type = 'text',
  metadata
}) => {
  const theme = useTheme();

  const renderContent = () => {
    switch (type) {
      case 'tree_explanation':
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Tree Explanation</Text>
              <Text variant="bodyMedium" style={styles.message}>
                {message}
              </Text>
            </Card.Content>
          </Card>
        );
      case 'learning_guidance':
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">
                Learning Guide: {metadata?.topic}
              </Text>
              <Text variant="bodyMedium" style={styles.message}>
                {message}
              </Text>
            </Card.Content>
          </Card>
        );
      default:
        return (
          <Text
            style={[
              styles.message,
              {
                color: isUser ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {message}
          </Text>
        );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          backgroundColor: isUser ? theme.colors.primary : theme.colors.surfaceVariant,
        },
      ]}
    >
      {renderContent()}
      <Text
        style={[
          styles.timestamp,
          {
            color: isUser ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
          },
        ]}
      >
        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  card: {
    marginVertical: 8,
    backgroundColor: 'transparent',
  },
}); 