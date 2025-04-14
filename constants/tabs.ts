import { MaterialCommunityIcons } from '@expo/vector-icons';

export type TabConfig = {
  name: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export const TAB_CONFIGS: TabConfig[] = [
  {
    name: 'home',
    title: 'Home',
    icon: 'home',
  },
  {
    name: 'tree',
    title: 'History',
    icon: 'history',
  },
  {
    name: 'chat',
    title: 'AI Assistant',
    icon: 'robot',
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: 'account',
  },
]; 