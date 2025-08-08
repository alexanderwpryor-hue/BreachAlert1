// theme.js
export const colors = {
  bg:      "#0b1020",
  surface: "#121829",
  border:  "#1f2942",
  text:    "#e5e7eb",
  subtext: "#94a3b8",
  danger:  "#ef4444",
  warn:    "#f59e0b",
  success: "#22c55e",
  primary: "#6d6cff",     // brand button
  primaryAlt: "#8b5cf6",  // accent for tints
  chip:    "#1b2440",
};

export const radius = 12;

export const shadow = {
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
};

// Helpful shared styles
export const base = {
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  h1: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 14,
  },
  label: {
    color: colors.subtext,
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#0f1528",
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.text,
    padding: 14,
    borderRadius: radius,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius + 4,
    padding: 16,
  },
};
