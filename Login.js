// Login.js
import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases from "react-native-purchases";
import { login, saveRevenueCatId, getUserIdFromToken } from "./api";
import { colors, base, radius } from "./theme";
import { PrimaryButton, Pill } from "./ui";

const EMAIL_KEY = "cybernest_saved_email";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onLoginSuccess, navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [pwErr, setPwErr] = useState("");

  // soft hero fade
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(EMAIL_KEY);
        if (saved) setEmail(saved);
      } catch {}
    })();
  }, []);

  const validate = () => {
    let ok = true;
    setEmailErr("");
    setPwErr("");

    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailErr("Enter a valid email address.");
      ok = false;
    }
    if (!password || password.length < 8) {
      setPwErr("Password must be at least 8 characters.");
      ok = false;
    }
    return ok;
  };

  const doLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      await login(email.trim().toLowerCase(), password, true);

      const userId = getUserIdFromToken();
      const appUserId = `parent_${userId}`;

      try {
        await Purchases.logIn(String(appUserId));
        await saveRevenueCatId(String(appUserId));
      } catch (e) {
        console.warn("RevenueCat linkage failed:", e);
      }

      if (rememberEmail) await AsyncStorage.setItem(EMAIL_KEY, email);
      else await AsyncStorage.removeItem(EMAIL_KEY);

      onLoginSuccess();
    } catch (e) {
      const msg =
        e?.response?.data?.msg ||
        (e?.response?.status === 401 ? "Invalid credentials." : "Login failed.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={base.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={[base.container, { paddingTop: 28, gap: 12 }]}>
          {/* Brand row */}
          <View style={styles.brandRow}>
            <View style={styles.logoDot} />
            <Text style={styles.brand}>BreachAlert</Text>
          </View>

          <Pill text="BreachAlert" style={{ marginTop: 8 }} />

          <Animated.Text style={[styles.title, { opacity: fade }]}>
            Know instantly if your child’s data appears in a breach
          </Animated.Text>

          <View style={styles.card}>
            {/* Email */}
            <Text style={base.label}>Email</Text>
            <TextInput
              style={[base.input, emailErr ? styles.inputError : null]}
              placeholder="you@example.com"
              placeholderTextColor={colors.subtext}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (emailErr) setEmailErr("");
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              accessibilityLabel="Email"
            />
            {!!emailErr && <Text style={styles.fieldError}>{emailErr}</Text>}

            {/* Password */}
            <Text style={[base.label, { marginTop: 12 }]}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[
                  base.input,
                  { flex: 1, marginRight: 8 },
                  pwErr ? styles.inputError : null,
                ]}
                placeholder="Password"
                placeholderTextColor={colors.subtext}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (pwErr) setPwErr("");
                }}
                editable={!loading}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((s) => !s)}
                style={styles.showBtn}
                accessibilityRole="button"
              >
                <Text style={{ color: colors.text, fontWeight: "700" }}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            {!!pwErr && <Text style={styles.fieldError}>{pwErr}</Text>}

            {/* Remember / Forgot */}
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <View style={styles.row}>
                <Switch
                  value={rememberEmail}
                  onValueChange={setRememberEmail}
                  disabled={loading}
                  trackColor={{ false: "#26314f", true: colors.primaryAlt }}
                  thumbColor="#fff"
                />
                <Text style={{ color: colors.subtext, marginLeft: 8 }}>
                  Remember email
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate?.("ForgotPassword")}>
                <Text style={styles.link}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Form error */}
            {!!error && <Text style={styles.error}>{error}</Text>}

            {/* Submit */}
            <View style={{ position: "relative", marginTop: 8 }}>
              <PrimaryButton
                title={loading ? "Logging in…" : "Login"}
                onPress={doLogin}
                disabled={loading}
              />
              {loading && (
                <ActivityIndicator
                  style={styles.btnSpinner}
                  size="small"
                  color="#fff"
                />
              )}
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={{ color: colors.subtext, fontSize: 12, paddingHorizontal: 8 }}>
                or
              </Text>
              <View style={styles.divider} />
            </View>

            {/* Register CTA */}
            <View style={[styles.row, { justifyContent: "center" }]}>
              <Text style={{ color: colors.subtext }}>Don’t have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.link}>  Start free</Text>
              </TouchableOpacity>
            </View>
          </View>



          {/* Legal blip */}
          <Text style={styles.legal}>
            By continuing you agree to our Terms and Privacy Policy.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: "row", alignItems: "center" },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  brand: { color: colors.text, fontWeight: "900", fontSize: 18, letterSpacing: 0.2 },

  title: {
    color: colors.text,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "900",
    marginBottom: 6,
  },

  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius + 6,
    padding: 18,
  },

  passwordRow: { flexDirection: "row", alignItems: "center" },

  showBtn: {
    backgroundColor: colors.chip,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
  },

  row: { flexDirection: "row", alignItems: "center", marginTop: 12 },

  link: { color: colors.primary, fontWeight: "800" },

  error: { color: colors.danger, marginTop: 10, fontWeight: "800" },
  fieldError: { color: colors.danger, marginTop: 6, fontSize: 12, fontWeight: "600" },
  inputError: { borderColor: colors.danger },

  dividerRow: {
    marginVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },

  featuresRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },

  legal: {
    color: colors.subtext,
    fontSize: 12,
    marginTop: 8,
  },

  btnSpinner: {
    position: "absolute",
    right: 16,
    top: 14,
  },
});
