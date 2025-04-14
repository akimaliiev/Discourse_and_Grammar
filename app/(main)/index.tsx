import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';
import { generateSyntaxTree } from '../../services/tree/generator';
import { supabase } from '../../services/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { TreeView } from '../../components/tree/TreeView';
import type { TreeData } from '../../types/tree';

const LANGUAGES = [
  { id: 'english', name: 'English', flag: '🇺🇸' },
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { id: 'russian', name: 'Russian', flag: '🇷🇺' },
  { id: 'kazakh', name: 'Kazakh', flag: '🇰🇿' },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [sentence, setSentence] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<TreeData | null>(null);

  const handleGenerateTree = async () => {
    if (!sentence.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const tree = await generateSyntaxTree(sentence.trim(), selectedLanguage.id);
      setTreeData(tree);
    } catch (error) {
      console.error('Error generating tree:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate syntax tree');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!treeData || !user) return;

    try {
      await supabase.from('syntax_trees').insert({
        user_id: user.id,
        sentence: sentence.trim(),
        language: selectedLanguage.id,
        tree_data: treeData,
        is_public: false,
      });
      // Show success message or notification
    } catch (error) {
      console.error('Error saving tree:', error);
      // Show error message
    }
  };

  const handleExplain = () => {
    if (!treeData) return;
    
    // Navigate to chat with context
    router.push({
      pathname: '/(main)/chat',
      params: {
        context: JSON.stringify({
          type: 'tree_explanation',
          sentence,
          language: selectedLanguage.id,
          tree: treeData,
        }),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Generate Syntax Tree</Text>

        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>Choose a language</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.languageList}
          >
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.id}
                mode={selectedLanguage.id === lang.id ? 'contained' : 'outlined'}
                onPress={() => setSelectedLanguage(lang)}
                style={styles.languageButton}
                labelStyle={styles.languageButtonLabel}
              >
                {lang.flag} {lang.name}
              </Button>
            ))}
          </ScrollView>
        </View>

        <TextInput
          mode="outlined"
          label="Enter a sentence"
          value={sentence}
          onChangeText={setSentence}
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        <Button
          mode="contained"
          onPress={handleGenerateTree}
          loading={loading}
          disabled={loading || !sentence.trim()}
          style={styles.generateButton}
        >
          Generate Tree
        </Button>

        {error && (
          <Text style={styles.error}>{error}</Text>
        )}

        {treeData && (
          <View style={styles.treeSection}>
            <View style={styles.treeContainer}>
              <TreeView data={treeData} />
            </View>
            
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={handleSave}
                style={[styles.actionButton, styles.saveButton]}
                icon="content-save"
              >
                Save
              </Button>
              <Button
                mode="contained"
                onPress={handleExplain}
                style={[styles.actionButton, styles.explainButton]}
                icon="chat-question"
              >
                Explain
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  languageSection: {
    marginBottom: 24,
  },
  languageList: {
    marginHorizontal: -8,
  },
  languageButton: {
    marginHorizontal: 4,
    minWidth: 120,
  },
  languageButtonLabel: {
    fontSize: 16,
  },
  input: {
    marginBottom: 16,
  },
  generateButton: {
    marginBottom: 16,
  },
  error: {
    color: theme.colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  treeSection: {
    marginTop: 16,
  },
  treeContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 16,
    minHeight: 200,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  explainButton: {
    backgroundColor: theme.colors.secondary,
  },
}); 