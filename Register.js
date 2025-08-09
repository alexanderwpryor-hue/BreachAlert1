// Register.js
import React, { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Animated,
  ActivityIndicator,
} from "react-native";
import { colors, base, radius } from "./theme";
import { PrimaryButton, Pill } from "./ui";
// If your API uses `signup` instead, import that and rename here.
import { register as signup } from "./api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [agree, setAgree] = useState(true);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pw2Err, setPw2Err] = useState("");

  // soft hero fade
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, []);

  const validate = () => {
    let ok = true;
    setFormError(""); setNameErr(""); setEmailErr(""); setPwErr(""); setPw2Err("");

    if (!name.trim()) {
      setNameErr("Please enter your name.");
      ok = false;
    }
    const e = email.trim().toLowerCase();
    if (!e || !emailRegex.test(e)) {
      setEmailErr("Enter a valid email address.");
      ok = false;
    }
    if (!pw || pw.length < 8) {
      setPwErr("Password must be at least 8 characters.");
      ok = false;
    }
    if (pw2 !== pw) {
      setPw2Err("Passwords do not match.");
      ok = false;
    }
    if (!agree) {
      setFormError("Please accept the Terms and Privacy Policy to continue.");
      ok = false;
    }
    return ok;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setFormError("");
    try {
      await signup(email.trim().toLowerCase(), pw, name.trim());
      // Option A (email confirmation flow):
      // navigate to a tiny screen telling them to verify email, or just send to Login with a note
      navigation.replace("Login", {
        toast: "Account created. Please check your email to verify before logging in.",
      });
    } catch (e) {
      const msg =
        e?.response?.data?.msg ||
        e?.message ||
        "Registration failed. Please try again.";
      setFormError(msg);
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

          <Pill text="Create your account" style={{ marginTop: 8 }} />

          <Animated.Text style={[styles.title, { opacity: fade }]}>
            Start free. Protect your family’s data in minutes.
          </Animated.Text>

          <View style={styles.card}>
            {/* Name */}
            <Text style={base.label}>Name</Text>
            <TextInput
              style={[base.input, nameErr ? styles.inputError : null]}
              placeholder="Your name"
              placeholderTextColor={colors.subtext}
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (nameErr) setNameErr("");
              }}
              editable={!loading}
              accessibilityLabel="Name"
              autoCapitalize="words"
            />
            {!!nameErr && <Text style={styles.fieldError}>{nameErr}</Text>}

            {/* Email */}
            <Text style={[base.label, { marginTop: 12 }]}>Email</Text>
            <TextInput
              style={[base.input, emailErr ? styles.inputError : null]}
              placeholder="you@example.com"
              placeholderTextColor={colors.subtext}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (emailErr) setEmailErr("");
              }}
              editable={!loading}
              accessibilityLabel="Email"
              autoCapitalize="none"
              keyboardType="email-address"
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
                placeholder="At least 8 characters"
                placeholderTextColor={colors.subtext}
                secureTextEntry={!showPw}
                value={pw}
                onChangeText={(t) => {
                  setPw(t);
                  if (pwErr) setPwErr("");
                }}
                editable={!loading}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                onPress={() => setShowPw((s) => !s)}
                style={styles.showBtn}
                accessibilityRole="button"
              >
                <Text style={{ color: colors.text, fontWeight: "700" }}>
                  {showPw ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            {!!pwErr && <Text style={styles.fieldError}>{pwErr}</Text>}

            {/* Confirm Password */}
            <Text style={[base.label, { marginTop: 12 }]}>Confirm password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[
                  base.input,
                  { flex: 1, marginRight: 8 },
                  pw2Err ? styles.inputError : null,
                ]}
                placeholder="Repeat password"
                placeholderTextColor={colors.subtext}
                secureTextEntry={!showPw2}
                value={pw2}
                onChangeText={(t) => {
                  setPw2(t);
                  if (pw2Err) setPw2Err("");
                }}
                editable={!loading}
                accessibilityLabel="Confirm password"
              />
              <TouchableOpacity
                onPress={() => setShowPw2((s) => !s)}
                style={styles.showBtn}
                accessibilityRole="button"
              >
                <Text style={{ color: colors.text, fontWeight: "700" }}>
                  {showPw2 ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            {!!pw2Err && <Text style={styles.fieldError}>{pw2Err}</Text>}

            {/* Terms */}
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <View style={styles.row}>
                <Switch
                  value={agree}
                  onValueChange={setAgree}
                  disabled={loading}
                  trackColor={{ false: "#26314f", true: colors.primaryAlt }}
                  thumbColor="#fff"
                />
                <Text style={{ color: colors.subtext, marginLeft: 8 }}>
                  I agree to the{" "}
                  <Text style={styles.link}>Terms</Text> and{" "}
                  <Text style={styles.link}>Privacy Policy</Text>
                </Text>
              </View>
            </View>

            {/* Form error */}
            {!!formError && <Text style={styles.error}>{formError}</Text>}

            {/* Submit */}
            <View style={{ position: "relative", marginTop: 8 }}>
              <PrimaryButton
                title={loading ? "Creating account…" : "Create account"}
                onPress={onSubmit}
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

            {/* Login CTA */}
            <View style={[styles.row, { justifyContent: "center" }]}>
              <Text style={{ color: colors.subtext }}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.replace("Login")}>
                <Text style={styles.link}>  Log in</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Legal blip */}
          <Text style={styles.legal}>
            We’ll send a verification email to activate your account.
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