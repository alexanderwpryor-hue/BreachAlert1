// api.js
import axios from "axios";
import { decode as atob } from "base-64";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ───────────────────────────────────────────────────────── CONFIG ─── */

export const API_BASE = __DEV__
  ? "http://10.0.2.2:8015/api/v1"
  : "https://breachalert.org/api/v1";

const TOKEN_KEY   = "cybernest_access_token";
let   accessToken = null;

/* ───────────────────────────────────── TOKEN HELPERS (unchanged) ─── */

export async function loadToken() {
  try {
    const t = await AsyncStorage.getItem(TOKEN_KEY);
    if (t) accessToken = t;
  } catch (err) {
    console.warn("Failed to load token:", err);
  }
}

export async function requestPasswordReset(email) {
  return axios.post(`${API_BASE}/auth/forgot-password`, { email });
}

// Complete the reset with token
export async function resetPassword(token, new_password) {
  return axios.post(`${API_BASE}/auth/reset-password`, {
    token,
    new_password,
  });
}


export function getToken() {
  return accessToken;
}

export async function saveToken(token) {
  accessToken = token;
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.warn("Failed to persist token:", err);
  }
}

export async function clearToken() {
  accessToken = null;
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn("Failed to remove token:", err);
  }
}

/* ────────────────────────────────────────── AXIOS INSTANCE ─── */

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use(cfg => {
  if (accessToken) cfg.headers.Authorization = `Bearer ${accessToken}`;
  return cfg;
});

/* ────────────────────────────────────────── AUTH ─── */

export async function register(email, password) {
  const { data } = await client.post("/auth/register", { email, password });
  return data;
}

export async function login(email, password, remember = false) {
  const { data } = await client.post("/auth/login", { email, password, remember });
  if (!data.access_token) throw new Error("No access token in login response");
  await saveToken(data.access_token);
  return data;
}

export async function resendConfirmation(email) {
  // one “/api/v1” is already in API_BASE, so no double-prefix
  const res = await fetch(`${API_BASE}/auth/resend-confirmation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error((await res.json()).msg || "Resend failed.");
  return res.json();
}

/* ───────────────────────────────────────── SUBSCRIPTIONS ─── */

/**
 * Called once after Purchases.logIn() so the server knows the
 * deterministic RevenueCat App User ID that belongs to this parent.
 */
export async function saveRevenueCatId(rcId) {
  const { data } = await client.post("/me/revenuecat-id", {
    revenuecat_app_user_id: rcId,
  });
  return data;                      // { ok: true }
}

/**
 * Single source of truth — returns true if the parent is active on
 * Stripe OR RevenueCat.  Matches new Flask route in api.py.
 */
export async function getSubscriptionStatus() {
  const { data } = await client.get("/me/subscription");
  return data;                      // { subscription_active: bool }
}

/** Existing Play-Store validator — unchanged */
export async function validateSubscription(purchaseToken) {
  const { data } = await client.post("/subscriptions/validate", { purchaseToken });
  return data;                      // { success: true }
}

/* ───────────────────────────────────────── CHILDREN ─── */

export const fetchChildren    = () => client.get("/children").then(r => r.data);
export const fetchChildDetail = id  => client.get(`/children/${id}`).then(r => r.data);
export const addChild         = body=> client.post("/children", body).then(r => r.data);
export const deleteChild      = id  => client.delete(`/children/${id}`).then(r => r.data);
export const recheckChild     = id  => client.post(`/children/${id}/recheck`).then(r => r.data);

/* ───────────────────────────────────────── INFO WIDGETS ─── */

export const fetchInfoWidgets = () => client.get("/info-widgets").then(r => r.data);

/* ───────────────────────────────────────── HELPERS ─── */

export function getUserIdFromToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return String(payload.sub);
  } catch (e) {
    console.warn("Failed to decode token:", e);
    return null;
  }
}

export default client;
