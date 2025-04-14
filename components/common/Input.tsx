import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput as PaperInput } from 'react-native-paper';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: any;
  error?: boolean;
  errorText?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  style,
  error = false,
  errorText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) => {
  return (
    <PaperInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, style]}
      error={error}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      mode="outlined"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
  },
}); 