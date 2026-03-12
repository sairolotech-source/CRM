import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useTheme } from "@/hooks/useTheme";
import { CARD_SHADOW } from "@/constants/shadows";
import { SPARE_PARTS, SPARE_PART_CATEGORIES, type SparePart } from "@/data/spare-parts";

const AVAILABILITY_COLORS: Record<string, { color: string; bg: string }> = {
  "In Stock": { color: "#059669", bg: "#F0FDF4" },
  "Made to Order": { color: "#D97706", bg: "#FEF3C7" },
  "2-3 Days": { color: "#1A56DB", bg: "#EFF6FF" },
};

export default function SparePartsScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    let result = SPARE_PARTS;
    if (category !== "All") result = result.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.machineCompatibility.some((m) => m.toLowerCase().includes(q))
      );
    }
    return result;
  }, [search, category]);

  const renderPart = useCallback(
    ({ item, index }: { item: SparePart; index: number }) => {
      const avail = AVAILABILITY_COLORS[item.availability] || AVAILABILITY_COLORS["In Stock"];
      return (
        <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
          <View style={[styles.partCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
            <View style={styles.partHeader}>
              <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.partIcon}>
                <Feather
                  name={
                    item.category === "Rollers" ? "disc" :
                    item.category === "Bearings" ? "circle" :
                    item.category === "Cutting Blades" ? "scissors" :
                    item.category === "Hydraulic Parts" ? "droplet" :
                    item.category === "Electrical" ? "zap" :
                    item.category === "Chains & Sprockets" ? "link" :
                    item.category === "Shafts" ? "minus" :
                    "box"
                  }
                  size={18}
                  color="#fff"
                />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={[styles.partName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.partCategory, { color: colors.textMuted }]}>{item.category}</Text>
              </View>
              <View style={[styles.availBadge, { backgroundColor: avail.bg }]}>
                <Text style={[styles.availText, { color: avail.color }]}>{item.availability}</Text>
              </View>
            </View>

            <Text style={[styles.partDesc, { color: colors.textSecondary }]}>{item.description}</Text>

            <View style={styles.partFooter}>
              <View style={styles.machinesRow}>
                {item.machineCompatibility.slice(0, 3).map((m) => (
                  <View key={m} style={[styles.machineChip, { backgroundColor: "#EFF6FF" }]}>
                    <Text style={styles.machineChipText}>{m}</Text>
                  </View>
                ))}
                {item.machineCompatibility.length > 3 && (
                  <View style={[styles.machineChip, { backgroundColor: "#F3F4F6" }]}>
                    <Text style={[styles.machineChipText, { color: "#6B7280" }]}>+{item.machineCompatibility.length - 3}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.priceRange, { color: "#059669" }]}>{item.priceRange}</Text>
            </View>

            <View style={[styles.partActions, { borderTopColor: colors.border }]}>
              <AnimatedPressable scaleDown={0.95} style={{ flex: 1 }}>
                <View style={[styles.enquireBtn, { backgroundColor: "#EFF6FF" }]}>
                  <Feather name="send" size={14} color="#1A56DB" />
                  <Text style={styles.enquireBtnText}>Enquire</Text>
                </View>
              </AnimatedPressable>
              <AnimatedPressable scaleDown={0.95} style={{ flex: 1 }}>
                <LinearGradient colors={["#059669", "#10B981"]} style={styles.orderBtn}>
                  <Feather name="shopping-cart" size={14} color="#fff" />
                  <Text style={styles.orderBtnText}>Order Now</Text>
                </LinearGradient>
              </AnimatedPressable>
            </View>
          </View>
        </Animated.View>
      );
    },
    [colors]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#0F172A", "#1E293B"]} style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View style={styles.headerRow}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </AnimatedPressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Spare Parts</Text>
            <Text style={styles.headerSub}>{SPARE_PARTS.length} parts available</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search parts, machine model..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <AnimatedPressable onPress={() => setSearch("")}>
              <Feather name="x" size={18} color="#94A3B8" />
            </AnimatedPressable>
          )}
        </View>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}>
        {SPARE_PART_CATEGORIES.map((cat) => (
          <AnimatedPressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.filterChip, { backgroundColor: category === cat ? "#1A56DB" : colors.card, borderColor: category === cat ? "#1A56DB" : colors.border }]}
            scaleDown={0.95}
          >
            <Text style={[styles.filterText, { color: category === cat ? "#fff" : colors.text }]}>{cat}</Text>
          </AnimatedPressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        renderItem={renderPart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomInset + 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="box" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No parts found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#F1F5F9" },
  headerSub: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: "#0F172A", paddingVertical: 12 },
  filterRow: { paddingVertical: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 12, fontWeight: "600" },
  partCard: { borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: "hidden" },
  partHeader: { flexDirection: "row", alignItems: "center", padding: 14, paddingBottom: 8, gap: 10 },
  partIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  partName: { fontSize: 14, fontWeight: "700" },
  partCategory: { fontSize: 11, marginTop: 1 },
  availBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  availText: { fontSize: 10, fontWeight: "700" },
  partDesc: { fontSize: 12, lineHeight: 18, paddingHorizontal: 14, marginBottom: 10 },
  partFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, marginBottom: 10 },
  machinesRow: { flexDirection: "row", gap: 4 },
  machineChip: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  machineChipText: { fontSize: 9, fontWeight: "700", color: "#1A56DB" },
  priceRange: { fontSize: 13, fontWeight: "700" },
  partActions: { flexDirection: "row", gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
  enquireBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 9, borderRadius: 10 },
  enquireBtnText: { fontSize: 13, fontWeight: "700", color: "#1A56DB" },
  orderBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 9, borderRadius: 10 },
  orderBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontWeight: "500" },
});
