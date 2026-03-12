import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useTheme } from "@/hooks/useTheme";
import { CARD_SHADOW, BUTTON_SHADOW } from "@/constants/shadows";
import { JOB_APPLICANTS, SALARY_FILTERS, EXPERIENCE_FILTERS, DISTANCE_FILTERS } from "@/data/jobs";
import type { JobApplicant } from "@/data/jobs";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  New: { bg: "#EFF6FF", text: "#1A56DB" },
  Shortlisted: { bg: "#F0FDF4", text: "#059669" },
  Interview: { bg: "#FDF4FF", text: "#7C3AED" },
  Rejected: { bg: "#FEF2F2", text: "#EF4444" },
};

export default function HiringScreen() {
  const { colors, topInset, bottomInset } = useTheme();

  const [search, setSearch] = useState("");
  const [distFilter, setDistFilter] = useState("All");
  const [salaryFilter, setSalaryFilter] = useState("All");
  const [expFilter, setExpFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApplicants = useMemo(() => {
    return JOB_APPLICANTS.filter((a) => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))) return false;
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      return true;
    });
  }, [search, statusFilter, distFilter, salaryFilter, expFilter]);

  const stats = useMemo(() => ({
    total: JOB_APPLICANTS.length,
    newCount: JOB_APPLICANTS.filter((a) => a.status === "New").length,
    shortlisted: JOB_APPLICANTS.filter((a) => a.status === "Shortlisted").length,
    interview: JOB_APPLICANTS.filter((a) => a.status === "Interview").length,
  }), []);

  const renderFilterRow = useCallback(
    (label: string, items: string[], selected: string, onSelect: (v: string) => void) => (
      <View style={styles.filterGroup}>
        <Text style={[styles.filterLabel, { color: colors.textMuted }]}>{label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item) => (
            <AnimatedPressable
              key={item}
              onPress={() => onSelect(item)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selected === item ? "#DC2626" : colors.card,
                  borderColor: selected === item ? "#DC2626" : colors.border,
                },
              ]}
              scaleDown={0.95}
            >
              <Text style={[styles.filterChipText, { color: selected === item ? "#fff" : colors.text }]}>
                {item}
              </Text>
            </AnimatedPressable>
          ))}
        </ScrollView>
      </View>
    ),
    [colors]
  );

  const renderApplicant = useCallback(
    ({ item, index }: { item: JobApplicant; index: number }) => {
      const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS.New;
      return (
        <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
          <AnimatedPressable
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}
            scaleDown={0.98}
          >
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={["#0F172A", "#1E293B"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {item.name.split(" ").map((n) => n[0]).join("")}
                </Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.cardEdu, { color: colors.textSecondary }]}>{item.education}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <Feather name="map-pin" size={13} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.location}</Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="navigation" size={13} color="#10B981" />
                <Text style={[styles.metaText, { color: "#10B981" }]}>{item.distance}</Text>
              </View>
            </View>

            <View style={styles.cardDetails}>
              <View style={[styles.detailChip, { backgroundColor: "#EFF6FF" }]}>
                <Feather name="briefcase" size={12} color="#1A56DB" />
                <Text style={[styles.detailText, { color: "#1A56DB" }]}>{item.experience}</Text>
              </View>
              <View style={[styles.detailChip, { backgroundColor: "#F0FDF4" }]}>
                <Ionicons name="cash-outline" size={12} color="#059669" />
                <Text style={[styles.detailText, { color: "#059669" }]}>{item.expectedSalary}</Text>
              </View>
            </View>

            <View style={styles.skillsRow}>
              {item.skills.map((skill) => (
                <View key={skill} style={[styles.skillTag, { backgroundColor: colors.backgroundSecondary }]}>
                  <Text style={[styles.skillText, { color: colors.textSecondary }]}>{skill}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <Text style={[styles.appliedDate, { color: colors.textMuted }]}>Applied {item.appliedDate}</Text>
              <View style={styles.actionBtns}>
                <AnimatedPressable scaleDown={0.9}>
                  <View style={[styles.iconBtn, { backgroundColor: "#FEF2F2" }]}>
                    <Feather name="x" size={16} color="#EF4444" />
                  </View>
                </AnimatedPressable>
                <AnimatedPressable scaleDown={0.9}>
                  <View style={[styles.iconBtn, { backgroundColor: "#EFF6FF" }]}>
                    <Feather name="phone" size={16} color="#1A56DB" />
                  </View>
                </AnimatedPressable>
                <AnimatedPressable scaleDown={0.9}>
                  <LinearGradient colors={["#059669", "#10B981"]} style={styles.shortlistBtn}>
                    <Feather name="check" size={14} color="#fff" />
                    <Text style={styles.shortlistText}>Shortlist</Text>
                  </LinearGradient>
                </AnimatedPressable>
              </View>
            </View>
          </AnimatedPressable>
        </Animated.View>
      );
    },
    [colors]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#7F1D1D", "#DC2626"]}
        style={[styles.header, { paddingTop: topInset + 12 }]}
      >
        <View style={styles.headerRow}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </AnimatedPressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Hiring Dashboard</Text>
            <Text style={styles.headerSub}>Manage job applicants</Text>
          </View>
          <AnimatedPressable onPress={() => setShowFilters(!showFilters)} style={styles.filterBtn}>
            <Feather name="sliders" size={20} color="#fff" />
          </AnimatedPressable>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: "Total", value: stats.total, color: "#FBBF24" },
            { label: "New", value: stats.newCount, color: "#60A5FA" },
            { label: "Shortlisted", value: stats.shortlisted, color: "#34D399" },
            { label: "Interview", value: stats.interview, color: "#A78BFA" },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.searchWrap}>
          <Feather name="search" size={18} color="#FCA5A5" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, skills..."
            placeholderTextColor="#FCA5A5"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </LinearGradient>

      <View style={styles.statusFilterRow}>
        {["All", "New", "Shortlisted", "Interview", "Rejected"].map((s) => (
          <AnimatedPressable
            key={s}
            onPress={() => setStatusFilter(s)}
            style={[
              styles.statusFilterChip,
              {
                backgroundColor: statusFilter === s ? (STATUS_COLORS[s]?.bg || "#EFF6FF") : "transparent",
                borderColor: statusFilter === s ? (STATUS_COLORS[s]?.text || "#1A56DB") : colors.border,
              },
            ]}
            scaleDown={0.95}
          >
            <Text
              style={[
                styles.statusFilterText,
                { color: statusFilter === s ? (STATUS_COLORS[s]?.text || "#1A56DB") : colors.textMuted },
              ]}
            >
              {s}
            </Text>
          </AnimatedPressable>
        ))}
      </View>

      {showFilters && (
        <Animated.View entering={FadeInDown.duration(300)} style={[styles.filtersPanel, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {renderFilterRow("Nearby", DISTANCE_FILTERS, distFilter, setDistFilter)}
          {renderFilterRow("Expected Salary", SALARY_FILTERS, salaryFilter, setSalaryFilter)}
          {renderFilterRow("Experience", EXPERIENCE_FILTERS, expFilter, setExpFilter)}
        </Animated.View>
      )}

      <FlatList
        data={filteredApplicants}
        renderItem={renderApplicant}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomInset + 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#FEF2F2" },
  headerSub: { fontSize: 13, color: "#FCA5A5", marginTop: 2 },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 10, fontWeight: "600", color: "#FCA5A5", marginTop: 2 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#FEF2F2", fontWeight: "500" },
  statusFilterRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusFilterText: { fontSize: 12, fontWeight: "600" },
  filtersPanel: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  filterGroup: { marginBottom: 8 },
  filterLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 6 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: { fontSize: 12, fontWeight: "600" },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 16, fontWeight: "800", color: "#F1F5F9" },
  cardName: { fontSize: 16, fontWeight: "700" },
  cardEdu: { fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "700" },
  cardMeta: { flexDirection: "row", gap: 16, marginBottom: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontWeight: "500" },
  cardDetails: { flexDirection: "row", gap: 8, marginBottom: 10 },
  detailChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  detailText: { fontSize: 11, fontWeight: "600" },
  skillsRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 12 },
  skillTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  skillText: { fontSize: 11, fontWeight: "500" },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  appliedDate: { fontSize: 12, fontWeight: "500" },
  actionBtns: { flexDirection: "row", gap: 8, alignItems: "center" },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  shortlistBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  shortlistText: { fontSize: 12, fontWeight: "700", color: "#fff" },
});
