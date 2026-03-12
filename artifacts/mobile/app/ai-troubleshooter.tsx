import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useTheme } from "@/hooks/useTheme";
import { CARD_SHADOW } from "@/constants/shadows";
import {
  TROUBLESHOOTING_DATA,
  MAINTENANCE_SCHEDULE,
  findTroubleshootingSolutions,
  type TroubleshootingItem,
} from "@/data/troubleshooting";

const QUICK_PROBLEMS = [
  "Sheet bending",
  "Unusual noise",
  "Oil leaking",
  "Not starting",
  "Wrong dimensions",
  "Cutting issue",
  "Surface scratch",
  "Slow speed",
];

export default function AITroubleshooterScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TroubleshootingItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);

  const handleSearch = useCallback(
    (searchQuery?: string) => {
      const q = searchQuery || query;
      if (!q.trim()) return;
      const found = findTroubleshootingSolutions(q);
      setResults(found);
      setSearched(true);
    },
    [query]
  );

  const handleQuickProblem = useCallback(
    (problem: string) => {
      setQuery(problem);
      const found = findTroubleshootingSolutions(problem);
      setResults(found);
      setSearched(true);
    },
    []
  );

  const urgencyColors: Record<string, { color: string; bg: string }> = {
    Critical: { color: "#DC2626", bg: "#FEF2F2" },
    High: { color: "#D97706", bg: "#FEF3C7" },
    Medium: { color: "#1A56DB", bg: "#EFF6FF" },
    Low: { color: "#059669", bg: "#F0FDF4" },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#DC2626", "#EF4444"]} style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View style={styles.headerRow}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </AnimatedPressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>AI Problem Finder</Text>
            <Text style={styles.headerSub}>Describe your machine problem</Text>
          </View>
          <AnimatedPressable onPress={() => setShowMaintenance(!showMaintenance)} scaleDown={0.9}>
            <View style={styles.maintenanceBtn}>
              <Feather name="calendar" size={16} color="#fff" />
            </View>
          </AnimatedPressable>
        </View>

        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="e.g. sheet bend ho rahi hai..."
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <AnimatedPressable onPress={() => { setQuery(""); setSearched(false); setResults([]); }}>
              <Feather name="x" size={18} color="#94A3B8" />
            </AnimatedPressable>
          )}
          <AnimatedPressable onPress={() => handleSearch()} scaleDown={0.9}>
            <View style={styles.searchBtn}>
              <Feather name="cpu" size={16} color="#fff" />
            </View>
          </AnimatedPressable>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomInset + 20 }]} showsVerticalScrollIndicator={false}>
        {showMaintenance && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <View style={[styles.maintenanceCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
              <View style={styles.maintenanceHeader}>
                <Feather name="calendar" size={16} color="#1A56DB" />
                <Text style={[styles.maintenanceTitle, { color: colors.text }]}>Maintenance Schedule</Text>
              </View>
              {MAINTENANCE_SCHEDULE.map((item, i) => (
                <View key={i} style={[styles.maintenanceRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.maintenanceIcon, { backgroundColor: "#EFF6FF" }]}>
                    <Feather name={item.icon as any} size={14} color="#1A56DB" />
                  </View>
                  <Text style={[styles.maintenanceTask, { color: colors.text }]} numberOfLines={1}>{item.task}</Text>
                  <View style={[styles.freqBadge, { backgroundColor: "#F0FDF4" }]}>
                    <Text style={styles.freqText}>{item.frequency}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {!searched && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>COMMON PROBLEMS</Text>
            <View style={styles.quickGrid}>
              {QUICK_PROBLEMS.map((problem) => (
                <AnimatedPressable
                  key={problem}
                  onPress={() => handleQuickProblem(problem)}
                  style={[styles.quickChip, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}
                  scaleDown={0.95}
                >
                  <Feather name="alert-circle" size={14} color="#EF4444" />
                  <Text style={[styles.quickText, { color: colors.text }]}>{problem}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </>
        )}

        {searched && results.length === 0 && (
          <View style={styles.noResults}>
            <Feather name="search" size={48} color={colors.textMuted} />
            <Text style={[styles.noResultsText, { color: colors.textMuted }]}>No matching problems found</Text>
            <Text style={[styles.noResultsSub, { color: colors.textMuted }]}>Try different keywords or contact support</Text>
          </View>
        )}

        {results.map((item, idx) => {
          const urgency = urgencyColors[item.urgency];
          return (
            <Animated.View key={item.id} entering={FadeInDown.delay(idx * 100).duration(400)}>
              <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
                <View style={styles.resultHeader}>
                  <View style={[styles.urgencyBadge, { backgroundColor: urgency.bg }]}>
                    <Feather name="alert-triangle" size={12} color={urgency.color} />
                    <Text style={[styles.urgencyText, { color: urgency.color }]}>{item.urgency}</Text>
                  </View>
                  <View style={styles.machineRow}>
                    {item.machineTypes.slice(0, 3).map((m) => (
                      <View key={m} style={[styles.machineTag, { backgroundColor: "#EFF6FF" }]}>
                        <Text style={styles.machineTagText}>{m}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={[styles.problemTitle, { color: colors.text }]}>{item.problem}</Text>

                <Text style={[styles.subTitle, { color: "#EF4444" }]}>Possible Causes</Text>
                {item.possibleCauses.map((cause, i) => (
                  <View key={i} style={styles.causeRow}>
                    <View style={[styles.likelihoodDot, {
                      backgroundColor: cause.likelihood === "High" ? "#EF4444" : cause.likelihood === "Medium" ? "#F59E0B" : "#6B7280",
                    }]} />
                    <Text style={[styles.causeText, { color: colors.text }]}>{cause.cause}</Text>
                    <Text style={[styles.likelihoodText, {
                      color: cause.likelihood === "High" ? "#EF4444" : cause.likelihood === "Medium" ? "#F59E0B" : "#6B7280",
                    }]}>{cause.likelihood}</Text>
                  </View>
                ))}

                <Text style={[styles.subTitle, { color: "#059669" }]}>Solutions</Text>
                {item.solutions.map((sol, i) => (
                  <View key={i} style={styles.solutionRow}>
                    <View style={[styles.solutionNum, { backgroundColor: "#F0FDF4" }]}>
                      <Text style={styles.solutionNumText}>{i + 1}</Text>
                    </View>
                    <Text style={[styles.solutionText, { color: colors.text }]}>{sol}</Text>
                  </View>
                ))}

                <View style={[styles.preventiveBar, { backgroundColor: "#EFF6FF" }]}>
                  <Feather name="shield" size={14} color="#1A56DB" />
                  <Text style={styles.preventiveText}>{item.preventiveMeasure}</Text>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  maintenanceBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: "#0F172A", paddingVertical: 12 },
  searchBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#DC2626", alignItems: "center", justifyContent: "center" },
  scroll: { padding: 16 },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1.2, marginBottom: 10, marginTop: 4 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  quickText: { fontSize: 13, fontWeight: "600" },
  noResults: { alignItems: "center", paddingTop: 60, gap: 8 },
  noResultsText: { fontSize: 16, fontWeight: "600" },
  noResultsSub: { fontSize: 13 },
  resultCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 14 },
  resultHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  urgencyBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  urgencyText: { fontSize: 11, fontWeight: "700" },
  machineRow: { flexDirection: "row", gap: 4 },
  machineTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  machineTagText: { fontSize: 9, fontWeight: "700", color: "#1A56DB" },
  problemTitle: { fontSize: 16, fontWeight: "800", marginBottom: 12 },
  subTitle: { fontSize: 13, fontWeight: "700", marginTop: 10, marginBottom: 6 },
  causeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  likelihoodDot: { width: 6, height: 6, borderRadius: 3 },
  causeText: { fontSize: 13, flex: 1, lineHeight: 18 },
  likelihoodText: { fontSize: 10, fontWeight: "700" },
  solutionRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  solutionNum: { width: 22, height: 22, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  solutionNumText: { fontSize: 11, fontWeight: "700", color: "#059669" },
  solutionText: { fontSize: 13, flex: 1, lineHeight: 18 },
  preventiveBar: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, marginTop: 10 },
  preventiveText: { fontSize: 12, color: "#1E40AF", flex: 1, lineHeight: 17 },
  maintenanceCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 16 },
  maintenanceHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  maintenanceTitle: { fontSize: 16, fontWeight: "700" },
  maintenanceRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, borderBottomWidth: 1 },
  maintenanceIcon: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  maintenanceTask: { fontSize: 12, flex: 1 },
  freqBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  freqText: { fontSize: 10, fontWeight: "700", color: "#059669" },
});
