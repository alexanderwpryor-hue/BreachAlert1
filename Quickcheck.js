// QuickCheck.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from './api';

export default function QuickCheck() {
  const [email, setEmail] = useState('');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const data = await api.quickCheck(email);
      setScore(data.score);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.header}>Quick Check</Text>
      <View style={styles.inputWrapper}>
        <Icon name="mail-outline" size={20} color="#6200ee" />
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleCheck}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Checking...' : 'Check Score'}
        </Text>
      </TouchableOpacity>
      {score !== null && (
        <View style={styles.scoreCard}>
          <Text style={styles.scoreText}>Your Score: {score}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#333' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    paddingHorizontal: 12, marginBottom: 16, width: '100%', height: 48 },
  input: { flex: 1, marginLeft: 8, fontSize: 16, color: '#333' },
  button: {
    backgroundColor: '#6200ee', paddingVertical: 14,
    borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  scoreCard: {
    marginTop: 16, backgroundColor: '#fff', padding: 16,
    borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  scoreText: { fontSize: 20, fontWeight: 'bold', color: '#6200ee' },
});