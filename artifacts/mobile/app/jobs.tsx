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
import { CARD_SHADOW, BUTTON_SHADOW, shadow3D } from "@/constants/shadows";
import { JOBS, SALARY_FILTERS, EXPERIENCE_FILTERS, DISTANCE_FILTERS } from "@/data/jobs";

export default function JobsScreen() {
  const { colors, topInset, bottomInset } = useTheme();

  const [search, setSearch] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("All");
  const [expFilter, setExpFilter] = useState("All");
  const [distFilter, setDistFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = useMemo(() => {
    return JOBS.filter((job) => {
      if (search && !job.title.toLowerCase().includes(search.toLowerCase()) && !job.company.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, salaryFilter, expFilter, distFilter]);

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
                  backgroundColor: selected === item ? "#1A56DB" : colors.card,
                  borderColor: selected === item ? "#1A56DB" : colors.border,
                },
              ]}
              scaleDown={0.95}
            >
              <Text
                style={[styles.filterChipText, { color: selected === item ? "#fff" : colors.text }]}
              >
                {item}
              </Text>
            </AnimatedPressable>
          ))}
        </ScrollView>
      </View>
    ),
    [colors]
  );

  const renderJob = useCallback(
    ({ item, index }: { item: typeof JOBS[0]; index: number }) => (
      <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
        <AnimatedPressable style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]} scaleDown={0.98}>
          <View style={styles.jobHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.jobTitleRow}>
                <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
                {item.isUrgent && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>Urgent</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.jobCompany, { color: colors.primary }]}>{item.company}</Text>
            </View>
          </View>

          <View style={styles.jobMeta}>
            <View style={styles.jobMetaItem}>
              <Feather name="map-pin" size={13} color={colors.textMuted} />
              <Text style={[styles.jobMetaText, { color: colors.textSecondary }]}>{item.location}</Text>
            </View>
            <View style={styles.jobMetaItem}>
              <Feather name="navigation" size={13} color="#10B981" />
              <Text style={[styles.jobMetaText, { color: "#10B981" }]}>{item.distance}</Text>
            </View>
          </View>

          <View style={styles.jobDetails}>
            <View style={[styles.jobDetailChip, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="cash-outline" size={13} color="#1A56DB" />
              <Text style={[styles.jobDetailText, { color: "#1A56DB" }]}>{item.salary}</Text>
            </View>
            <View style={[styles.jobDetailChip, { backgroundColor: "#F0FDF4" }]}>
              <Feather name="briefcase" size={13} color="#059669" />
              <Text style={[styles.jobDetailText, { color: "#059669" }]}>{item.experience}</Text>
            </View>
            <View style={[styles.jobDetailChip, { backgroundColor: "#FDF4FF" }]}>
              <Feather name="clock" size={13} color="#7C3AED" />
              <Text style={[styles.jobDetailText, { color: "#7C3AED" }]}>{item.type}</Text>
            </View>
          </View>

          <View style={styles.skillsRow}>
            {item.skills.map((skill) => (
              <View key={skill} style={[styles.skillTag, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.skillText, { color: colors.textSecondary }]}>{skill}</Text>
              </View>
            ))}
          </View>

          <View style={styles.jobFooter}>
            <Text style={[styles.postedDate, { color: colors.textMuted }]}>{item.postedDate}</Text>
            <AnimatedPressable scaleDown={0.95}>
              <LinearGradient colors={["#1E40AF", "#3B82F6"]} style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>Apply Now</Text>
              </LinearGradient>
            </AnimatedPressable>
          </View>
        </AnimatedPressable>
      </Animated.View>
    ),
    [colors]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0F172A", "#1E293B"]}
        style={[styles.header, { paddingTop: topInset + 12 }]}
      >
        <View style={styles.headerRow}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </AnimatedPressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Job Board</Text>
            <Text style={styles.headerSub}>{filteredJobs.length} jobs available near you</Text>
          </View>
          <AnimatedPressable onPress={() => setShowFilters(!showFilters)} style={styles.filterBtn}>
            <Feather name="sliders" size={20} color="#fff" />
          </AnimatedPressable>
        </View>

        <View style={styles.searchWrap}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, companies..."
            placeholderTextColor="#64748B"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </LinearGradient>

      {showFilters && (
        <Animated.View entering={FadeInDown.duration(300)} style={[styles.filtersPanel, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {renderFilterRow("Distance", DISTANCE_FILTERS, distFilter, setDistFilter)}
          {renderFilterRow("Salary", SALARY_FILTERS, salaryFilter, setSalaryFilter)}
          {renderFilterRow("Experience", EXPERIENCE_FILTERS, expFilter, setExpFilter)}
        </Animated.View>
      )}

      <FlatList
        data={filteredJobs}
        renderItem={renderJob}
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
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#F1F5F9" },
  headerSub: { fontSize: 13, color: "#94A3B8", marginTop: 2 },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#F1F5F9", fontWeight: "500" },
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
  jobCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  jobHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  jobTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  jobTitle: { fontSize: 16, fontWeight: "700" },
  urgentBadge: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgentText: { fontSize: 10, fontWeight: "700", color: "#EF4444" },
  jobCompany: { fontSize: 14, fontWeight: "600", marginTop: 2 },
  jobMeta: { flexDirection: "row", gap: 16, marginBottom: 10 },
  jobMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  jobMetaText: { fontSize: 12, fontWeight: "500" },
  jobDetails: { flexDirection: "row", gap: 8, marginBottom: 10, flexWrap: "wrap" },
  jobDetailChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  jobDetailText: { fontSize: 11, fontWeight: "600" },
  skillsRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 12 },
  skillTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  skillText: { fontSize: 11, fontWeight: "500" },
  jobFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  postedDate: { fontSize: 12, fontWeight: "500" },
  applyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  applyBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },
});
