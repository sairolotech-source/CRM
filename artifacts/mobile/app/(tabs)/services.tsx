import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Linking,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import AnimatedPressable from "@/components/AnimatedPressable";
import { CARD_SHADOW, CARD_SHADOW_LG, CARD_SHADOW_XL, BUTTON_SHADOW } from "@/constants/shadows";

const SERVICES = [
  { id: "service-request", title: "Service Request", subtitle: "Schedule machine maintenance or repair", icon: "tool", color: "#10B981", gradient: ["#059669", "#10B981"], route: "/service-request" },
  { id: "amc", title: "AMC Plans", subtitle: "Annual maintenance contract packages", icon: "shield", color: "#8B5CF6", gradient: ["#7C3AED", "#8B5CF6"], route: "/amc" },
  { id: "quotation", title: "Get Quotation", subtitle: "Request pricing for a new machine", icon: "file-text", color: "#F59E0B", gradient: ["#D97706", "#F59E0B"], route: "/quotation" },
  { id: "support", title: "Support Ticket", subtitle: "Raise a complaint or technical query", icon: "message-circle", color: "#EF4444", gradient: ["#DC2626", "#EF4444"], route: "/support-ticket" },
  { id: "troubleshooter", title: "AI Problem Finder", subtitle: "Describe problem, get instant solutions", icon: "cpu", color: "#DC2626", gradient: ["#DC2626", "#EF4444"], route: "/ai-troubleshooter" },
  { id: "spare-parts", title: "Spare Parts", subtitle: "Find rollers, bearings, blades & more", icon: "box", color: "#0EA5E9", gradient: ["#0284C7", "#0EA5E9"], route: "/spare-parts" },
] as const;

const AMC_PLANS = [
  { id: "basic", name: "Basic AMC", price: "₹15,000/yr", features: ["2 visits/year", "Lubrication & cleaning", "Phone support", "Parts at cost"], color: "#64748B", gradient: ["#475569", "#64748B"], popular: false },
  { id: "standard", name: "Standard AMC", price: "₹28,000/yr", features: ["4 visits/year", "All basic services", "Priority support", "10% parts discount", "Roller check"], color: "#1A56DB", gradient: ["#1E40AF", "#3B82F6"], popular: true },
  { id: "premium", name: "Premium AMC", price: "₹45,000/yr", features: ["8 visits/year", "All standard services", "24/7 support", "20% parts discount", "Free minor parts", "Emergency response"], color: "#8B5CF6", gradient: ["#7C3AED", "#A78BFA"], popular: false },
] as const;

const ServiceCard = React.memo(function ServiceCard({
  service, cardBg, borderColor, textColor, subColor, mutedColor,
}: {
  service: typeof SERVICES[number]; cardBg: string; borderColor: string; textColor: string; subColor: string; mutedColor: string;
}) {
  const handlePress = useCallback(() => {
    router.push(service.route as any);
  }, [service.route]);

  return (
    <AnimatedPressable onPress={handlePress} style={[styles.serviceCard, { backgroundColor: cardBg, borderColor }, CARD_SHADOW]} scaleDown={0.97}>
      <LinearGradient colors={[...service.gradient]} style={styles.serviceIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Feather name={service.icon as any} size={22} color="#fff" />
      </LinearGradient>
      <View style={styles.serviceText}>
        <Text style={[styles.serviceTitle, { color: textColor, fontFamily: "Inter_600SemiBold" }]}>{service.title}</Text>
        <Text style={[styles.serviceSubtitle, { color: subColor, fontFamily: "Inter_400Regular" }]}>{service.subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={mutedColor} />
    </AnimatedPressable>
  );
});

const AmcCard = React.memo(function AmcCard({
  plan, cardBg, borderColor, textColor, subColor,
}: {
  plan: typeof AMC_PLANS[number]; cardBg: string; borderColor: string; textColor: string; subColor: string;
}) {
  const isPopular = plan.popular;
  const handlePress = useCallback(() => {
    router.push("/amc" as any);
  }, []);

  return (
    <AnimatedPressable onPress={handlePress} scaleDown={0.96}>
      {isPopular ? (
        <LinearGradient colors={[...plan.gradient]} style={[styles.amcCard, CARD_SHADOW_LG]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
          <View style={styles.popularBadge}>
            <Text style={[styles.popularBadgeText, { fontFamily: "Inter_600SemiBold" }]}>Most Popular</Text>
          </View>
          <Text style={[styles.amcName, { color: "#fff", fontFamily: "Inter_700Bold" }]}>{plan.name}</Text>
          <Text style={[styles.amcPrice, { color: "rgba(255,255,255,0.9)", fontFamily: "Inter_600SemiBold" }]}>{plan.price}</Text>
          <View style={styles.featuresGap}>
            {plan.features.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Feather name="check" size={14} color="rgba(255,255,255,0.9)" />
                <Text style={[styles.featureText, { color: "rgba(255,255,255,0.85)", fontFamily: "Inter_400Regular" }]}>{f}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.selectBtn, { backgroundColor: "#fff" }, BUTTON_SHADOW]}>
            <Text style={[styles.selectBtnText, { color: plan.color, fontFamily: "Inter_600SemiBold" }]}>Select Plan</Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={[styles.amcCard, { backgroundColor: cardBg, borderColor, borderWidth: 1 }, CARD_SHADOW]}>
          <Text style={[styles.amcName, { color: textColor, fontFamily: "Inter_700Bold" }]}>{plan.name}</Text>
          <Text style={[styles.amcPrice, { color: plan.color, fontFamily: "Inter_600SemiBold" }]}>{plan.price}</Text>
          <View style={styles.featuresGap}>
            {plan.features.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Feather name="check" size={14} color={plan.color} />
                <Text style={[styles.featureText, { color: subColor, fontFamily: "Inter_400Regular" }]}>{f}</Text>
              </View>
            ))}
          </View>
          <LinearGradient colors={[...plan.gradient]} style={[styles.selectBtn, BUTTON_SHADOW]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={[styles.selectBtnText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>Select Plan</Text>
          </LinearGradient>
        </View>
      )}
    </AnimatedPressable>
  );
});

export default function ServicesScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleEmergency = useCallback(() => {
    Linking.openURL(`tel:+919876543210`);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomInset + 20 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />}
    >
      <Animated.View entering={FadeInDown.duration(300)} style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Services</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>Expert support for your machines</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>What can we help you with?</Text>
        <View style={styles.servicesGap}>
          {SERVICES.map((s) => (
            <ServiceCard key={s.id} service={s} cardBg={colors.card} borderColor={colors.border} textColor={colors.text} subColor={colors.textSecondary} mutedColor={colors.textMuted} />
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>AMC Plans</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>Keep your machines running at peak performance</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.amcScroll}>
          {AMC_PLANS.map((plan) => (
            <AmcCard key={plan.id} plan={plan} cardBg={colors.card} borderColor={colors.border} textColor={colors.text} subColor={colors.textSecondary} />
          ))}
        </ScrollView>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(300)} style={[styles.section, { paddingBottom: 8 }]}>
        <AnimatedPressable onPress={handleEmergency} scaleDown={0.98}>
          <LinearGradient colors={["#DC2626", "#EF4444", "#F87171"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.emergencyCard, CARD_SHADOW_XL]}>
            <View style={styles.emergencyContent}>
              <View style={styles.emergencyIconWrap}>
                <Feather name="phone-call" size={24} color="#fff" />
              </View>
              <View style={styles.flex}>
                <Text style={[styles.emergencyTitle, { fontFamily: "Inter_700Bold" }]}>24/7 Emergency Support</Text>
                <Text style={[styles.emergencySubtitle, { fontFamily: "Inter_400Regular" }]}>Machine breakdown? Call us immediately</Text>
              </View>
            </View>
            <View style={[styles.callBtn, BUTTON_SHADOW]}>
              <Text style={[styles.callBtnText, { fontFamily: "Inter_600SemiBold" }]}>Call Now: +91 98765 43210</Text>
            </View>
          </LinearGradient>
        </AnimatedPressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 26, marginBottom: 4 },
  headerSubtitle: { fontSize: 14 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, marginBottom: 6 },
  sectionSubtitle: { fontSize: 13, marginBottom: 16 },
  servicesGap: { gap: 10, marginTop: 10 },
  serviceCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  serviceIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  serviceText: { flex: 1, gap: 3 },
  serviceTitle: { fontSize: 15 },
  serviceSubtitle: { fontSize: 13 },
  amcScroll: { gap: 14, paddingRight: 20 },
  amcCard: { width: 230, borderRadius: 20, padding: 20, gap: 12 },
  popularBadge: { backgroundColor: "rgba(255,255,255,0.25)", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 4 },
  popularBadgeText: { color: "#fff", fontSize: 11 },
  amcName: { fontSize: 18 },
  amcPrice: { fontSize: 16 },
  featuresGap: { gap: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontSize: 13 },
  selectBtn: { borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 4 },
  selectBtnText: { fontSize: 14 },
  emergencyCard: { borderRadius: 20, padding: 22 },
  emergencyContent: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
  emergencyIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  emergencyTitle: { color: "#fff", fontSize: 16, marginBottom: 4 },
  emergencySubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  callBtn: { backgroundColor: "#fff", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  callBtnText: { color: "#EF4444", fontSize: 14 },
});
