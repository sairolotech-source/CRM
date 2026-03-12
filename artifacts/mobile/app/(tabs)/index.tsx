import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const QUICK_ACTIONS = [
  {
    id: "catalog",
    label: "Machine\nCatalog",
    icon: "package" as const,
    route: "/catalog",
    color: "#1A56DB",
    bg: "#EFF6FF",
    darkBg: "#1E3A5F",
  },
  {
    id: "service",
    label: "Service\nRequest",
    icon: "tool" as const,
    route: "/service-request",
    color: "#10B981",
    bg: "#ECFDF5",
    darkBg: "#064E3B",
  },
  {
    id: "quotation",
    label: "Get\nQuote",
    icon: "file-text" as const,
    route: "/quotation",
    color: "#F59E0B",
    bg: "#FFFBEB",
    darkBg: "#451A03",
  },
  {
    id: "amc",
    label: "AMC\nPlans",
    icon: "shield" as const,
    route: "/amc",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    darkBg: "#2E1065",
  },
  {
    id: "support",
    label: "Support\nTicket",
    icon: "message-circle" as const,
    route: "/support-ticket",
    color: "#EF4444",
    bg: "#FEF2F2",
    darkBg: "#450A0A",
  },
  {
    id: "tools",
    label: "Business\nTools",
    icon: "bar-chart-2" as const,
    route: "/tools",
    color: "#0EA5E9",
    bg: "#F0F9FF",
    darkBg: "#0C2D48",
  },
];

const FEATURES = [
  {
    id: "1",
    title: "Machine Catalog",
    subtitle: "Browse 50+ roll forming machines",
    icon: "package",
    color: "#1A56DB",
  },
  {
    id: "2",
    title: "Service Requests",
    subtitle: "Schedule maintenance & repairs",
    icon: "tool",
    color: "#10B981",
  },
  {
    id: "3",
    title: "AMC Plans",
    subtitle: "Annual maintenance contracts",
    icon: "shield",
    color: "#8B5CF6",
  },
  {
    id: "4",
    title: "Quotations",
    subtitle: "Get instant machine quotes",
    icon: "file-text",
    color: "#F59E0B",
  },
];

type StatCardProps = {
  value: string;
  label: string;
  icon: string;
  color: string;
  isDark: boolean;
};

function StatCard({ value, label, icon, color, isDark }: StatCardProps) {
  const colors = isDark ? Colors.dark : Colors.light;
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: color + "18" }]}>
        <Feather name={icon as any} size={18} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
        {label}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const handleAction = useCallback(
    (route: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(route as any);
    },
    []
  );

  const handleWhatsApp = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL("https://wa.me/919876543210");
  }, []);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: "#0F172A",
            paddingTop: topInset + 16,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.headerGreeting, { fontFamily: "Inter_400Regular" }]}>
              Welcome to
            </Text>
            <Text style={[styles.headerTitle, { fontFamily: "Inter_700Bold" }]}>
              Sai Rolotech
            </Text>
            <Text style={[styles.headerSubtitle, { fontFamily: "Inter_400Regular" }]}>
              Industrial Roll Forming Solutions
            </Text>
          </View>
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={handleWhatsApp}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-whatsapp" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { value: "50+", label: "Machines" },
            { value: "500+", label: "Clients" },
            { value: "15+", label: "Years" },
          ].map((stat) => (
            <View key={stat.label} style={styles.headerStat}>
              <Text style={[styles.headerStatValue, { fontFamily: "Inter_700Bold" }]}>
                {stat.value}
              </Text>
              <Text style={[styles.headerStatLabel, { fontFamily: "Inter_400Regular" }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionCard,
                {
                  backgroundColor: isDark ? action.darkBg : action.bg,
                  borderColor: action.color + "30",
                },
              ]}
              onPress={() => handleAction(action.route)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.actionIconWrap,
                  { backgroundColor: action.color + "20" },
                ]}
              >
                <Feather name={action.icon} size={22} color={action.color} />
              </View>
              <Text
                style={[
                  styles.actionLabel,
                  { color: colors.text, fontFamily: "Inter_500Medium" },
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          Overview
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScroll}
        >
          <StatCard value="50+" label="Machines" icon="package" color="#1A56DB" isDark={isDark} />
          <StatCard value="500+" label="Happy Clients" icon="users" color="#10B981" isDark={isDark} />
          <StatCard value="15+" label="Years" icon="award" color="#F59E0B" isDark={isDark} />
          <StatCard value="24/7" label="Support" icon="headphones" color="#8B5CF6" isDark={isDark} />
        </ScrollView>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          What We Offer
        </Text>
        {FEATURES.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleAction(`/${feature.id === "1" ? "catalog" : feature.id === "2" ? "services" : feature.id === "3" ? "amc" : "quotation"}`)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: feature.color + "18" },
              ]}
            >
              <Feather name={feature.icon as any} size={22} color={feature.color} />
            </View>
            <View style={styles.featureText}>
              <Text
                style={[
                  styles.featureTitle,
                  { color: colors.text, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                {feature.title}
              </Text>
              <Text
                style={[
                  styles.featureSubtitle,
                  { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
                ]}
              >
                {feature.subtitle}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact CTA */}
      <View style={[styles.section, { paddingBottom: 8 }]}>
        <View
          style={[
            styles.ctaBanner,
            { backgroundColor: "#1A56DB" },
          ]}
        >
          <View>
            <Text style={[styles.ctaTitle, { fontFamily: "Inter_700Bold" }]}>
              Need a Custom Machine?
            </Text>
            <Text style={[styles.ctaSubtitle, { fontFamily: "Inter_400Regular" }]}>
              Talk to our experts today
            </Text>
          </View>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={handleWhatsApp}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
            <Text style={[styles.ctaBtnText, { fontFamily: "Inter_600SemiBold" }]}>
              Chat Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerGreeting: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },
  whatsappBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  headerStat: {
    flex: 1,
    alignItems: "center",
  },
  headerStatValue: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  headerStatLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 14,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: "30%",
    flexGrow: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "flex-start",
    gap: 10,
    minWidth: 100,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 12,
    lineHeight: 17,
  },
  statsScroll: {
    gap: 12,
    paddingRight: 20,
  },
  statCard: {
    width: 120,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
  },
  statLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
    gap: 3,
  },
  featureTitle: {
    fontSize: 15,
  },
  featureSubtitle: {
    fontSize: 13,
  },
  ctaBanner: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  ctaBtnText: {
    color: "#0F172A",
    fontSize: 13,
  },
});
