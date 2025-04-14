import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

const LANGUAGES = [
  {
    id: 'english',
    name: 'English',
    flag: '🇺🇸',
    description: 'For native speakers',
  },
  {
    id: 'spanish',
    name: 'Spanish',
    flag: '🇪🇸',
    description: 'Most popular',
  },
  {
    id: 'russian',
    name: 'Russian',
    flag: '🇷🇺',
    description: 'For intermediate learners',
  },
  {
    id: 'kazakh',
    name: 'Kazakh',
    flag: '🇰🇿',
    description: 'For beginners',
  },
];

export default function LanguageSelectScreen() {
  const handleLanguageSelect = (languageId: string) => {
    // Save selected language
    router.push('/(main)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="translate" size={40} color={theme.colors.primary} />
        <Text style={styles.title}>What would you like to learn?</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>For English speakers</Text>
        
        {LANGUAGES.map((language) => (
          <Surface
            key={language.id}
            style={styles.languageCard}
            elevation={1}
          >
            <Button
              mode="text"
              onPress={() => handleLanguageSelect(language.id)}
              contentStyle={styles.languageButton}
            >
              <View style={styles.languageContent}>
                <Text style={styles.flag}>{language.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageDescription}>
                    {language.description}
                  </Text>
                </View>
              </View>
            </Button>
          </Surface>
        ))}
      </ScrollView>

      <Surface style={styles.footer} elevation={4}>
        <Button
          mode="contained"
          onPress={() => router.push('/(main)')}
          style={styles.continueButton}
          labelStyle={styles.continueButtonText}
        >
          CONTINUE
        </Button>
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  languageCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  languageButton: {
    height: 72,
    justifyContent: 'flex-start',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  languageDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  continueButton: {
    borderRadius: 12,
    height: 48,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 