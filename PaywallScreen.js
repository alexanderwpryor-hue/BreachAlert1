// PaywallScreen.js – full file (superset)
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import Purchases from "react-native-purchases";

/**
 * Can run either as a stand-alone screen (Dashboard ➜ Paywall)
 * or inline (RequireSubscription wraps another screen).
 *
 * @param {object} props
 * @param {object} props.navigation – injected by React Navigation
 * @param {Function=} props.onSuccess  – optional callback when purchased/restored
 */
export default function PaywallScreen({ navigation, onSuccess }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // ──────────────────────────────────────────────── offering
        const offerings = await Purchases.getOfferings(); // RC v6 returns object
        const offering  = offerings.current;
        if (!offering) {
          Alert.alert("No subscription available", "Please try again later.");
          navigation.goBack();
          return;
        }

        // ──────────────────────────────────────────────── present paywall
        const result = await RevenueCatUI.presentPaywall({
          requiredEntitlementIdentifier: "pro",
          offering,
        });

        const purchased =
          result === PAYWALL_RESULT.PURCHASED ||
          result === PAYWALL_RESULT.RESTORED;

        // ──────────────────────────────────────────────── handle result
        if (purchased && typeof onSuccess === "function") {
          setLoading(false);
          onSuccess();            // inline wrapper refreshes & renders child
          return;
        }

        // stand-alone navigation pop (or cancel/error)
        navigation.goBack();
      } catch (e) {
        console.error("Paywall error:", e);
        Alert.alert("Error", e?.message || "Unable to show subscription screen.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [navigation, onSuccess]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" animating={loading} />
    </View>
  );
}
