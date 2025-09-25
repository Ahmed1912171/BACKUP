import { Slot } from "expo-router";
import React, { useContext } from "react";
import AuthProvider, { AuthContext } from "./AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

function AuthGate() {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Slot initialRouteName="index" />; // shows login
  }

  return <Slot initialRouteName="(tabs)/Dashboard" />; // shows tabs
}
