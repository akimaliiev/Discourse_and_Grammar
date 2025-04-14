import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, List, Button, Divider, Portal, Modal, TextInput, SegmentedButtons } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { router } from 'expo-router';
import { supabase } from '../../../services/supabase/client';

const AVAILABLE_LANGUAGES = [
  { label: 'English', value: 'english' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'Russian', value: 'russian' },
  { label: 'Kazakh', value: 'kazakh' },
];

const AVATAR_EMOJIS = ['👤', '👩', '👨', '🤖', '🦊', '🐱', '🐶', '🦁', '🐯', '🐼'];

interface UserProfile {
  email: string;
  username: string;
  avatar_emoji: string;
  bio: string;
  preferred_language: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const { user, signOut } = useAuth();

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username, avatar_emoji, bio, preferred_language')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setProfile({
        email: user?.email || '',
        username: data?.username || '',
        avatar_emoji: data?.avatar_emoji || '👤',
        bio: data?.bio || '',
        preferred_language: data?.preferred_language || 'english',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          username: editedProfile.username,
          avatar_emoji: editedProfile.avatar_emoji,
          bio: editedProfile.bio,
          preferred_language: editedProfile.preferred_language,
        })
        .eq('id', user?.id);

      if (error) throw error;

      await loadProfile();
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const openEditModal = () => {
    setEditedProfile(profile || {});
    setEditModalVisible(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.avatarEmoji}>{profile?.avatar_emoji || '👤'}</Text>
        <Text variant="headlineSmall" style={styles.username}>
          {profile?.username || 'User'}
        </Text>
        <Text variant="bodyMedium" style={styles.email}>
          {profile?.email}
        </Text>
        {profile?.bio && (
          <Text variant="bodyMedium" style={styles.bio}>
            {profile.bio}
          </Text>
        )}
      </View>

      <List.Section>
        <List.Subheader>Account Settings</List.Subheader>
        <List.Item
          title="Edit Profile"
          description="Change your avatar, bio, and username"
          left={props => <List.Icon {...props} icon="account-edit" />}
          onPress={openEditModal}
        />
        <List.Item
          title="Language Preferences"
          description={`Current: ${profile?.preferred_language || 'English'}`}
          left={props => <List.Icon {...props} icon="translate" />}
          onPress={() => setEditModalVisible(true)}
        />
      </List.Section>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          Sign Out
        </Button>
      </View>

      <Portal>
        <Modal
          visible={editModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Edit Profile
          </Text>
          
          <Text variant="bodyMedium" style={styles.label}>Avatar</Text>
          <View style={styles.emojiGrid}>
            {AVATAR_EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                mode={editedProfile.avatar_emoji === emoji ? 'contained' : 'outlined'}
                onPress={() => setEditedProfile({ ...editedProfile, avatar_emoji: emoji })}
                style={styles.emojiButton}
              >
                {emoji}
              </Button>
            ))}
          </View>

          <TextInput
            label="Username"
            value={editedProfile.username}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, username: text })}
            style={styles.input}
          />

          <TextInput
            label="Bio"
            value={editedProfile.bio}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Text variant="bodyMedium" style={styles.label}>Preferred Language</Text>
          <SegmentedButtons
            value={editedProfile.preferred_language || 'english'}
            onValueChange={(value) =>
              setEditedProfile({ ...editedProfile, preferred_language: value })
            }
            buttons={AVAILABLE_LANGUAGES}
            style={styles.languageButtons}
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setEditModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveProfile}
              style={styles.modalButton}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  username: {
    marginTop: 10,
  },
  email: {
    color: '#666',
  },
  bio: {
    marginTop: 10,
    textAlign: 'center',
    color: '#444',
  },
  footer: {
    padding: 20,
    marginTop: 'auto',
  },
  signOutButton: {
    marginTop: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 8,
    color: '#666',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emojiButton: {
    margin: 4,
    minWidth: 50,
  },
  languageButtons: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginLeft: 10,
  },
}); 