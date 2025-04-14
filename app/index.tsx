import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Layout>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to SyntaxAI
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Learn and understand syntax trees across multiple languages
        </Text>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={() => router.push('/login')}>
            Get Started
          </Button>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
}); 