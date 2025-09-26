import { Tabs } from "expo-router";
import React from "react";
import { IconSymbol } from "../../components/ui/icon-symbol";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fff", borderTopWidth: 0, height: 70, paddingBottom: 10 },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: "#00A652",   // active label color
        tabBarInactiveTintColor: "#999",    // inactive label color
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused, color }) => <IconSymbol name="house.fill" color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: "Patients",
          tabBarIcon: ({ focused, color }) => <IconSymbol name="person.3.fill" color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ focused, color }) => <IconSymbol name="calendar.badge.checkmark" color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => <IconSymbol name="person.crop.circle" color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
