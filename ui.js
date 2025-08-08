// ui.js
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { colors, radius, shadow } from "./theme";

export function PrimaryButton({ title, onPress, disabled, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: colors.primary,
          paddingVertical: 14,
          borderRadius: radius + 4,
          alignItems: "center",
          opacity: disabled ? 0.6 : 1,
        },
        shadow,
        style,
      ]}
    >
      <Text
        style={{ color: "white", fontWeight: "800", fontSize: 16, letterSpacing: 0.3 }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function Pill({ text, tone = "neutral", style }) {
  const map = {
    neutral: colors.chip,
    danger: colors.danger,
    success: colors.success,
    warn: colors.warn,
  };
  const bg = tone === "neutral" ? map[tone] : "transparent";
  const border = tone === "neutral" ? "transparent" : map[tone];
  const color = tone === "neutral" ? colors.text : map[tone];

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 999,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <Text style={{ color, fontWeight: "700", fontSize: 12 }}>{text}</Text>
    </View>
  );
}

export function ScoreCircle({ score }) {
  // same visual language as web (54 / 742 etc)
  const color =
    score >= 800 ? colors.success : score >= 500 ? colors.warn : colors.danger;

  return (
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 4,
        borderColor: color,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f1528",
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "800" }}>{score}</Text>
    </View>
  );
}
