// ForgotPassword.js
import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, StyleSheet } from "react-native";
import { colors, base, radius } from "./theme";
import { PrimaryButton, Pill } from "./ui";
import { requestPasswordReset } from "./api";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email.trim().toLowerCase());
      setSent(true);
    } catch (e) {
      const msg = e?.response?.data?.msg || "Could not send reset email.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={base.screen}>
      <View style={[base.container, { paddingTop: 24 }]}>
        <Pill text="Account help" />
        <Text style={styles.title}>Forgot your password?</Text>
        <View style={styles.card}>
          {!sent ? (
            <>
              <Text style={base.label}>Email</Text>
              <TextInput
                style={base.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.subtext}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
              {!!error && <Text style={styles.error}>{error}</Text>}
              <PrimaryButton
                title={loading ? "Sending…" : "Send reset link"}
                onPress={onSubmit}
                disabled={loading}
                style={{ marginTop: 12 }}
              />
            </>
          ) : (
            <>
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.copy}>
                We’ve emailed a link to reset your password. The link expires in
                30 minutes. If it doesn’t arrive, check spam or try again.
              </Text>
              <PrimaryButton
                title="Back to Login"
                onPress={() => navigation.replace("Login")}
                style={{ marginTop: 12 }}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius + 6,
    padding: 18,
    marginTop: 6,
  },
  error: { color: colors.danger, marginTop: 10, fontWeight: "700" },
  successTitle: { color: colors.text, fontWeight: "900", fontSize: 18, marginBottom: 6 },
  copy: { color: colors.subtext, lineHeight: 20 },
});
