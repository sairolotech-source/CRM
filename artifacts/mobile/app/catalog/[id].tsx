import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { MACHINE_DETAILS } from "@/data/machines";

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

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, []);

  const handleGetQuote = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/quotation" as any);
  }, []);

  const handleWhatsApp = useCallback(() => {
    Linking.openURL("https://wa.me/919876543210");
  }, []);

  const handleServiceRequest = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/service-request" as any);
  }, []);

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12, backgroundColor: machine.color }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.categoryBadgeText, { fontFamily: "Inter_400Regular" }]}>{machine.category}</Text>
          <Text style={[styles.machineName, { fontFamily: "Inter_700Bold" }]} numberOfLines={2}>{machine.name}</Text>
          <Text style={[styles.machineModel, { fontFamily: "Inter_400Regular" }]}>Model: {machine.model}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: bottomInset + 24 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.priceBanner, { backgroundColor: machine.color + "12", borderColor: machine.color + "30" }]}>
          <View>
            <Text style={[styles.priceLabel, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>Price Range</Text>
            <Text style={[styles.price, { color: machine.color, fontFamily: "Inter_700Bold" }]}>{machine.price}</Text>
          </View>
          <View style={styles.ctaButtons}>
            <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: machine.color }]} onPress={handleGetQuote}>
              <Text style={[styles.ctaBtnText, { fontFamily: "Inter_600SemiBold" }]}>Get Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ctaBtnOutline, { borderColor: machine.color }]} onPress={handleWhatsApp}>
              <Ionicons name="logo-whatsapp" size={16} color={machine.color} />
              <Text style={[styles.ctaBtnOutlineText, { color: machine.color, fontFamily: "Inter_600SemiBold" }]}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Overview</Text>
          <Text style={[styles.description, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{machine.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Technical Specifications</Text>
          <View style={[styles.specsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {machine.specs?.map((spec, idx) => (
              <SpecRow key={spec.label} spec={spec} isLast={idx === machine.specs.length - 1} borderColor={colors.border} subColor={colors.textSecondary} textColor={colors.text} />
            ))}
          </View>
        </View>

        {machine.features && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Key Features</Text>
            <View style={{ gap: 10 }}>
              {machine.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <View style={[styles.featureDot, { backgroundColor: machine.color }]} />
                  <Text style={[styles.featureText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.section, { paddingBottom: 8 }]}>
          <TouchableOpacity style={[styles.mainCta, { backgroundColor: machine.color }]} onPress={handleServiceRequest} activeOpacity={0.85}>
            <Feather name="tool" size={18} color="#fff" />
            <Text style={[styles.mainCtaText, { fontFamily: "Inter_600SemiBold" }]}>Request Service for This Machine</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 20, paddingBottom: 24 },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginTop: 4 },
  headerTextWrap: { flex: 1, paddingHorizontal: 12 },
  categoryBadgeText: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginBottom: 4 },
  machineName: { fontSize: 22, color: "#fff", marginBottom: 4 },
  machineModel: { color: "rgba(255,255,255,0.75)", fontSize: 13 },
  priceBanner: { marginHorizontal: 20, marginTop: 20, borderRadius: 14, borderWidth: 1, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
  priceLabel: { fontSize: 12, marginBottom: 2 },
  price: { fontSize: 22 },
  ctaButtons: { flexDirection: "row", gap: 8 },
  ctaBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  ctaBtnText: { color: "#fff", fontSize: 14 },
  ctaBtnOutline: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5 },
  ctaBtnOutlineText: { fontSize: 14 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 17, marginBottom: 14 },
  description: { fontSize: 14, lineHeight: 22 },
  specsCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  specRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12 },
  specLabel: { fontSize: 13 },
  specValue: { fontSize: 14 },
  featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  featureDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  featureText: { flex: 1, fontSize: 14, lineHeight: 20 },
  mainCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 14, paddingVertical: 16 },
  mainCtaText: { color: "#fff", fontSize: 16 },
});
