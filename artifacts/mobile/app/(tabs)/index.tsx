import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  FadeInDown,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import AnimatedPressable from "@/components/AnimatedPressable";
import { HomeSkeleton } from "@/components/Skeleton";
import { CARD_SHADOW, CARD_SHADOW_LG, CARD_SHADOW_XL, shadowGlow, BUTTON_SHADOW, ICON_SHADOW } from "@/constants/shadows";
import { BANNER_ADS } from "@/data/community";

const { width: SCREEN_W } = Dimensions.get("window");

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const QUICK_ACTIONS = [
  { id: "ai-buddy", label: "AI Sales\nBuddy", icon: "cpu" as const, route: "/ai-sales-buddy", color: "#059669", gradient: ["#059669", "#10B981"] },
  { id: "catalog", label: "Machine\nCatalog", icon: "package" as const, route: "/catalog", color: "#1A56DB", gradient: ["#1A56DB", "#3B82F6"] },
  { id: "leads", label: "Lead\nDashboard", icon: "trending-up" as const, route: "/leads", color: "#EF4444", gradient: ["#DC2626", "#EF4444"] },
  { id: "quotation", label: "Get\nQuote", icon: "file-text" as const, route: "/quotation", color: "#F59E0B", gradient: ["#D97706", "#F59E0B"] },
  { id: "spare-parts", label: "Spare\nParts", icon: "box" as const, route: "/spare-parts", color: "#0EA5E9", gradient: ["#0284C7", "#0EA5E9"] },
  { id: "troubleshoot", label: "Problem\nFinder", icon: "alert-circle" as const, route: "/ai-troubleshooter", color: "#8B5CF6", gradient: ["#7C3AED", "#8B5CF6"] },
  { id: "community", label: "Community\nFeed", icon: "users" as const, route: "/community", color: "#EC4899", gradient: ["#DB2777", "#EC4899"] },
  { id: "service", label: "Service\nRequest", icon: "tool" as const, route: "/service-request", color: "#10B981", gradient: ["#059669", "#10B981"] },
  { id: "tools", label: "Business\nTools", icon: "bar-chart-2" as const, route: "/tools", color: "#0EA5E9", gradient: ["#0284C7", "#0EA5E9"] },
] as const;

const STAT_CARDS = [
  { value: "50+", label: "Machines", icon: "package", color: "#1A56DB", gradient: ["#1E40AF", "#3B82F6"] },
  { value: "500+", label: "Happy Clients", icon: "users", color: "#10B981", gradient: ["#047857", "#34D399"] },
  { value: "15+", label: "Years", icon: "award", color: "#F59E0B", gradient: ["#B45309", "#FBBF24"] },
  { value: "24/7", label: "Support", icon: "headphones", color: "#8B5CF6", gradient: ["#6D28D9", "#A78BFA"] },
] as const;

const FEATURES = [
  { id: "1", title: "Machine Catalog", subtitle: "Browse 50+ roll forming machines", icon: "package", color: "#1A56DB", gradient: ["#1A56DB", "#3B82F6"], target: "catalog" },
  { id: "2", title: "Service Requests", subtitle: "Schedule maintenance & repairs", icon: "tool", color: "#10B981", gradient: ["#059669", "#10B981"], target: "services" },
  { id: "3", title: "AMC Plans", subtitle: "Annual maintenance contracts", icon: "shield", color: "#8B5CF6", gradient: ["#7C3AED", "#8B5CF6"], target: "amc" },
  { id: "4", title: "Quotations", subtitle: "Get instant machine quotes", icon: "file-text", color: "#F59E0B", gradient: ["#D97706", "#F59E0B"], target: "quotation" },
] as const;

const StatCard = React.memo(function StatCard({
  value, label, icon, gradient, cardBg, borderColor, textColor, subColor,
}: {
  value: string; label: string; icon: string; gradient: readonly string[];
  cardBg: string; borderColor: string; textColor: string; subColor: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: cardBg, borderColor }, CARD_SHADOW]}>
      <LinearGradient colors={[...gradient]} style={styles.statIconWrap} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Feather name={icon as any} size={18} color="#fff" />
      </LinearGradient>
      <Text style={[styles.statValue, { color: textColor, fontFamily: "Inter_700Bold" }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: subColor, fontFamily: "Inter_400Regular" }]}>{label}</Text>
    </View>
  );
});

export default function HomeScreen() {
  const { isDark, colors, topInset, bottomInset } = useTheme();
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 100], [0, -15], Extrapolation.CLAMP);
    const scale = interpolate(scrollY.value, [0, 100], [1, 0.98], Extrapolation.CLAMP);
    return { transform: [{ translateY }, { scale }] };
  });

  const handleAction = useCallback((route: string) => {
    router.push(route as any);
  }, []);

  const handleWhatsApp = useCallback(() => {
    const { Linking } = require("react-native");
    Linking.openURL("https://wa.me/919876543210");
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const contentPadding = useMemo(() => ({ paddingBottom: bottomInset + 20 }), [bottomInset]);

  if (!ready) return <HomeSkeleton />;

  return (
    <AnimatedScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={contentPadding}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />}
    >
      <Animated.View style={headerAnimStyle}>
        <LinearGradient colors={["#0F172A", "#1E293B", "#0F172A"]} style={[styles.header, { paddingTop: topInset + 16 }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.headerGreeting, { fontFamily: "Inter_400Regular" }]}>Welcome to</Text>
              <Text style={[styles.headerTitle, { fontFamily: "Inter_700Bold" }]}>Sai Rolotech</Text>
              <Text style={[styles.headerSubtitle, { fontFamily: "Inter_400Regular" }]}>Industrial Roll Forming Solutions</Text>
            </View>
            <AnimatedPressable onPress={handleWhatsApp} scaleDown={0.9}>
              <LinearGradient colors={["#25D366", "#128C7E"]} style={styles.whatsappBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Ionicons name="logo-whatsapp" size={22} color="#fff" />
              </LinearGradient>
            </AnimatedPressable>
          </View>
          <View style={styles.statsRow}>
            {[
              { value: "50+", label: "Machines" },
              { value: "500+", label: "Clients" },
              { value: "15+", label: "Years" },
            ].map((stat) => (
              <View key={stat.label} style={styles.headerStat}>
                <Text style={[styles.headerStatValue, { fontFamily: "Inter_700Bold" }]}>{stat.value}</Text>
                <Text style={[styles.headerStatLabel, { fontFamily: "Inter_400Regular" }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.bannerAdSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SCREEN_W - 24}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {BANNER_ADS.map((item) => (
            <AnimatedPressable
              key={item.id}
              style={[styles.homeBanner, CARD_SHADOW]}
              scaleDown={0.97}
              onPress={() => router.push("/community" as any)}
            >
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.homeBannerGradient}
              >
                <View style={styles.homeBannerLeft}>
                  <View style={styles.homeBannerPremium}>
                    <Feather name="award" size={8} color="#F59E0B" />
                    <Text style={styles.homeBannerPremiumText}>PREMIUM SUPPLIER</Text>
                  </View>
                  <Text style={styles.homeBannerProduct}>{item.productName}</Text>
                  <Text style={styles.homeBannerSupplier}>{item.supplierName}</Text>
                </View>
                <View style={styles.homeBannerCta}>
                  <Feather name="arrow-right" size={16} color="#fff" />
                </View>
              </LinearGradient>
            </AnimatedPressable>
          ))}
        </ScrollView>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <AnimatedPressable
              key={action.id}
              onPress={() => handleAction(action.route)}
              style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}
              scaleDown={0.94}
            >
              <LinearGradient colors={[...action.gradient]} style={styles.actionIconWrap} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Feather name={action.icon} size={20} color="#fff" />
              </LinearGradient>
              <Text style={[styles.actionLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>{action.label}</Text>
            </AnimatedPressable>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
          {STAT_CARDS.map((s) => (
            <StatCard key={s.label} value={s.value} label={s.label} icon={s.icon} gradient={s.gradient} cardBg={colors.card} borderColor={colors.border} textColor={colors.text} subColor={colors.textSecondary} />
          ))}
        </ScrollView>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>What We Offer</Text>
        {FEATURES.map((feature) => (
          <AnimatedPressable
            key={feature.id}
            onPress={() => handleAction(`/${feature.target}`)}
            style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}
            scaleDown={0.98}
          >
            <LinearGradient colors={[...feature.gradient]} style={styles.featureIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Feather name={feature.icon as any} size={22} color="#fff" />
            </LinearGradient>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>{feature.title}</Text>
              <Text style={[styles.featureSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{feature.subtitle}</Text>
            </View>
            <View style={[styles.featureArrow, { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }]}>
              <Feather name="chevron-right" size={16} color={colors.textMuted} />
            </View>
          </AnimatedPressable>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(400)} style={[styles.section, { paddingBottom: 8 }]}>
        <AnimatedPressable onPress={handleWhatsApp} scaleDown={0.98}>
          <LinearGradient colors={["#1A56DB", "#2563EB", "#3B82F6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.ctaBanner, CARD_SHADOW_XL]}>
            <View>
              <Text style={[styles.ctaTitle, { fontFamily: "Inter_700Bold" }]}>Need a Custom Machine?</Text>
              <Text style={[styles.ctaSubtitle, { fontFamily: "Inter_400Regular" }]}>Talk to our experts today</Text>
            </View>
            <View style={styles.ctaBtn}>
              <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
              <Text style={[styles.ctaBtnText, { fontFamily: "Inter_600SemiBold" }]}>Chat Now</Text>
            </View>
          </LinearGradient>
        </AnimatedPressable>
      </Animated.View>
    </AnimatedScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  headerGreeting: { fontSize: 13, color: "#94A3B8", marginBottom: 2 },
  headerTitle: { fontSize: 28, color: "#FFFFFF", marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: "#64748B" },
  whatsappBtn: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 16, gap: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  headerStat: { flex: 1, alignItems: "center" },
  headerStatValue: { fontSize: 20, color: "#FFFFFF", marginBottom: 2 },
  headerStatLabel: { fontSize: 12, color: "#94A3B8" },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, marginBottom: 14 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  actionCard: { width: "30%", flexGrow: 1, borderRadius: 16, borderWidth: 1, padding: 14, alignItems: "flex-start", gap: 10, minWidth: 100 },
  actionIconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 12, lineHeight: 17 },
  statsScroll: { gap: 12, paddingRight: 20 },
  statCard: { width: 125, borderRadius: 16, borderWidth: 1, padding: 14, alignItems: "center", gap: 6 },
  statIconWrap: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  statValue: { fontSize: 22 },
  statLabel: { fontSize: 11, textAlign: "center" },
  featureCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 10, gap: 14 },
  featureIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  featureText: { flex: 1, gap: 3 },
  featureTitle: { fontSize: 15 },
  featureSubtitle: { fontSize: 13 },
  featureArrow: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  ctaBanner: { borderRadius: 20, padding: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ctaTitle: { fontSize: 16, color: "#fff", marginBottom: 4 },
  ctaSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  ctaBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 },
  ctaBtnText: { color: "#0F172A", fontSize: 13 },
  bannerAdSection: { paddingTop: 16 },
  homeBanner: { width: SCREEN_W - 56, marginRight: 12, borderRadius: 16, overflow: "hidden" },
  homeBannerGradient: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 16 },
  homeBannerLeft: { flex: 1 },
  homeBannerPremium: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.2)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: "flex-start", marginBottom: 6 },
  homeBannerPremiumText: { fontSize: 8, fontWeight: "800", color: "#FDE68A", letterSpacing: 0.5 },
  homeBannerProduct: { fontSize: 16, fontWeight: "800", color: "#fff" },
  homeBannerSupplier: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  homeBannerCta: { width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
});
