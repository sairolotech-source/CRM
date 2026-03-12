import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { Platform, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

const TAB_GRADIENTS: Record<string, [string, string]> = {
  Home: ["#1E40AF", "#3B82F6"],
  Catalog: ["#059669", "#10B981"],
  Services: ["#D97706", "#F59E0B"],
  Tools: ["#7C3AED", "#8B5CF6"],
  Profile: ["#DC2626", "#EF4444"],
};

const TAB_ACTIVE_COLORS: Record<string, string> = {
  Home: "#3B82F6",
  Catalog: "#10B981",
  Services: "#F59E0B",
  Tools: "#8B5CF6",
  Profile: "#EF4444",
};

function GradientTabIcon({
  name,
  title,
  focused,
  size = 24,
  IconComponent = Feather as any,
}: {
  name: string;
  title: string;
  focused: boolean;
  size?: number;
  IconComponent?: any;
}) {
  const gradient = TAB_GRADIENTS[title] || TAB_GRADIENTS.Home;
  const activeColor = TAB_ACTIVE_COLORS[title] || "#3B82F6";

  if (!focused) {
    return <IconComponent name={name} size={size} color="#94A3B8" />;
  }

  return (
    <View style={tabIconStyles.wrapper}>
      <View style={[tabIconStyles.glowDot, { backgroundColor: activeColor }]} />
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={tabIconStyles.gradientBg}
      >
        <IconComponent name={name} size={size - 2} color="#FFFFFF" />
      </LinearGradient>
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  gradientBg: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web"
      ? {
          boxShadow:
            "0px 4px 12px rgba(26,86,219,0.25), 0px 1px 4px rgba(0,0,0,0.1)",
        }
      : {
          shadowColor: "#1A56DB",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }),
  },
  glowDot: {
    position: "absolute",
    top: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 0px 8px rgba(59,130,246,0.6)" }
      : {
          shadowColor: "#3B82F6",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
        }),
  },
});

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="catalog">
        <Icon sf={{ default: "shippingbox", selected: "shippingbox.fill" }} />
        <Label>Catalog</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="services">
        <Icon sf={{ default: "wrench", selected: "wrench.fill" }} />
        <Label>Services</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tools">
        <Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} />
        <Label>Tools</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const safeAreaInsets = useSafeAreaInsets();
  const colors = isDark ? Colors.dark : Colors.light;

  const renderTabBarBackground = useCallback(
    () =>
      isIOS ? (
        <BlurView
          intensity={100}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      ) : isWeb ? (
        <View style={[StyleSheet.absoluteFill, styles.webBarBg]}>
          <View style={styles.topBorderGlow} />
        </View>
      ) : null,
    [isIOS, isWeb, isDark]
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS
            ? "transparent"
            : isDark
              ? "#0F172A"
              : "#FFFFFF",
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: safeAreaInsets.bottom,
          paddingTop: 6,
          ...(isWeb ? { height: 88 } : {}),
          ...(isWeb
            ? {
                boxShadow:
                  "0px -4px 20px rgba(15,23,42,0.08), 0px -1px 4px rgba(15,23,42,0.04)",
              }
            : {
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.08,
                shadowRadius: 20,
              }),
        },
        tabBarBackground: renderTabBarBackground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabLabel,
                { color: focused ? TAB_ACTIVE_COLORS.Home : "#94A3B8" },
              ]}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            isIOS ? (
              <SymbolView
                name={focused ? "house.fill" : "house"}
                tintColor={focused ? TAB_ACTIVE_COLORS.Home : "#94A3B8"}
                size={24}
              />
            ) : (
              <GradientTabIcon
                name="home"
                title="Home"
                focused={focused}
                IconComponent={Feather}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catalog",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabLabel,
                { color: focused ? TAB_ACTIVE_COLORS.Catalog : "#94A3B8" },
              ]}
            >
              Catalog
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            isIOS ? (
              <SymbolView
                name={focused ? "shippingbox.fill" : "shippingbox"}
                tintColor={focused ? TAB_ACTIVE_COLORS.Catalog : "#94A3B8"}
                size={24}
              />
            ) : (
              <GradientTabIcon
                name="package"
                title="Catalog"
                focused={focused}
                IconComponent={Feather}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabLabel,
                { color: focused ? TAB_ACTIVE_COLORS.Services : "#94A3B8" },
              ]}
            >
              Services
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            isIOS ? (
              <SymbolView
                name={focused ? "wrench.fill" : "wrench"}
                tintColor={focused ? TAB_ACTIVE_COLORS.Services : "#94A3B8"}
                size={24}
              />
            ) : (
              <GradientTabIcon
                name="tool"
                title="Services"
                focused={focused}
                IconComponent={Feather}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabLabel,
                { color: focused ? TAB_ACTIVE_COLORS.Tools : "#94A3B8" },
              ]}
            >
              Tools
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            isIOS ? (
              <SymbolView
                name={focused ? "chart.bar.fill" : "chart.bar"}
                tintColor={focused ? TAB_ACTIVE_COLORS.Tools : "#94A3B8"}
                size={24}
              />
            ) : (
              <GradientTabIcon
                name="calculator-outline"
                title="Tools"
                focused={focused}
                IconComponent={Ionicons}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabLabel,
                { color: focused ? TAB_ACTIVE_COLORS.Profile : "#94A3B8" },
              ]}
            >
              Profile
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            isIOS ? (
              <SymbolView
                name={focused ? "person.fill" : "person"}
                tintColor={focused ? TAB_ACTIVE_COLORS.Profile : "#94A3B8"}
                size={24}
              />
            ) : (
              <GradientTabIcon
                name="user"
                title="Profile"
                focused={focused}
                IconComponent={Feather}
              />
            ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  webBarBg: {
    backgroundColor: "#FFFFFF",
  },
  topBorderGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginTop: 4,
  },
});

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
