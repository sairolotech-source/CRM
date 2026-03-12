import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/colors";

const MACHINES: Record<string, any> = {
  "1": {
    name: "Rolling Shutter Machine",
    model: "RS-5000",
    category: "Rolling Shutter",
    capacity: "2-4 tons/hr",
    power: "15 kW",
    speed: "25 m/min",
    price: "₹12-18 Lakhs",
    weight: "3.5 tons",
    dimensions: "12m x 1.2m x 1.5m",
    rollers: "18 stages",
    color: "#1A56DB",
    description:
      "The RS-5000 is our flagship rolling shutter patti making machine with automatic stacking system. Designed for high-volume production with minimal operator intervention, it features advanced PLC control for precise speed and production management.",
    specs: [
      { label: "Production Capacity", value: "2-4 tons/hr" },
      { label: "Machine Speed", value: "25 m/min" },
      { label: "Motor Power", value: "15 kW" },
      { label: "Total Weight", value: "3.5 tons" },
      { label: "Dimensions", value: "12m x 1.2m x 1.5m" },
      { label: "Roller Stages", value: "18 stages" },
      { label: "Material Thickness", value: "0.3-0.8 mm" },
      { label: "Material Width", value: "90 mm" },
    ],
    features: [
      "PLC control system with touchscreen HMI",
      "Automatic stacking & counting system",
      "Hydraulic decoiler with auto feeder",
      "Flying shear cutting with servo motor",
      "Remote diagnostics capability",
      "CE certified design",
    ],
  },
  "2": {
    name: "T-Grid Ceiling Machine",
    model: "TG-3000",
    category: "False Ceiling",
    capacity: "1.5-2 tons/hr",
    power: "11 kW",
    speed: "20 m/min",
    price: "₹8-12 Lakhs",
    color: "#10B981",
    description: "T-Grid false ceiling section making machine for commercial and residential projects. Produces standard T-Bar profiles with precise dimensions.",
    specs: [
      { label: "Production Capacity", value: "1.5-2 tons/hr" },
      { label: "Machine Speed", value: "20 m/min" },
      { label: "Motor Power", value: "11 kW" },
      { label: "Material Thickness", value: "0.25-0.5 mm" },
      { label: "Profile Width", value: "38 mm / 24 mm" },
    ],
    features: [
      "High precision roller dies",
      "Auto cutting to length",
      "Compact design",
      "Low maintenance",
      "Energy efficient motor",
    ],
  },
  "3": {
    name: "C-Purlin Machine",
    model: "CP-8000",
    category: "Structural",
    capacity: "3-5 tons/hr",
    power: "22 kW",
    speed: "30 m/min",
    price: "₹20-28 Lakhs",
    color: "#8B5CF6",
    description: "Heavy-duty C-Purlin roll forming machine for structural steel applications. PLC-controlled with automatic size change capability.",
    specs: [
      { label: "Production Capacity", value: "3-5 tons/hr" },
      { label: "Machine Speed", value: "30 m/min" },
      { label: "Motor Power", value: "22 kW" },
      { label: "Profile Range", value: "C100 to C300" },
      { label: "Material Thickness", value: "1.5-3.0 mm" },
    ],
    features: [
      "PLC + servo motor control",
      "Automatic size changeover",
      "Hydraulic post-cut system",
      "Heavy-duty construction",
      "Built-in straightener",
    ],
  },
};

export default function CatalogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const machine = MACHINES[id] || MACHINES["1"];
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topInset + 12,
            backgroundColor: machine.color,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          <Text style={[styles.categoryBadgeText, { fontFamily: "Inter_400Regular" }]}>
            {machine.category}
          </Text>
          <Text style={[styles.machineName, { fontFamily: "Inter_700Bold" }]} numberOfLines={2}>
            {machine.name}
          </Text>
          <Text style={[styles.machineModel, { fontFamily: "Inter_400Regular" }]}>
            Model: {machine.model}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Price Banner */}
        <View style={[styles.priceBanner, { backgroundColor: machine.color + "12", borderColor: machine.color + "30" }]}>
          <View>
            <Text style={[styles.priceLabel, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>
              Price Range
            </Text>
            <Text style={[styles.price, { color: machine.color, fontFamily: "Inter_700Bold" }]}>
              {machine.price}
            </Text>
          </View>
          <View style={styles.ctaButtons}>
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: machine.color }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/quotation" as any);
              }}
            >
              <Text style={[styles.ctaBtnText, { fontFamily: "Inter_600SemiBold" }]}>Get Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctaBtnOutline, { borderColor: machine.color }]}
              onPress={() => Linking.openURL("https://wa.me/919876543210")}
            >
              <Ionicons name="logo-whatsapp" size={16} color={machine.color} />
              <Text style={[styles.ctaBtnOutlineText, { color: machine.color, fontFamily: "Inter_600SemiBold" }]}>
                WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Overview
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {machine.description}
          </Text>
        </View>

        {/* Specifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Technical Specifications
          </Text>
          <View style={[styles.specsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {machine.specs?.map((spec: { label: string; value: string }, idx: number) => (
              <View
                key={spec.label}
                style={[
                  styles.specRow,
                  idx < machine.specs.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                ]}
              >
                <Text style={[styles.specLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  {spec.label}
                </Text>
                <Text style={[styles.specValue, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  {spec.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Key Features */}
        {machine.features && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Key Features
            </Text>
            <View style={{ gap: 10 }}>
              {machine.features.map((f: string) => (
                <View key={f} style={styles.featureRow}>
                  <View style={[styles.featureDot, { backgroundColor: machine.color }]} />
                  <Text style={[styles.featureText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    {f}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* CTA */}
        <View style={[styles.section, { paddingBottom: 8 }]}>
          <TouchableOpacity
            style={[styles.mainCta, { backgroundColor: machine.color }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/service-request" as any);
            }}
            activeOpacity={0.85}
          >
            <Feather name="tool" size={18} color="#fff" />
            <Text style={[styles.mainCtaText, { fontFamily: "Inter_600SemiBold" }]}>
              Request Service for This Machine
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  categoryBadgeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginBottom: 4,
  },
  machineName: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 4,
  },
  machineModel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
  },
  priceBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  priceLabel: { fontSize: 12, marginBottom: 2 },
  price: { fontSize: 22 },
  ctaButtons: { flexDirection: "row", gap: 8 },
  ctaBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ctaBtnText: { color: "#fff", fontSize: 14 },
  ctaBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  ctaBtnOutlineText: { fontSize: 14 },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: { fontSize: 17, marginBottom: 14 },
  description: { fontSize: 14, lineHeight: 22 },
  specsCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  specLabel: { fontSize: 13 },
  specValue: { fontSize: 14 },
  featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  featureDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  featureText: { flex: 1, fontSize: 14, lineHeight: 20 },
  mainCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
  },
  mainCtaText: { color: "#fff", fontSize: 16 },
});
