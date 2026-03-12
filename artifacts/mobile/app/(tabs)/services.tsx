import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

const SERVICES = [
  { id: "service-request", title: "Service Request", subtitle: "Schedule machine maintenance or repair", icon: "tool", color: "#10B981", route: "/service-request" },
  { id: "amc", title: "AMC Plans", subtitle: "Annual maintenance contract packages", icon: "shield", color: "#8B5CF6", route: "/amc" },
  { id: "quotation", title: "Get Quotation", subtitle: "Request pricing for a new machine", icon: "file-text", color: "#F59E0B", route: "/quotation" },
  { id: "support", title: "Support Ticket", subtitle: "Raise a complaint or technical query", icon: "message-circle", color: "#EF4444", route: "/support-ticket" },
] as const;

const AMC_PLANS = [
  { id: "basic", name: "Basic AMC", price: "₹15,000/yr", features: ["2 visits/year", "Lubrication & cleaning", "Phone support", "Parts at cost"], color: "#64748B", popular: false },
  { id: "standard", name: "Standard AMC", price: "₹28,000/yr", features: ["4 visits/year", "All basic services", "Priority support", "10% parts discount", "Roller check"], color: "#1A56DB", popular: true },
  { id: "premium", name: "Premium AMC", price: "₹45,000/yr", features: ["8 visits/year", "All standard services", "24/7 support", "20% parts discount", "Free minor parts", "Emergency response"], color: "#8B5CF6", popular: false },
] as const;

const ServiceCard = React.memo(function ServiceCard({
  service, cardBg, borderColor, textColor, subColor, mutedColor,
}: {
  service: typeof SERVICES[number];
  cardBg: string; borderColor: string; textColor: string; subColor: string; mutedColor: string;
}) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(service.route as any);
  }, [service.route]);

  return (
    <TouchableOpacity style={[styles.serviceCard, { backgroundColor: cardBg, borderColor }]} onPress={handlePress} activeOpacity={0.8}>
      <View style={[styles.serviceIcon, { backgroundColor: service.color + "18" }]}>
        <Feather name={service.icon as any} size={22} color={service.color} />
      </View>
      <View style={styles.serviceText}>
        <Text style={[styles.serviceTitle, { color: textColor, fontFamily: "Inter_600SemiBold" }]}>{service.title}</Text>
        <Text style={[styles.serviceSubtitle, { color: subColor, fontFamily: "Inter_400Regular" }]}>{service.subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={mutedColor} />
    </TouchableOpacity>
  );
});

const AmcCard = React.memo(function AmcCard({
  plan, cardBg, borderColor, textColor, subColor,
}: {
  plan: typeof AMC_PLANS[number];
  cardBg: string; borderColor: string; textColor: string; subColor: string;
}) {
  const isPopular = plan.popular;
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/amc" as any);
  }, []);

  return (
    <View style={[styles.amcCard, isPopular ? { backgroundColor: plan.color, borderColor: plan.color } : { backgroundColor: cardBg, borderColor }, { borderWidth: 1 }]}>
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={[styles.popularBadgeText, { fontFamily: "Inter_600SemiBold" }]}>Most Popular</Text>
        </View>
      )}
      <Text style={[styles.amcName, { color: isPopular ? "#fff" : textColor, fontFamily: "Inter_700Bold" }]}>{plan.name}</Text>
      <Text style={[styles.amcPrice, { color: isPopular ? "rgba(255,255,255,0.9)" : plan.color, fontFamily: "Inter_600SemiBold" }]}>{plan.price}</Text>
      <View style={styles.featuresGap}>
        {plan.features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Feather name="check" size={14} color={isPopular ? "rgba(255,255,255,0.9)" : plan.color} />
            <Text style={[styles.featureText, { color: isPopular ? "rgba(255,255,255,0.85)" : subColor, fontFamily: "Inter_400Regular" }]}>{f}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={[styles.selectBtn, isPopular ? { backgroundColor: "#fff" } : { backgroundColor: plan.color }]} onPress={handlePress} activeOpacity={0.85}>
        <Text style={[styles.selectBtnText, { color: isPopular ? plan.color : "#fff", fontFamily: "Inter_600SemiBold" }]}>Select Plan</Text>
      </TouchableOpacity>
    </View>
  );
});

export default function ServicesScreen() {
  const { colors, topInset, bottomInset } = useTheme();

  const handleEmergency = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const contentPadding = useMemo(() => ({ paddingBottom: bottomInset + 20 }), [bottomInset]);

  return (
    <ScrollView style={[styles.flex, { backgroundColor: colors.background }]} contentContainerStyle={contentPadding} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Services</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>Expert support for your machines</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>What can we help you with?</Text>
        <View style={styles.servicesGap}>
          {SERVICES.map((s) => (
            <ServiceCard key={s.id} service={s} cardBg={colors.card} borderColor={colors.border} textColor={colors.text} subColor={colors.textSecondary} mutedColor={colors.textMuted} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>AMC Plans</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>Keep your machines running at peak performance</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.amcScroll}>
          {AMC_PLANS.map((plan) => (
            <AmcCard key={plan.id} plan={plan} cardBg={colors.card} borderColor={colors.border} textColor={colors.text} subColor={colors.textSecondary} />
          ))}
        </ScrollView>
      </View>

      <View style={[styles.section, { paddingBottom: 8 }]}>
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyContent}>
            <Feather name="phone-call" size={24} color="#fff" />
            <View style={styles.flex}>
              <Text style={[styles.emergencyTitle, { fontFamily: "Inter_700Bold" }]}>24/7 Emergency Support</Text>
              <Text style={[styles.emergencySubtitle, { fontFamily: "Inter_400Regular" }]}>Machine breakdown? Call us immediately</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callBtn} onPress={handleEmergency} activeOpacity={0.85}>
            <Text style={[styles.callBtnText, { fontFamily: "Inter_600SemiBold" }]}>Call Now: +91 98765 43210</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  serviceCard: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, padding: 16, gap: 14 },
  serviceIcon: { width: 46, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  serviceText: { flex: 1, gap: 3 },
  serviceTitle: { fontSize: 15 },
  serviceSubtitle: { fontSize: 13 },
  amcScroll: { gap: 14, paddingRight: 20 },
  amcCard: { width: 220, borderRadius: 16, padding: 18, gap: 12 },
  popularBadge: { backgroundColor: "rgba(255,255,255,0.25)", alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 4 },
  popularBadgeText: { color: "#fff", fontSize: 11 },
  amcName: { fontSize: 18 },
  amcPrice: { fontSize: 16 },
  featuresGap: { gap: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontSize: 13 },
  selectBtn: { borderRadius: 10, paddingVertical: 11, alignItems: "center", marginTop: 4 },
  selectBtnText: { fontSize: 14 },
  emergencyCard: { backgroundColor: "#EF4444", borderRadius: 16, padding: 20 },
  emergencyContent: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
  emergencyTitle: { color: "#fff", fontSize: 16, marginBottom: 4 },
  emergencySubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  callBtn: { backgroundColor: "#fff", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  callBtnText: { color: "#EF4444", fontSize: 14 },
});
