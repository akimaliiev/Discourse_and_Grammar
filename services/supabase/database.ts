import { supabase } from './client';

// Syntax Trees
export const createSyntaxTree = async (treeData: {
  user_id: string;
  sentence: string;
  language: string;
  tree_data: any;
  title?: string;
  description?: string;
}) => {
  const { data, error } = await supabase
    .from('syntax_trees')
    .insert([treeData])
    .select();
  return { data, error };
};

export const getSyntaxTrees = async (userId: string) => {
  const { data, error } = await supabase
    .from('syntax_trees')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Learning Progress
export const updateLearningProgress = async (progressData: {
  user_id: string;
  language: string;
  completed_lessons: number;
  total_lessons: number;
  proficiency_level?: string;
}) => {
  const { data, error } = await supabase
    .from('learning_progress')
    .upsert([progressData])
    .select();
  return { data, error };
};

export const getLearningProgress = async (userId: string, language: string) => {
  const { data, error } = await supabase
    .from('learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('language', language)
    .single();
  return { data, error };
};

// Chat History
export const saveChatMessage = async (messageData: {
  user_id: string;
  message: string;
  response: string;
  language: string;
  context?: any;
}) => {
  const { data, error } = await supabase
    .from('chat_history')
    .insert([messageData])
    .select();
  return { data, error };
};

export const getChatHistory = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
};

// Saved Resources
export const saveResource = async (resourceData: {
  user_id: string;
  resource_type: string;
  resource_id: string;
  title?: string;
  description?: string;
}) => {
  const { data, error } = await supabase
    .from('saved_resources')
    .insert([resourceData])
    .select();
  return { data, error };
};

export const getSavedResources = async (userId: string) => {
  const { data, error } = await supabase
    .from('saved_resources')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}; 