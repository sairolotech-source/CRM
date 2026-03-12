import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useTheme } from "@/hooks/useTheme";
import { CARD_SHADOW, BUTTON_SHADOW, shadow3D } from "@/constants/shadows";

const ORDERS = [
  { id: "1", item: "HR Steel Coils (2mm)", qty: "5 Tons", buyer: "Sai Rolotech", status: "Pending", date: "Mar 10", amount: "₹4,50,000" },
  { id: "2", item: "GI Sheet Rolls (0.5mm)", qty: "3 Tons", buyer: "Gujarat Steel Works", status: "Shipped", date: "Mar 8", amount: "₹2,70,000" },
  { id: "3", item: "MS Flat Bars (25mm)", qty: "2 Tons", buyer: "Patel Fabrication", status: "Delivered", date: "Mar 5", amount: "₹1,80,000" },
  { id: "4", item: "SS Coils (304 Grade)", qty: "1 Ton", buyer: "Rajkot Industries", status: "Pending", date: "Mar 12", amount: "₹3,20,000" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "#FEF3C7", text: "#D97706" },
  Shipped: { bg: "#EFF6FF", text: "#1A56DB" },
  Delivered: { bg: "#F0FDF4", text: "#059669" },
};

export default function SupplierDashboard() {
  const { colors, topInset, bottomInset } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#064E3B", "#059669"]}
        style={[styles.header, { paddingTop: topInset + 12 }]}
      >
        <View style={styles.headerRow}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </AnimatedPressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Supplier Dashboard</Text>
            <Text style={styles.headerSub}>Gujarat Steel Suppliers</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: "Active Orders", value: "4", icon: "package", color: "#34D399" },
            { label: "Revenue", value: "₹12.2L", icon: "trending-up", color: "#FBBF24" },
            { label: "Clients", value: "8", icon: "users", color: "#60A5FA" },
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Orders</Text>

        {ORDERS.map((order, i) => {
          const st = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
          return (
            <Animated.View key={order.id} entering={FadeInDown.delay(i * 80).duration(400)}>
              <AnimatedPressable
                style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}
                scaleDown={0.98}
              >
                <View style={styles.orderHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.orderItem, { color: colors.text }]}>{order.item}</Text>
                    <Text style={[styles.orderBuyer, { color: colors.textSecondary }]}>
                      Buyer: {order.buyer}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                    <Text style={[styles.statusText, { color: st.text }]}>{order.status}</Text>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <View style={styles.orderDetail}>
                    <Feather name="package" size={13} color={colors.textMuted} />
                    <Text style={[styles.orderDetailText, { color: colors.textSecondary }]}>{order.qty}</Text>
                  </View>
                  <View style={styles.orderDetail}>
                    <Feather name="calendar" size={13} color={colors.textMuted} />
                    <Text style={[styles.orderDetailText, { color: colors.textSecondary }]}>{order.date}</Text>
                  </View>
                  <Text style={[styles.orderAmount, { color: "#059669" }]}>{order.amount}</Text>
                </View>
              </AnimatedPressable>
            </Animated.View>
          );
        })}

        <AnimatedPressable style={{ marginTop: 8 }}>
          <LinearGradient colors={["#059669", "#10B981"]} style={[styles.actionBtn, BUTTON_SHADOW]}>
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Add New Supply Quote</Text>
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
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#ECFDF5" },
  headerSub: { fontSize: 13, color: "#A7F3D0", marginTop: 2 },
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
  statLabel: { fontSize: 10, fontWeight: "600", color: "#A7F3D0" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  orderCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  orderHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  orderItem: { fontSize: 15, fontWeight: "700" },
  orderBuyer: { fontSize: 13, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "700" },
  orderDetails: { flexDirection: "row", alignItems: "center", gap: 16 },
  orderDetail: { flexDirection: "row", alignItems: "center", gap: 4 },
  orderDetailText: { fontSize: 12, fontWeight: "500" },
  orderAmount: { fontSize: 14, fontWeight: "700", marginLeft: "auto" },
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
