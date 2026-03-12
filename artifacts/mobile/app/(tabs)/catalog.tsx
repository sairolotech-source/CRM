import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { MACHINES, CATEGORIES, CATEGORY_COLORS, type Machine } from "@/data/machines";

const MachineCard = React.memo(function MachineCard({
  item,
  isDark,
  cardBg,
  borderColor,
  textColor,
  subColor,
  mutedColor,
  bgSecondary,
  onPress,
}: {
  item: Machine;
  isDark: boolean;
  cardBg: string;
  borderColor: string;
  textColor: string;
  subColor: string;
  mutedColor: string;
  bgSecondary: string;
  onPress: () => void;
}) {
  const catColor = CATEGORY_COLORS[item.category] || "#1A56DB";

  return (
    <TouchableOpacity style={[styles.machineCard, { backgroundColor: cardBg, borderColor }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.categoryBadge, { backgroundColor: catColor + "18" }]}>
        <Text style={[styles.categoryBadgeText, { color: catColor, fontFamily: "Inter_500Medium" }]}>{item.category}</Text>
      </View>
      <Text style={[styles.machineName, { color: textColor, fontFamily: "Inter_700Bold" }]}>{item.name}</Text>
      <Text style={[styles.machineModel, { color: subColor, fontFamily: "Inter_400Regular" }]}>Model: {item.model}</Text>
      <Text style={[styles.machineDesc, { color: subColor, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>{item.description}</Text>
      <View style={styles.specsRow}>
        {[
          { icon: "zap", label: item.power },
          { icon: "activity", label: item.speed },
          { icon: "layers", label: item.capacity },
        ].map((spec) => (
          <View key={spec.icon} style={[styles.specChip, { backgroundColor: bgSecondary }]}>
            <Feather name={spec.icon as any} size={12} color={mutedColor} />
            <Text style={[styles.specText, { color: subColor, fontFamily: "Inter_400Regular" }]}>{spec.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.cardFooter}>
        <View>
          <Text style={[styles.priceLabel, { color: mutedColor, fontFamily: "Inter_400Regular" }]}>Starting from</Text>
          <Text style={[styles.price, { color: catColor, fontFamily: "Inter_700Bold" }]}>{item.price}</Text>
        </View>
        <TouchableOpacity style={[styles.quoteBtn, { backgroundColor: catColor }]} onPress={onPress} activeOpacity={0.85}>
          <Text style={[styles.quoteBtnText, { fontFamily: "Inter_600SemiBold" }]}>Get Quote</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const CategoryChip = React.memo(function CategoryChip({
  item,
  isSelected,
  catColor,
  bgSecondary,
  borderColor,
  subColor,
  onPress,
}: {
  item: string;
  isSelected: boolean;
  catColor: string;
  bgSecondary: string;
  borderColor: string;
  subColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        isSelected
          ? { backgroundColor: catColor }
          : { backgroundColor: bgSecondary, borderColor, borderWidth: 1 },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.categoryChipText, { color: isSelected ? "#fff" : subColor, fontFamily: "Inter_500Medium" }]}>{item}</Text>
    </TouchableOpacity>
  );
});

const keyExtractor = (item: Machine) => item.id;
const catKeyExtractor = (item: string) => item;

export default function CatalogScreen() {
  const { isDark, colors, topInset, bottomInset } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const searchLower = useMemo(() => search.toLowerCase(), [search]);

  const filtered = useMemo(
    () =>
      MACHINES.filter((m) => {
        if (selectedCategory !== "All" && m.category !== selectedCategory) return false;
        if (!searchLower) return true;
        return (
          m.name.toLowerCase().includes(searchLower) ||
          m.model.toLowerCase().includes(searchLower) ||
          m.description.toLowerCase().includes(searchLower)
        );
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

  const renderMachine = useCallback(
    ({ item }: { item: Machine }) => (
      <MachineCard
        item={item}
        isDark={isDark}
        cardBg={colors.card}
        borderColor={colors.border}
        textColor={colors.text}
        subColor={colors.textSecondary}
        mutedColor={colors.textMuted}
        bgSecondary={colors.backgroundSecondary}
        onPress={() => handleMachinePress(item.id)}
      />
    ),
    [isDark, colors, handleMachinePress]
  );

  const renderCategory = useCallback(
    ({ item }: { item: string }) => {
      const isSelected = selectedCategory === item;
      const catColor = item === "All" ? "#1A56DB" : CATEGORY_COLORS[item] || "#1A56DB";
      return (
        <CategoryChip
          item={item}
          isSelected={isSelected}
          catColor={catColor}
          bgSecondary={colors.backgroundSecondary}
          borderColor={colors.border}
          subColor={colors.textSecondary}
          onPress={() => handleCategorySelect(item)}
        />
      );
    },
    [selectedCategory, colors, handleCategorySelect]
  );

  const listContentStyle = useMemo(
    () => [styles.listContent, { paddingBottom: bottomInset + 20 }],
    [bottomInset]
  );

  const emptyComponent = useMemo(
    () => (
      <View style={styles.emptyState}>
        <Feather name="package" size={40} color={colors.textMuted} />
        <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>No machines found</Text>
        <Text style={[styles.emptySubtext, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>Try adjusting your search or filters</Text>
      </View>
    ),
    [colors]
  );

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Machine Catalog</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{MACHINES.length} machines available</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text, fontFamily: "Inter_400Regular" }]}
            placeholder="Search machines..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Feather name="x" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        horizontal
        data={CATEGORIES as unknown as string[]}
        keyExtractor={catKeyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
        renderItem={renderCategory}
      />

      <FlatList
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderMachine}
        contentContainerStyle={listContentStyle}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={4}
        windowSize={5}
        initialNumToRender={3}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={emptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  headerTitle: { fontSize: 26, marginBottom: 2 },
  headerSubtitle: { fontSize: 13, marginBottom: 14 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0 },
  categoriesScroll: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  categoryChipText: { fontSize: 13 },
  listContent: { paddingHorizontal: 20, gap: 14, paddingTop: 4 },
  machineCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  categoryBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryBadgeText: { fontSize: 11 },
  machineName: { fontSize: 17 },
  machineModel: { fontSize: 13, marginTop: -4 },
  machineDesc: { fontSize: 13, lineHeight: 19 },
  specsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  specChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  specText: { fontSize: 12 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  priceLabel: { fontSize: 11, marginBottom: 2 },
  price: { fontSize: 18 },
  quoteBtn: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10 },
  quoteBtnText: { color: "#fff", fontSize: 13 },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 16, marginTop: 8 },
  emptySubtext: { fontSize: 13 },
});
