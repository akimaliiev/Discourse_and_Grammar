import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, ActivityIndicator, TextInput, IconButton, Avatar } from 'react-native-paper';
import { ChatMessage } from '../../../components/chat/ChatMessage';
import { ChatInput } from '../../../components/chat/ChatInput';
import { aiClient } from '../../../services/ai/client';
import { useAuth } from '../../../hooks/useAuth';
import { TreeData } from '../../../types/tree';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
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

export default function ChatScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your language learning assistant. How can I help you today?',
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      },
    ]);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // AI response logic will be implemented here
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'This is a placeholder AI response.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.aiMessage]}>
      <Avatar.Icon
        size={32}
        icon={item.isUser ? 'account' : 'robot'}
        style={styles.avatar}
      />
      <View style={styles.messageContent}>
        <Text variant="bodyMedium">{item.text}</Text>
        <Text variant="bodySmall" style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          style={styles.input}
          right={
            <TextInput.Icon
              icon="send"
              disabled={!input.trim() || loading}
              onPress={handleSend}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  avatar: {
    marginRight: 8,
  },
  messageContent: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 16,
    flex: 1,
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    backgroundColor: '#fff',
  },
}); 