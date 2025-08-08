// AddChild.js
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { addChild } from "./api";
import { colors, base, radius } from "./theme";
import { PrimaryButton } from "./ui";

export default function AddChild({ navigation, route }) {
  const { onAdded } = route.params;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Validation", "Name and email are required.");
      return;
    }
    setLoading(true);
    try {
      const child = await addChild({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim() || null,
      });
      Alert.alert("Success", `Added ${child.name}`);
      onAdded?.();
      navigation.goBack();
    } catch (e) {
      const msg = e.response?.data ? JSON.stringify(e.response.data) : e.message || "Failed";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={base.screen}>
      <View style={[base.container]}>
        <Text style={base.h1}>Add New Child</Text>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius + 4, padding: 16 }}>
          <Text style={base.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={base.input}
            placeholder="Child's name"
            placeholderTextColor={colors.subtext}
            editable={!loading}
          />
          <Text style={[base.label, { marginTop: 12 }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={base.input}
            placeholder="child@example.com"
            placeholderTextColor={colors.subtext}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          <Text style={[base.label, { marginTop: 12 }]}>Username (optional)</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={base.input}
            placeholder="@username"
            placeholderTextColor={colors.subtext}
            editable={!loading}
          />

          <PrimaryButton
            title={loading ? "Adding…" : "Add Child"}
            onPress={submit}
            disabled={loading}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
