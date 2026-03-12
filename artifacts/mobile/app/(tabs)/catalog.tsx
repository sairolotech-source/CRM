import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import Colors from "@/constants/colors";

const CATEGORIES = [
  "All",
  "Rolling Shutter",
  "False Ceiling",
  "Door & Window",
  "Roofing & Cladding",
  "Structural",
  "Solar & Infrastructure",
  "Drywall & Partition",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Rolling Shutter": "#1A56DB",
  "False Ceiling": "#10B981",
  "Door & Window": "#F59E0B",
  "Roofing & Cladding": "#64748B",
  "Structural": "#8B5CF6",
  "Solar & Infrastructure": "#0EA5E9",
  "Drywall & Partition": "#EF4444",
};

const MACHINES = [
  {
    id: "1",
    name: "Rolling Shutter Machine",
    model: "RS-5000",
    category: "Rolling Shutter",
    capacity: "2-4 tons/hr",
    power: "15 kW",
    speed: "25 m/min",
    price: "₹12-18 Lakhs",
    description: "High-speed rolling shutter patti making machine with automatic stacking",
    tags: ["High Speed", "Auto Stack", "ISO Certified"],
  },
  {
    id: "2",
    name: "T-Grid Ceiling Machine",
    model: "TG-3000",
    category: "False Ceiling",
    capacity: "1.5-2 tons/hr",
    power: "11 kW",
    speed: "20 m/min",
    price: "₹8-12 Lakhs",
    description: "T-Grid false ceiling section making machine for commercial projects",
    tags: ["Precision", "Low Noise"],
  },
  {
    id: "3",
    name: "C-Purlin Machine",
    model: "CP-8000",
    category: "Structural",
    capacity: "3-5 tons/hr",
    power: "22 kW",
    speed: "30 m/min",
    price: "₹20-28 Lakhs",
    description: "Heavy-duty C-Purlin roll forming machine for structural applications",
    tags: ["Heavy Duty", "PLC Control", "Auto Change"],
  },
  {
    id: "4",
    name: "Trapezoidal Sheet Machine",
    model: "TR-6000",
    category: "Roofing & Cladding",
    capacity: "4-6 tons/hr",
    power: "18 kW",
    speed: "35 m/min",
    price: "₹15-22 Lakhs",
    description: "Trapezoidal roofing sheet forming machine with auto cutter",
    tags: ["High Speed", "Auto Cut"],
  },
  {
    id: "5",
    name: "Door Frame Machine",
    model: "DF-4000",
    category: "Door & Window",
    capacity: "1-2 tons/hr",
    power: "9 kW",
    speed: "15 m/min",
    price: "₹6-10 Lakhs",
    description: "Steel door frame roll forming machine with punch holes",
    tags: ["Compact", "Energy Saver"],
  },
  {
    id: "6",
    name: "Solar Channel Machine",
    model: "SC-2000",
    category: "Solar & Infrastructure",
    capacity: "2-3 tons/hr",
    power: "13 kW",
    speed: "22 m/min",
    price: "₹10-16 Lakhs",
    description: "Solar mounting structure channel forming machine for renewable energy",
    tags: ["Solar Ready", "PLC"],
  },
  {
    id: "7",
    name: "Stud & Track Machine",
    model: "ST-3500",
    category: "Drywall & Partition",
    capacity: "1.5-2.5 tons/hr",
    power: "10 kW",
    speed: "18 m/min",
    price: "₹7-11 Lakhs",
    description: "Light gauge steel stud and track forming machine for drywall partitions",
    tags: ["Lightweight", "Fast Setup"],
  },
  {
    id: "8",
    name: "Z-Purlin Machine",
    model: "ZP-7000",
    category: "Structural",
    capacity: "3-4 tons/hr",
    power: "20 kW",
    speed: "28 m/min",
    price: "₹18-25 Lakhs",
    description: "Heavy-duty Z-Purlin roll forming machine with adjustable size",
    tags: ["Adjustable", "Heavy Duty"],
  },
];

type MachineCardProps = {
  item: (typeof MACHINES)[0];
  isDark: boolean;
  onPress: () => void;
};

function MachineCard({ item, isDark, onPress }: MachineCardProps) {
  const colors = isDark ? Colors.dark : Colors.light;
  const catColor = CATEGORY_COLORS[item.category] || "#1A56DB";

  return (
    <TouchableOpacity
      style={[styles.machineCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Category Badge */}
      <View style={[styles.categoryBadge, { backgroundColor: catColor + "18" }]}>
        <Text style={[styles.categoryBadgeText, { color: catColor, fontFamily: "Inter_500Medium" }]}>
          {item.category}
        </Text>
      </View>

      <Text style={[styles.machineName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
        {item.name}
      </Text>
      <Text style={[styles.machineModel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
        Model: {item.model}
      </Text>
      <Text style={[styles.machineDesc, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Specs Row */}
      <View style={styles.specsRow}>
        {[
          { icon: "zap", label: item.power },
          { icon: "activity", label: item.speed },
          { icon: "layers", label: item.capacity },
        ].map((spec) => (
          <View
            key={spec.icon}
            style={[styles.specChip, { backgroundColor: colors.backgroundSecondary }]}
          >
            <Feather name={spec.icon as any} size={12} color={colors.textMuted} />
            <Text style={[styles.specText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {spec.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Price & CTA */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>
            Starting from
          </Text>
          <Text style={[styles.price, { color: catColor, fontFamily: "Inter_700Bold" }]}>
            {item.price}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.quoteBtn, { backgroundColor: catColor }]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Text style={[styles.quoteBtnText, { fontFamily: "Inter_600SemiBold" }]}>
            Get Quote
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const filtered = MACHINES.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.model.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "All" || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleMachinePress = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/catalog/${id}` as any);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topInset + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          Machine Catalog
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
          {MACHINES.length} machines available
        </Text>

        {/* Search */}
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text, fontFamily: "Inter_400Regular" }]}
            placeholder="Search machines..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
        renderItem={({ item }) => {
          const isSelected = selectedCategory === item;
          const catColor = item === "All" ? "#1A56DB" : CATEGORY_COLORS[item] || "#1A56DB";
          return (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                isSelected
                  ? { backgroundColor: catColor }
                  : { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, borderWidth: 1 },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(item);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color: isSelected ? "#fff" : colors.textSecondary,
                    fontFamily: "Inter_500Medium",
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Machine List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MachineCard
            item={item}
            isDark={isDark}
            onPress={() => handleMachinePress(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="package" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
              No machines found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 26,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  categoryChipText: {
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 14,
    paddingTop: 4,
  },
  machineCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
  },
  machineName: {
    fontSize: 17,
  },
  machineModel: {
    fontSize: 13,
    marginTop: -4,
  },
  machineDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  specsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  specChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  specText: {
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
  },
  quoteBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  quoteBtnText: {
    color: "#fff",
    fontSize: 13,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 10,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 13,
  },
});
