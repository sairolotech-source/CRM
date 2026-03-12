import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { MACHINE_DETAILS } from "@/data/machines";
import AnimatedPressable from "@/components/AnimatedPressable";
import { CARD_SHADOW, CARD_SHADOW_LG, BUTTON_SHADOW } from "@/constants/shadows";

const COLOR_GRADIENTS: Record<string, string[]> = {
  "#1A56DB": ["#1E40AF", "#3B82F6"],
  "#10B981": ["#047857", "#34D399"],
  "#EF4444": ["#DC2626", "#F87171"],
  "#8B5CF6": ["#6D28D9", "#A78BFA"],
  "#F59E0B": ["#B45309", "#FBBF24"],
  "#0EA5E9": ["#0369A1", "#38BDF8"],
  "#EC4899": ["#BE185D", "#F472B6"],
  "#14B8A6": ["#0D9488", "#5EEAD4"],
};

const SpecRow = React.memo(function SpecRow({
  spec, isLast, borderColor, subColor, textColor,
}: {
  spec: { label: string; value: string }; isLast: boolean;
  borderColor: string; subColor: string; textColor: string;
}) {
  return (
    <View style={[styles.specRow, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor }]}>
      <Text style={[styles.specLabel, { color: subColor, fontFamily: "Inter_400Regular" }]}>{spec.label}</Text>
      <Text style={[styles.specValue, { color: textColor, fontFamily: "Inter_600SemiBold" }]}>{spec.value}</Text>
    </View>
  );
});

export default function CatalogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, topInset, bottomInset } = useTheme();

  const machine = useMemo(() => MACHINE_DETAILS[id] || MACHINE_DETAILS["1"], [id]);
  const gradient = useMemo(() => COLOR_GRADIENTS[machine.color] || [machine.color, machine.color + "CC"], [machine.color]);

  const handleBack = useCallback(() => router.back(), []);
  const handleGetQuote = useCallback(() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/quotation" as any); }, []);
  const handleWhatsApp = useCallback(() => { Linking.openURL("https://wa.me/919876543210"); }, []);
  const handleServiceRequest = useCallback(() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/service-request" as any); }, []);

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <LinearGradient colors={gradient} style={[styles.header, { paddingTop: topInset + 12 }]}>
        <AnimatedPressable onPress={handleBack} style={styles.backBtn} scaleDown={0.9}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </AnimatedPressable>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.categoryBadgeText, { fontFamily: "Inter_400Regular" }]}>{machine.category}</Text>
          <Text style={[styles.machineName, { fontFamily: "Inter_700Bold" }]} numberOfLines={2}>{machine.name}</Text>
          <Text style={[styles.machineModel, { fontFamily: "Inter_400Regular" }]}>Model: {machine.model}</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: bottomInset + 24 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(300)} style={[styles.priceBanner, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW_LG]}>
          <View>
            <Text style={[styles.priceLabel, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>Price Range</Text>
            <Text style={[styles.price, { color: machine.color, fontFamily: "Inter_700Bold" }]}>{machine.price}</Text>
          </View>
          <View style={styles.ctaButtons}>
            <AnimatedPressable onPress={handleGetQuote} scaleDown={0.95}>
              <LinearGradient colors={gradient} style={[styles.ctaBtn, BUTTON_SHADOW]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={[styles.ctaBtnText, { fontFamily: "Inter_600SemiBold" }]}>Get Quote</Text>
              </LinearGradient>
            </AnimatedPressable>
            <AnimatedPressable onPress={handleWhatsApp} style={[styles.ctaBtnOutline, { borderColor: machine.color }]} scaleDown={0.95}>
              <Ionicons name="logo-whatsapp" size={16} color={machine.color} />
              <Text style={[styles.ctaBtnOutlineText, { color: machine.color, fontFamily: "Inter_600SemiBold" }]}>WhatsApp</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Overview</Text>
          <Text style={[styles.description, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{machine.description}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Technical Specifications</Text>
          <View style={[styles.specsCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
            {machine.specs?.map((spec, idx) => (
              <SpecRow key={spec.label} spec={spec} isLast={idx === machine.specs.length - 1} borderColor={colors.border} subColor={colors.textSecondary} textColor={colors.text} />
            ))}
          </View>
        </Animated.View>

        {machine.features && (
          <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Key Features</Text>
            <View style={{ gap: 10 }}>
              {machine.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <LinearGradient colors={gradient} style={styles.featureDot} />
                  <Text style={[styles.featureText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{f}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(400).duration(300)} style={[styles.section, { paddingBottom: 8 }]}>
          <AnimatedPressable onPress={handleServiceRequest} scaleDown={0.98}>
            <LinearGradient colors={gradient} style={[styles.mainCta, CARD_SHADOW_LG]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Feather name="tool" size={18} color="#fff" />
              <Text style={[styles.mainCtaText, { fontFamily: "Inter_600SemiBold" }]}>Request Service for This Machine</Text>
            </LinearGradient>
          </AnimatedPressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 20, paddingBottom: 28 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginTop: 4 },
  headerTextWrap: { flex: 1, paddingHorizontal: 12 },
  categoryBadgeText: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginBottom: 4 },
  machineName: { fontSize: 22, color: "#fff", marginBottom: 4 },
  machineModel: { color: "rgba(255,255,255,0.75)", fontSize: 13 },
  priceBanner: { marginHorizontal: 20, marginTop: -10, borderRadius: 18, borderWidth: 1, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, zIndex: 1 },
  priceLabel: { fontSize: 12, marginBottom: 2 },
  price: { fontSize: 22 },
  ctaButtons: { flexDirection: "row", gap: 8 },
  ctaBtn: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: 12 },
  ctaBtnText: { color: "#fff", fontSize: 14 },
  ctaBtnOutline: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5 },
  ctaBtnOutlineText: { fontSize: 14 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 17, marginBottom: 14 },
  description: { fontSize: 14, lineHeight: 22 },
  specsCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  specRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13 },
  specLabel: { fontSize: 13 },
  specValue: { fontSize: 14 },
  featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  featureDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  featureText: { flex: 1, fontSize: 14, lineHeight: 20 },
  mainCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 16, paddingVertical: 16 },
  mainCtaText: { color: "#fff", fontSize: 16 },
});
