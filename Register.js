// Register.js
import React, { useState } from "react";
import { resendConfirmation } from "./api"; 

import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { register, login } from "./api";

export default function Register({ navigation, onRegistered }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const doRegister = async () => {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    setError("Email and password required.");
    return;
  }
  if (password !== confirm) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    await register(normalizedEmail, password);

    Alert.alert(
      "Almost there!",
      "We've sent you a confirmation email. Please check your inbox before logging in."
    );

    navigation.replace("Login");
  } catch (e) {
    console.log("register error:", e);
    const msg =
      e.response?.data?.msg ||
      (e.response?.status === 409
        ? "Email already registered."
        : e.message || "Registration failed.");
    setError(msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Create BreachAlert Account</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((s) => !s)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirm}
            value={confirm}
            onChangeText={setConfirm}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowConfirm((s) => !s)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {showConfirm ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title={loading ? "Registering..." : "Register"}
          onPress={doRegister}
          disabled={loading}
        />
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.switchLink}> Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f5f5f7",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
  },
  switchText: { color: "#374151" },
  switchLink: { color: "#2563eb", fontWeight: "600" },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
  },
});