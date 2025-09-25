import { Tabs, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AuthContext } from '../AuthProvider';

// Import your components correctly (static import)
import { HapticTab } from '../../components/haptic-tab';
import { IconSymbol } from '../../components/ui/icon-symbol';

const TABS = ['dashboard', 'patients', 'attendance', 'profile'];
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TabsLayout() {
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useSharedValue(0);
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const tabWidth = SCREEN_WIDTH / TABS.length;
    translateX.value = withTiming(activeIndex * tabWidth, { duration: 300 });
  }, [activeIndex, translateX]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
  }, [isLoggedIn,router]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, height: 70, paddingBottom: 10 },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarBackground: () => <Animated.View style={[styles.activePill, pillStyle]} />,
        tabBarButton: (props) => {
          const index = TABS.indexOf(props.accessibilityLabel!);
          return <HapticTab {...props} onPress={(e) => { props.onPress?.(e); setActiveIndex(index); }} />;
        },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: ({ focused }) => <IconSymbol name="house.fill" color={focused ? '#00A652' : '#999'} size={28} /> }} />
      <Tabs.Screen name="patients" options={{ title: 'Patients', tabBarIcon: ({ focused }) => <IconSymbol name="person.3.fill" color={focused ? '#00A652' : '#999'} size={28} /> }} />
      <Tabs.Screen name="attendance" options={{ title: 'Attendance', tabBarIcon: ({ focused }) => <IconSymbol name="calendar.badge.checkmark" color={focused ? '#00A652' : '#999'} size={28} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ focused }) => <IconSymbol name="person.crop.circle" color={focused ? '#00A652' : '#999'} size={28} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activePill: { position: 'absolute', bottom: 10, left: 0, width: SCREEN_WIDTH / TABS.length, height: 40, borderRadius: 20, backgroundColor: '#00A652' },
});
