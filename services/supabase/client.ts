import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createUserProfile = async (userId: string, email: string) => {
  const { error } = await supabase
    .from('users')
    .insert([
      {
        id: userId,
        email: email,
        username: email.split('@')[0], // Default username from email
        avatar_emoji: '👤',
        preferred_language: 'english',
        bio: ''
      }
    ]);

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Listen for signup events
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    try {
      // Check if user profile exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', session.user.id)
        .single();

      // If profile doesn't exist, create it
      if (!existingProfile) {
        await createUserProfile(session.user.id, session.user.email || '');
      }
    } catch (error) {
      console.error('Error in auth state change:', error);
    }
  }
}); 