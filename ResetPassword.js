// ResetPassword.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Linking,
} from "react-native";
import { colors, base, radius } from "./theme";
import { PrimaryButton, Pill } from "./ui";
import { resetPassword } from "./api";

function getQueryParam(url, key) {
  const q = url.split("?")[1] || "";
  const params = new URLSearchParams(q);
  return params.get(key);
}

export default function ResetPassword({ route, navigation }) {
  const [token, setToken] = useState(route?.params?.token || "");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (token) return;
    // If launched via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        const t = getQueryParam(url, "token");
        if (t) setToken(t);
      }
    });
  }, [token]);

  const onSubmit = async () => {
    setError("");
    if (!token) return setError("Missing or invalid reset token.");
    if (!pw || pw.length < 8) return setError("Password must be at least 8 characters.");
    if (pw !== pw2) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await resetPassword(token, pw);
      setDone(true);
    } catch (e) {
      const msg = e?.response?.data?.msg || "Reset failed. The link may have expired.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={base.screen}>
      <View style={[base.container, { paddingTop: 24 }]}>
        <Pill text="Account help" />
        <Text style={styles.title}>Create a new password</Text>
        <View style={styles.card}>
          {!done ? (
            <>
              <Text style={base.label}>New password</Text>
              <TextInput
                style={base.input}
                placeholder="At least 8 characters"
                placeholderTextColor={colors.subtext}
                secureTextEntry
                value={pw}
                onChangeText={setPw}
              />
              <Text style={[base.label, { marginTop: 12 }]}>Confirm password</Text>
              <TextInput
                style={base.input}
                placeholder="Repeat password"
                placeholderTextColor={colors.subtext}
                secureTextEntry
                value={pw2}
                onChangeText={setPw2}
              />
              {!!error && <Text style={styles.error}>{error}</Text>}
              <PrimaryButton
                title={loading ? "Updating…" : "Update password"}
                onPress={onSubmit}
                disabled={loading}
                style={{ marginTop: 12 }}
              />
            </>
          ) : (
            <>
              <Text style={styles.successTitle}>Password updated</Text>
              <Text style={styles.copy}>You can now log in with your new password.</Text>
              <PrimaryButton
                title="Go to Login"
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
  title: { color: colors.text, fontSize: 24, fontWeight: "900", marginVertical: 10 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius + 6,
    padding: 18,
  },
  error: { color: colors.danger, marginTop: 10, fontWeight: "700" },
  successTitle: { color: colors.text, fontWeight: "900", fontSize: 18, marginBottom: 6 },
  copy: { color: colors.subtext, lineHeight: 20 },
});
