// ChildDetail.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { fetchChildDetail } from "./api";

export default function ChildDetail({ route }) {
  const { child } = route.params;
  const [detail, setDetail] = useState(child);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchChildDetail(child.id)
      .then(fresh => setDetail(fresh))
      .catch(e => {
        console.error(e);
        Alert.alert("Error", e.message || "Could not load details");
      })
      .finally(() => setLoading(false));
  }, [child.id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const {
    name,
    email,
    username,
    safety_score,
    breach_summary,
    last_checked,
    breach_details = {},
  } = detail;

  const hibpBreaches = breach_details.breaches || [];
  const pastes      = breach_details.pastes    || [];

  const toggle = key =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Details for {name}</Text>

        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.label}>
            <Text style={styles.bold}>Email:</Text> {email}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>Username:</Text> {username || "—"}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>Last checked:</Text>{" "}
            {last_checked
              ? new Date(last_checked).toLocaleString()
              : "Never"}
          </Text>
        </View>

        {/* Safety Score */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreTitle}>Safety Score</Text>
          <Text style={styles.scoreValue}>{safety_score}</Text>
        </View>

        {/* Summary */}
        <Text style={styles.subheading}>Summary</Text>
        <Text style={styles.summaryText}>
          {breach_summary || "No breaches found."}
        </Text>

        {/* HIBP Breaches */}
        <Text style={styles.subheading}>Breaches</Text>
        {hibpBreaches.length ? hibpBreaches.map((b, i) => {
          const key = `b${i}`;
          const isOpen = expanded[key];
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.8}
              onPress={() => toggle(key)}
              style={styles.breachCard}
            >
              <View style={styles.breachHeader}>
                <Text style={styles.breachTitle}>
                  {b.title || b.name}
                </Text>
                <Text style={styles.breachDate}>
                  {b.added_date}
                </Text>
              </View>
              <View style={styles.badgeRow}>
                {b.isVerified && (
                  <Text style={[styles.badge, styles.verified]}>
                    Verified
                  </Text>
                )}
                {b.isSensitive && (
                  <Text style={[styles.badge, styles.sensitive]}>
                    Sensitive
                  </Text>
                )}
              </View>
              <Text style={styles.breachData}>
                Data: {b.data_classes.join(", ")}
              </Text>
              <Text
                style={[
                  styles.breachDesc,
                  !isOpen && styles.truncatedDesc
                ]}
              >
                {b.description.replace(/<[^>]+>/g, "")}
              </Text>
              <Text style={styles.expandHint}>
                {isOpen ? "Show less ◢" : "Show more ◣"}
              </Text>
              <Text style={styles.pwnCount}>
                Affected: {b.pwn_count.toLocaleString()}
              </Text>
            </TouchableOpacity>
          );
        })
        : <Text style={styles.textMuted}>No breaches recorded.</Text>}

        {/* Paste exposures as before */}
        <Text style={styles.subheading}>Paste Exposures</Text>
        {pastes.length ? pastes.map((p,i) => {
          const href =
            p.Source === "AdHocUrl" ? p.Id
            : `https://haveibeenpwned.com/${p.Source}/${p.Id}`;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => Linking.openURL(href)}
              style={styles.pasteItem}
            >
              <Text style={styles.pasteSource}>{p.Source}</Text>
              <Text style={styles.pasteDate}>
                {(p.Date||"").slice(0,10) || "—"}
              </Text>
            </TouchableOpacity>
          );
        })
        : <Text style={styles.textMuted}>No paste exposures.</Text>}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f5f7" },
  container: { padding: 16, paddingBottom: 48 },
  centered: { flex:1, justifyContent:"center", alignItems:"center" },
  heading: { fontSize: 26, fontWeight: "700", marginBottom: 12 },
  subheading: {
    fontSize: 20, fontWeight: "600", marginTop: 16, marginBottom: 6
  },
  section: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 4 },
  bold: { fontWeight: "600" },

  scoreBox: {
    backgroundColor: "#fff", padding: 16, borderRadius: 10,
    marginVertical: 12, alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.04, elevation: 2,
  },
  scoreTitle: { fontSize: 14, color: "#6b7280" },
  scoreValue: { fontSize: 32, fontWeight: "700" },

  summaryText: {
    fontSize: 14, lineHeight: 20, color: "#374151"
  },

  // Breach card
  breachCard: {
    backgroundColor: "#fff", borderRadius: 10,
    padding: 12, marginTop: 8,
    shadowColor: "#000", shadowOpacity: 0.04, elevation: 1,
  },
  breachHeader: { flexDirection: "row", justifyContent: "space-between" },
  breachTitle: { fontSize: 16, fontWeight: "600" },
  breachDate: { fontSize: 12, color: "#6b7280" },
  badgeRow: { flexDirection: "row", marginTop: 6 },
  badge: {
    fontSize: 10, fontWeight: "600", paddingHorizontal: 6,
    paddingVertical: 2, borderRadius: 4, marginRight: 6,
  },
  verified: { backgroundColor: "#d1fae5", color: "#047857" },
  sensitive: { backgroundColor: "#fee2e2", color: "#b91c1c" },
  breachData: { fontSize: 12, marginTop: 6, color: "#374151" },
  breachDesc: { fontSize: 12, marginTop: 6, color: "#6b7280" },
  truncatedDesc: { 
    maxHeight: 48, overflow: "hidden" 
  },
  expandHint: {
    fontSize: 12, color: "#3b82f6", marginTop: 4,
    textAlign: "right"
  },
  pwnCount: {
    fontSize: 12, color: "#6b7280", marginTop: 6,
    textAlign: "right"
  },
  textMuted: { fontSize:14, color:"#6b7280", fontStyle:"italic" },

  // Paste exposures
  pasteItem: {
    backgroundColor: "#fff", borderRadius: 10,
    padding: 12, marginTop: 8,
    flexDirection: "row", justifyContent: "space-between",
    shadowColor: "#000", shadowOpacity: 0.04, elevation: 1,
  },
  pasteSource: { fontSize: 14, fontWeight: "600" },
  pasteDate: { fontSize: 12, color: "#6b7280" },
});