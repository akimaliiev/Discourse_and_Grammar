import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Layout } from '../../components/common/Layout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useRouter } from 'expo-router';
import { resetPassword } from '../../services/supabase/auth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const { error } = await resetPassword(email);
      if (error) throw error;
      setSuccess('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'An error occurred while resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Reset Password
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}
        <Button
          mode="contained"
          onPress={handleResetPassword}
          loading={loading}
          disabled={loading}
        >
          Send Reset Link
        </Button>
        <Button
          mode="text"
          onPress={() => router.push('/login')}
          disabled={loading}
        >
          Back to Login
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  success: {
    color: 'green',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 