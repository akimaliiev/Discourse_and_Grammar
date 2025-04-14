import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#58CC02', // Duolingo green
    secondary: '#1CB0F6', // Duolingo blue
    error: '#FF4B4B', // Duolingo red
    background: '#FFFFFF',
    surface: '#FFFFFF',
    accent: '#CE82FF', // Purple for special features
    success: '#58CC02',
    warning: '#FFC800', // Yellow for streaks/achievements
    placeholder: '#AFAFAF',
    textPrimary: '#4B4B4B',
    textSecondary: '#777777',
    border: '#E5E5E5',
    card: '#F7F7F7',
    // Custom colors
    crown: '#FFD900', // For achievements
    hearts: '#FF4B4B', // For lives system
    streak: '#FF9600', // For streak flames
    gems: '#1CB0F6', // For currency
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  roundness: 16,
  fonts: configureFonts({ config: fontConfig }),
  animation: {
    scale: 1.0,
  },
};

export const styles = {
  // Card styles
  card: {
    borderRadius: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
  },
  // Button styles
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 2,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Input styles
  input: {
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  // Header styles
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B4B4B',
    marginBottom: 16,
  },
  // Progress bar
  progressBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
  },
  // Achievement badge
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // List item
  listItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
}; 