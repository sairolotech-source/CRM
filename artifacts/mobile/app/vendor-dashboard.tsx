import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useTheme } from "@/hooks/useTheme";
import { CARD_SHADOW, BUTTON_SHADOW } from "@/constants/shadows";

const PARTS = [
  { id: "1", name: "Hydraulic Decoiler (5 Ton)", stock: 3, price: "₹1,85,000", demand: "High", orders: 2 },
  { id: "2", name: "Spare Roller Set - RS-5000", stock: 8, price: "₹45,000", demand: "Medium", orders: 1 },
  { id: "3", name: "PLC Control Panel (Siemens)", stock: 2, price: "₹2,20,000", demand: "High", orders: 3 },
  { id: "4", name: "Flying Shear Cutter Blade", stock: 15, price: "₹12,000", demand: "Low", orders: 0 },
  { id: "5", name: "Servo Motor (3HP)", stock: 5, price: "₹65,000", demand: "Medium", orders: 1 },
  { id: "6", name: "Safety Guard Assembly", stock: 0, price: "₹28,000", demand: "High", orders: 4 },
];

const DEMAND_COLORS: Record<string, { bg: string; text: string }> = {
  High: { bg: "#FEF2F2", text: "#EF4444" },
  Medium: { bg: "#FEF3C7", text: "#D97706" },
  Low: { bg: "#F0FDF4", text: "#059669" },
};

export default function VendorDashboard() {
  const { colors, topInset, bottomInset } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#78350F", "#D97706"]}
        style={[styles.header, { paddingTop: topInset + 12 }]}
      >
        <View style={styles.headerRow}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </AnimatedPressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Vendor Dashboard</Text>
            <Text style={styles.headerSub}>Kumar Spare Parts</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: "Products", value: "6", icon: "box", color: "#FDE68A" },
            { label: "Low Stock", value: "1", icon: "alert-triangle", color: "#F87171" },
            { label: "Orders", value: "11", icon: "shopping-cart", color: "#34D399" },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Feather name={stat.icon as any} size={16} color={stat.color} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: bottomInset + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Inventory</Text>

        {PARTS.map((part, i) => {
          const demand = DEMAND_COLORS[part.demand] || DEMAND_COLORS.Low;
          return (
            <Animated.View key={part.id} entering={FadeInDown.delay(i * 80).duration(400)}>
              <AnimatedPressable
                style={[styles.partCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}
                scaleDown={0.98}
              >
                <View style={styles.partHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.partName, { color: colors.text }]}>{part.name}</Text>
                    <Text style={[styles.partPrice, { color: "#D97706" }]}>{part.price}</Text>
                  </View>
                  <View style={[styles.demandBadge, { backgroundColor: demand.bg }]}>
                    <Text style={[styles.demandText, { color: demand.text }]}>{part.demand}</Text>
                  </View>
                </View>

                <View style={styles.partFooter}>
                  <View style={styles.partStat}>
                    <Feather name="package" size={13} color={part.stock === 0 ? "#EF4444" : colors.textMuted} />
                    <Text
                      style={[
                        styles.partStatText,
                        { color: part.stock === 0 ? "#EF4444" : colors.textSecondary, fontWeight: part.stock === 0 ? "700" : "500" },
                      ]}
                    >
                      {part.stock === 0 ? "Out of Stock" : `${part.stock} in stock`}
                    </Text>
                  </View>
                  <View style={styles.partStat}>
                    <Feather name="shopping-cart" size={13} color={colors.textMuted} />
                    <Text style={[styles.partStatText, { color: colors.textSecondary }]}>
                      {part.orders} orders
                    </Text>
                  </View>
                </View>
              </AnimatedPressable>
            </Animated.View>
          );
        })}

        <AnimatedPressable style={{ marginTop: 8 }}>
          <LinearGradient colors={["#D97706", "#F59E0B"]} style={[styles.actionBtn, BUTTON_SHADOW]}>
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Add New Product</Text>
          </LinearGradient>
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#FFFBEB" },
  headerSub: { fontSize: 13, color: "#FDE68A", marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 8 },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 10, fontWeight: "600", color: "#FDE68A" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  partCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  partHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  partName: { fontSize: 15, fontWeight: "700" },
  partPrice: { fontSize: 14, fontWeight: "600", marginTop: 2 },
  demandBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  demandText: { fontSize: 11, fontWeight: "700" },
  partFooter: { flexDirection: "row", gap: 20 },
  partStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  partStatText: { fontSize: 12 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  actionBtnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
