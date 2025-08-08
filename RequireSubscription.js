// RequireSubscription.js – full file (superset)
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
} from "react-native";
import PaywallScreen from "./PaywallScreen";
import { getSubscriptionStatus } from "./api";
import Purchases from "react-native-purchases";

const Loading = ({ message }) => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" />
    {message && <Text style={styles.info}>{message}</Text>}
  </View>
);

async function hasRcEntitlement() {
  try {
    const info = await Purchases.getCustomerInfo();
    return !!info.entitlements.active?.pro;
  } catch (e) {
    console.warn("RC check failed:", e);
    return false;
  }
}

export default function RequireSubscription({ navigation, children }) {
  const [state, setState] = useState({ loading: true, active: false });

  const refresh = useCallback(async () => {
    setState({ loading: true, active: false });
    try {
      // 1) Server flag (Stripe OR RC webhook)
      const res = await getSubscriptionStatus();
      if (res.subscription_active) {
        setState({ loading: false, active: true });
        return;
      }
      // 2) Fallback to device entitlement
      const rc = await hasRcEntitlement();
      setState({ loading: false, active: rc });
    } catch (e) {
      console.error("Subscription check failed:", e);
      setState({ loading: false, active: false });
      Alert.alert("Subscription Error", "Couldn’t verify your subscription.");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (state.loading) return <Loading message="Checking subscription…" />;

  return state.active ? (
    <>{children}</>
  ) : (
    <PaywallScreen navigation={navigation} onSuccess={refresh} />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  info:     { marginTop: 10, color: "#666" },
});
