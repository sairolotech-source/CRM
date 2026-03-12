import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  RefreshControl,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { FlashList } from "@shopify/flash-list";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useDebounce } from "@/hooks/useDebounce";
import { MACHINES, CATEGORIES, CATEGORY_COLORS, type Machine } from "@/data/machines";
import AnimatedPressable from "@/components/AnimatedPressable";
import { CARD_SHADOW, CARD_SHADOW_LG, shadowGlow, BUTTON_SHADOW } from "@/constants/shadows";

const CATEGORY_GRADIENTS: Record<string, string[]> = {
  "Rolling Shutter": ["#1A56DB", "#3B82F6"],
  "False Ceiling": ["#DC2626", "#F87171"],
  "Roofing": ["#059669", "#34D399"],
  "Structural": ["#7C3AED", "#A78BFA"],
  "Purlin": ["#D97706", "#FBBF24"],
  "Door Frame": ["#0284C7", "#38BDF8"],
  "Partition": ["#DB2777", "#F472B6"],
};

const MachineCard = React.memo(function MachineCard({
  item, isDark, cardBg, borderColor, textColor, subColor, mutedColor, bgSecondary, onPress,
}: {
  item: Machine; isDark: boolean;
  cardBg: string; borderColor: string; textColor: string; subColor: string; mutedColor: string; bgSecondary: string; onPress: () => void;
}) {
  const catColor = CATEGORY_COLORS[item.category] || "#1A56DB";
  const gradient = CATEGORY_GRADIENTS[item.category] || [catColor, catColor + "CC"];

  return (
    <AnimatedPressable onPress={onPress} style={[styles.machineCard, { backgroundColor: cardBg, borderColor }, CARD_SHADOW]} scaleDown={0.97}>
      <LinearGradient colors={gradient} style={styles.categoryBadge} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={[styles.categoryBadgeText, { fontFamily: "Inter_600SemiBold" }]}>{item.category}</Text>
      </LinearGradient>
      <Text style={[styles.machineName, { color: textColor, fontFamily: "Inter_700Bold" }]}>{item.name}</Text>
      <Text style={[styles.machineModel, { color: subColor, fontFamily: "Inter_400Regular" }]}>Model: {item.model}</Text>
      <Text style={[styles.machineDesc, { color: subColor, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>{item.description}</Text>
      <View style={styles.specsRow}>
        {[
          { icon: "zap", label: item.power },
          { icon: "activity", label: item.speed },
          { icon: "layers", label: item.capacity },
        ].map((spec) => (
          <View key={spec.icon} style={[styles.specChip, { backgroundColor: isDark ? "#1E293B" : "#F1F5F9", borderColor: isDark ? "#334155" : "#E2E8F0" }]}>
            <Feather name={spec.icon as any} size={12} color={catColor} />
            <Text style={[styles.specText, { color: subColor, fontFamily: "Inter_400Regular" }]}>{spec.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.cardFooter}>
        <View>
          <Text style={[styles.priceLabel, { color: mutedColor, fontFamily: "Inter_400Regular" }]}>Starting from</Text>
          <Text style={[styles.price, { color: catColor, fontFamily: "Inter_700Bold" }]}>{item.price}</Text>
        </View>
        <LinearGradient colors={gradient} style={[styles.quoteBtn, BUTTON_SHADOW]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={[styles.quoteBtnText, { fontFamily: "Inter_600SemiBold" }]}>Get Quote</Text>
        </LinearGradient>
      </View>
    </AnimatedPressable>
  );
});

const CategoryChip = React.memo(function CategoryChip({
  item, isSelected, catColor, bgSecondary, borderColor, subColor, onPress,
}: {
  item: string; isSelected: boolean; catColor: string; bgSecondary: string; borderColor: string; subColor: string; onPress: () => void;
}) {
  const gradient = CATEGORY_GRADIENTS[item] || [catColor, catColor + "CC"];
  return (
    <AnimatedPressable onPress={onPress} scaleDown={0.92}>
      {isSelected ? (
        <LinearGradient colors={gradient} style={[styles.categoryChip, BUTTON_SHADOW]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={[styles.categoryChipText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>{item}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.categoryChip, { backgroundColor: bgSecondary, borderColor, borderWidth: 1 }]}>
          <Text style={[styles.categoryChipText, { color: subColor, fontFamily: "Inter_500Medium" }]}>{item}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
});

export default function CatalogScreen() {
  const { isDark, colors, topInset, bottomInset } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const debouncedSearch = useDebounce(search, 200);
  const searchLower = useMemo(() => debouncedSearch.toLowerCase(), [debouncedSearch]);

  const filtered = useMemo(
    () =>
      MACHINES.filter((m) => {
        if (selectedCategory !== "All" && m.category !== selectedCategory) return false;
        if (!searchLower) return true;
        return m.name.toLowerCase().includes(searchLower) || m.model.toLowerCase().includes(searchLower) || m.description.toLowerCase().includes(searchLower);
      }),
    [searchLower, selectedCategory]
  );

  const handleMachinePress = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/catalog/${id}` as any);
  }, []);

  const handleCategorySelect = useCallback((cat: string) => {
    Haptics.selectionAsync();
    setSelectedCategory(cat);
  }, []);

  const clearSearch = useCallback(() => setSearch(""), []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const renderMachine = useCallback(
    ({ item }: { item: Machine }) => (
      <MachineCard
        item={item} isDark={isDark}
        cardBg={colors.card} borderColor={colors.border} textColor={colors.text}
        subColor={colors.textSecondary} mutedColor={colors.textMuted}
        bgSecondary={colors.backgroundSecondary}
        onPress={() => handleMachinePress(item.id)}
      />
    ),
    [isDark, colors, handleMachinePress]
  );

  const listContentStyle = useMemo(
    () => ({ paddingHorizontal: 20, paddingTop: 4, paddingBottom: bottomInset + 20, gap: 14 }),
    [bottomInset]
  );

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={[styles.header, { paddingTop: topInset + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}
      >
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Machine Catalog</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{MACHINES.length} machines available</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
          <Feather name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text, fontFamily: "Inter_400Regular" }]}
            placeholder="Search machines..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <AnimatedPressable onPress={clearSearch} scaleDown={0.85}>
              <Feather name="x" size={16} color={colors.textMuted} />
            </AnimatedPressable>
          )}
        </View>
      </Animated.View>

      <View style={styles.catRow}>
        {(CATEGORIES as unknown as string[]).map((cat) => {
          const isSelected = selectedCategory === cat;
          const catColor = cat === "All" ? "#1A56DB" : CATEGORY_COLORS[cat] || "#1A56DB";
          return (
            <CategoryChip key={cat} item={cat} isSelected={isSelected} catColor={catColor} bgSecondary={colors.backgroundSecondary} borderColor={colors.border} subColor={colors.textSecondary} onPress={() => handleCategorySelect(cat)} />
          );
        })}
      </View>

      <View style={styles.flex}>
        <FlashList
          data={filtered}
          keyExtractor={(item: Machine) => item.id}
          renderItem={renderMachine}
          estimatedItemSize={260}
          contentContainerStyle={listContentStyle}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="package" size={40} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>No machines found</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  headerTitle: { fontSize: 26, marginBottom: 2 },
  headerSubtitle: { fontSize: 13, marginBottom: 14 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 11 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0 },
  catRow: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 22 },
  categoryChipText: { fontSize: 13 },
  machineCard: { borderRadius: 18, borderWidth: 1, padding: 18, gap: 10 },
  categoryBadge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  categoryBadgeText: { fontSize: 11, color: "#fff" },
  machineName: { fontSize: 17 },
  machineModel: { fontSize: 13, marginTop: -4 },
  machineDesc: { fontSize: 13, lineHeight: 19 },
  specsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  specChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  specText: { fontSize: 12 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  priceLabel: { fontSize: 11, marginBottom: 2 },
  price: { fontSize: 18 },
  quoteBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  quoteBtnText: { color: "#fff", fontSize: 13 },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 16, marginTop: 8 },
});
