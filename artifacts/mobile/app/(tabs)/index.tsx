import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";

const QUICK_ACTIONS = [
  { id: "catalog", label: "Machine\nCatalog", icon: "package" as const, route: "/catalog", color: "#1A56DB", bg: "#EFF6FF", darkBg: "#1E3A5F" },
  { id: "service", label: "Service\nRequest", icon: "tool" as const, route: "/service-request", color: "#10B981", bg: "#ECFDF5", darkBg: "#064E3B" },
  { id: "quotation", label: "Get\nQuote", icon: "file-text" as const, route: "/quotation", color: "#F59E0B", bg: "#FFFBEB", darkBg: "#451A03" },
  { id: "amc", label: "AMC\nPlans", icon: "shield" as const, route: "/amc", color: "#8B5CF6", bg: "#F5F3FF", darkBg: "#2E1065" },
  { id: "support", label: "Support\nTicket", icon: "message-circle" as const, route: "/support-ticket", color: "#EF4444", bg: "#FEF2F2", darkBg: "#450A0A" },
  { id: "tools", label: "Business\nTools", icon: "bar-chart-2" as const, route: "/tools", color: "#0EA5E9", bg: "#F0F9FF", darkBg: "#0C2D48" },
] as const;

const HEADER_STATS = [
  { value: "50+", label: "Machines" },
  { value: "500+", label: "Clients" },
  { value: "15+", label: "Years" },
] as const;

const STAT_CARDS = [
  { value: "50+", label: "Machines", icon: "package", color: "#1A56DB" },
  { value: "500+", label: "Happy Clients", icon: "users", color: "#10B981" },
  { value: "15+", label: "Years", icon: "award", color: "#F59E0B" },
  { value: "24/7", label: "Support", icon: "headphones", color: "#8B5CF6" },
] as const;

const FEATURES = [
  { id: "1", title: "Machine Catalog", subtitle: "Browse 50+ roll forming machines", icon: "package", color: "#1A56DB", target: "catalog" },
  { id: "2", title: "Service Requests", subtitle: "Schedule maintenance & repairs", icon: "tool", color: "#10B981", target: "services" },
  { id: "3", title: "AMC Plans", subtitle: "Annual maintenance contracts", icon: "shield", color: "#8B5CF6", target: "amc" },
  { id: "4", title: "Quotations", subtitle: "Get instant machine quotes", icon: "file-text", color: "#F59E0B", target: "quotation" },
] as const;

const StatCard = React.memo(function StatCard({
  value, label, icon, color, cardBg, borderColor, textColor, subColor,
}: {
  value: string; label: string; icon: string; color: string;
  cardBg: string; borderColor: string; textColor: string; subColor: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: cardBg, borderColor }]}>
      <View style={[styles.statIcon, { backgroundColor: color + "18" }]}>
        <Feather name={icon as any} size={18} color={color} />
      </View>
      <Text style={[styles.statValue, { color: textColor, fontFamily: "Inter_700Bold" }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: subColor, fontFamily: "Inter_400Regular" }]}>{label}</Text>
    </View>
  );
});

const ActionCard = React.memo(function ActionCard({
  action, isDark, textColor, onPress,
}: {
  action: typeof QUICK_ACTIONS[number]; isDark: boolean; textColor: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionCard, { backgroundColor: isDark ? action.darkBg : action.bg, borderColor: action.color + "30" }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.actionIconWrap, { backgroundColor: action.color + "20" }]}>
        <Feather name={action.icon} size={22} color={action.color} />
      </View>
      <Text style={[styles.actionLabel, { color: textColor, fontFamily: "Inter_500Medium" }]}>{action.label}</Text>
    </TouchableOpacity>
  );
});

const FeatureCard = React.memo(function FeatureCard({
  feature, cardBg, borderColor, textColor, subColor, mutedColor, onPress,
}: {
  feature: typeof FEATURES[number];
  cardBg: string; borderColor: string; textColor: string; subColor: string; mutedColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.featureIcon, { backgroundColor: feature.color + "18" }]}>
        <Feather name={feature.icon as any} size={22} color={feature.color} />
      </View>
      <View style={styles.featureText}>
        <Text style={[styles.featureTitle, { color: textColor, fontFamily: "Inter_600SemiBold" }]}>{feature.title}</Text>
        <Text style={[styles.featureSubtitle, { color: subColor, fontFamily: "Inter_400Regular" }]}>{feature.subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={mutedColor} />
    </TouchableOpacity>
  );
});

export default function HomeScreen() {
  const { isDark, colors, topInset, bottomInset } = useTheme();

  const handleAction = useCallback((route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  }, []);

  const handleWhatsApp = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL("https://wa.me/919876543210");
  }, []);

  const contentPadding = useMemo(() => ({ paddingBottom: bottomInset + 20 }), [bottomInset]);

  return (
    <ScrollView style={[styles.flex, { backgroundColor: colors.background }]} contentContainerStyle={contentPadding} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.headerGreeting, { fontFamily: "Inter_400Regular" }]}>Welcome to</Text>
            <Text style={[styles.headerTitle, { fontFamily: "Inter_700Bold" }]}>Sai Rolotech</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: "Inter_400Regular" }]}>Industrial Roll Forming Solutions</Text>
          </View>
          <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.8}>
            <Ionicons name="logo-whatsapp" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          {HEADER_STATS.map((stat) => (
            <View key={stat.label} style={styles.headerStat}>
              <Text style={[styles.headerStatValue, { fontFamily: "Inter_700Bold" }]}>{stat.value}</Text>
              <Text style={[styles.headerStatLabel, { fontFamily: "Inter_400Regular" }]}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <ActionCard key={action.id} action={action} isDark={isDark} textColor={colors.text} onPress={() => handleAction(action.route)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
          {STAT_CARDS.map((s) => (
            <StatCard key={s.label} value={s.value} label={s.label} icon={s.icon} color={s.color} cardBg={colors.card} borderColor={colors.border} textColor={colors.text} subColor={colors.textSecondary} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>What We Offer</Text>
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} cardBg={colors.card} borderColor={colors.border} textColor={colors.text} subColor={colors.textSecondary} mutedColor={colors.textMuted} onPress={() => handleAction(`/${feature.target}`)} />
        ))}
      </View>

      <View style={[styles.section, { paddingBottom: 8 }]}>
        <View style={styles.ctaBanner}>
          <View>
            <Text style={[styles.ctaTitle, { fontFamily: "Inter_700Bold" }]}>Need a Custom Machine?</Text>
            <Text style={[styles.ctaSubtitle, { fontFamily: "Inter_400Regular" }]}>Talk to our experts today</Text>
          </View>
          <TouchableOpacity style={styles.ctaBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
            <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
            <Text style={[styles.ctaBtnText, { fontFamily: "Inter_600SemiBold" }]}>Chat Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24, backgroundColor: "#0F172A" },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  headerGreeting: { fontSize: 13, color: "#94A3B8", marginBottom: 2 },
  headerTitle: { fontSize: 28, color: "#FFFFFF", marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: "#64748B" },
  whatsappBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#25D366", alignItems: "center", justifyContent: "center", marginTop: 4 },
  statsRow: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 16, gap: 8 },
  headerStat: { flex: 1, alignItems: "center" },
  headerStatValue: { fontSize: 20, color: "#FFFFFF", marginBottom: 2 },
  headerStatLabel: { fontSize: 12, color: "#94A3B8" },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, marginBottom: 14 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  actionCard: { width: "30%", flexGrow: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "flex-start", gap: 10, minWidth: 100 },
  actionIconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 12, lineHeight: 17 },
  statsScroll: { gap: 12, paddingRight: 20 },
  statCard: { width: 120, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "center", gap: 6 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  statValue: { fontSize: 22 },
  statLabel: { fontSize: 11, textAlign: "center" },
  featureCard: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 10, gap: 14 },
  featureIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  featureText: { flex: 1, gap: 3 },
  featureTitle: { fontSize: 15 },
  featureSubtitle: { fontSize: 13 },
  ctaBanner: { borderRadius: 16, padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1A56DB" },
  ctaTitle: { fontSize: 16, color: "#fff", marginBottom: 4 },
  ctaSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  ctaBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9 },
  ctaBtnText: { color: "#0F172A", fontSize: 13 },
});
