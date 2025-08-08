// Dashboard.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { fetchChildren, fetchInfoWidgets, deleteChild } from "./api";
import { colors, base, radius, shadow } from "./theme";
import { PrimaryButton, Pill, ScoreCircle } from "./ui";

const StatusBadge = ({ breached }) => (
  <Pill text={breached ? "Breached" : "Safe"} tone={breached ? "danger" : "success"} />
);

const InfoWidget = ({ title, body, variant, icon, source_name }) => {
  const tone = variant === "warning" ? "warn" : "neutral";
  return (
    <View
      style={[
        styles.widget,
        { borderColor: tone === "warn" ? colors.warn : colors.border,
          backgroundColor: tone === "warn" ? "#1f1a09" : colors.surface },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ fontSize: 20, marginRight: 8 }}>{icon || "🛡️"}</Text>
        <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16, flex: 1 }}>
          {title}
        </Text>
      </View>
      <Text style={{ color: colors.text, opacity: 0.85, marginBottom: 8 }}>{body}</Text>
      <Text style={{ color: colors.subtext, fontSize: 12 }}>
        Source: <Text style={{ color: colors.primary, textDecorationLine: "underline" }}>{source_name}</Text>
      </Text>
    </View>
  );
};

export default function Dashboard({ navigation }) {
  const [children, setChildren] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const [ch, w] = await Promise.all([fetchChildren(), fetchInfoWidgets()]);
      setChildren(ch);
      setWidgets(w);
    } catch (e) {
      const msg =
        e.response?.data ? JSON.stringify(e.response.data) : e.message || "Unknown error";
      Alert.alert("Error", msg);
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = (child) => {
    Alert.alert("Confirm delete", `Remove ${child.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteChild(child.id);
            await loadData(true);
          } catch (e) {
            const msg =
              e.response?.data ? JSON.stringify(e.response.data) : e.message || "Failed";
            Alert.alert("Error", msg);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={[base.screen, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={base.screen}>
      <FlatList
        data={children}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={base.container}
        refreshing={refreshing}
        onRefresh={() => loadData(true)}
        ListHeaderComponent={
          <>
            <Text style={base.h1}>Family Overview</Text>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("ChildDetail", { child: item })}
          >
            <View style={[base.card, shadow, { marginBottom: 14 }]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ScoreCircle score={item.safety_score} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: colors.subtext, fontSize: 12 }}>
                    {item.email} {item.username ? ` • @${item.username}` : ""}
                  </Text>
                </View>
                <StatusBadge breached={item.breached} />
              </View>

              <View style={{ marginTop: 10 }}>
                <Text style={{ color: colors.text, opacity: 0.9 }}>
                  {item.breach_summary || "No breaches found."}
                </Text>
                <Text style={{ color: colors.subtext, marginTop: 4, fontSize: 12 }}>
                  Checked:{" "}
                  {item.last_checked ? new Date(item.last_checked).toLocaleString() : "N/A"}
                </Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 12 }}>
                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  style={{
                    backgroundColor: "#1b1f33",
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: radius,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ color: colors.danger, fontWeight: "800" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <>
            <Text style={[base.h1, { marginTop: 6 }]}>Cyber News</Text>
            {widgets.map((w, i) => (
              <InfoWidget key={i} {...w} />
            ))}

            <PrimaryButton
              title="Add New Child"
              onPress={() => navigation.navigate("AddChild", { onAdded: () => loadData(true) })}
              style={{ marginTop: 18 }}
            />
            <View style={{ height: 20 }} />
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  widget: {
    borderWidth: 1,
    borderRadius: radius + 2,
    padding: 14,
    marginBottom: 12,
  },
});
