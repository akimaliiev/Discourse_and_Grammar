import 'dotenv/config';

export default {
  name: 'SyntaxAI',
  slug: 'syntax-ai',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    }
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    deepseekApiKey: process.env.DEEPSEEK_API_KEY,
    supabaseUrl: 'https://mgcipsgljlgfkvjmdjap.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nY2lwc2dsamxnZmt2am1kamFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NTMwNDMsImV4cCI6MjA2MDEyOTA0M30.2al4-0qzD3BjGBT7jUypDYhghUK07e72k-4qmovp6tU',
  },
}; 