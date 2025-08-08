import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, TouchableOpacity, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Purchases from "react-native-purchases";

import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";   // ← NEW
import ResetPassword from "./ResetPassword";     // ← NEW
import Dashboard from "./Dashboard";
import ChildDetail from "./ChildDetail";
import AddChild from "./AddChild";
import PaywallScreen from "./PaywallScreen";
import RequireSubscription from "./RequireSubscription";

import { loadToken, getToken, clearToken } from "./api";

const Stack = createNativeStackNavigator();

// Deep linking (breachalert://reset?token=XXXX)
const linking = {
  prefixes: ["breachalert://"],
  config: {
    screens: { ResetPassword: "reset" },
  },
};

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {

    Purchases.configure({ apiKey: "goog_iHaRbPykbjERZfypFuHFKHnhGjP" });

    (async () => {
      try {
        await loadToken();                    // ← just call it
        const token = await getToken();
        if (token) setAuthenticated(true);
      } catch (e) {
        console.error("Error loading token", e);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const handleLoginSuccess = () => setAuthenticated(true);

  const handleLogout = async () => {
    try { await clearToken(); } catch (e) { console.error(e); }
    setAuthenticated(false);
  };

  if (checking) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          {!authenticated ? (
            <>
              <Stack.Screen name="Login" options={{ headerShown: false }}>
                {(props) => <Login {...props} onLoginSuccess={handleLoginSuccess} />}
              </Stack.Screen>
              <Stack.Screen
                name="Register"
                options={{ title: "Create Account" }}
                children={(props) => <Register {...props} onRegistered={handleLoginSuccess} />}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ResetPassword"
                component={ResetPassword}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                  title: "BreachAlert",
                  headerRight: () => (
                    <TouchableOpacity onPress={handleLogout} style={{ padding: 8 }}>
                      <Text style={{ color: "#1f6feb", fontWeight: "600" }}>Logout</Text>
                    </TouchableOpacity>
                  ),
                }}
              />
              <Stack.Screen
                name="Paywall"
                component={PaywallScreen}
                options={{ title: "Subscribe to Continue" }}
              />
              <Stack.Screen
                name="ChildDetail"
                options={({ route }) => ({
                  title: route?.params?.child?.name
                    ? `Details for ${route.params.child.name}`
                    : "Details",
                })}
              >
                {(props) => (
                  <RequireSubscription {...props}>
                    <ChildDetail {...props} />
                  </RequireSubscription>
                )}
              </Stack.Screen>
              <Stack.Screen name="AddChild" component={AddChild} options={{ title: "Add New Child" }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}