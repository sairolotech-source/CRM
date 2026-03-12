import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useTheme } from "@/hooks/useTheme";
import { CARD_SHADOW, BUTTON_SHADOW } from "@/constants/shadows";
import {
  SAMPLE_LEADS,
  LEAD_SOURCES,
  LEAD_STATUSES,
  LEAD_QUALITIES,
  type Lead,
  type LeadStatus,
  type LeadQuality,
} from "@/data/leads";

const { width: SW } = Dimensions.get("window");

export default function LeadsScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const [leads] = useState(SAMPLE_LEADS);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [qualityFilter, setQualityFilter] = useState<LeadQuality | "All">("All");

  const stats = useMemo(() => {
    const hot = leads.filter((l) => l.quality === "Hot").length;
    const warm = leads.filter((l) => l.quality === "Warm").length;
    const newLeads = leads.filter((l) => l.status === "New").length;
    const converted = leads.filter((l) => l.status === "Converted").length;
    const followUp = leads.filter((l) => l.status === "FollowUp").length;
    return { total: leads.length, hot, warm, newLeads, converted, followUp };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let result = leads;
    if (statusFilter !== "All") result = result.filter((l) => l.status === statusFilter);
    if (qualityFilter !== "All") result = result.filter((l) => l.quality === qualityFilter);
    return result;
  }, [leads, statusFilter, qualityFilter]);

  const getSourceInfo = useCallback((source: string) => {
    return LEAD_SOURCES.find((s) => s.key === source) || LEAD_SOURCES[0];
  }, []);

  const getStatusInfo = useCallback((status: string) => {
    return LEAD_STATUSES.find((s) => s.key === status) || LEAD_STATUSES[0];
  }, []);

  const getQualityInfo = useCallback((quality: string) => {
    return LEAD_QUALITIES.find((q) => q.key === quality) || LEAD_QUALITIES[2];
  }, []);

  const handleCall = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
  }, []);

  const handleWhatsApp = useCallback((phone: string) => {
    const num = phone.replace(/[^\d]/g, "");
    Linking.openURL(`https://wa.me/${num}`);
  }, []);

  const renderLead = useCallback(
    ({ item, index }: { item: Lead; index: number }) => {
      const sourceInfo = getSourceInfo(item.source);
      const statusInfo = getStatusInfo(item.status);
      const qualityInfo = getQualityInfo(item.quality);

      return (
        <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
          <View style={[styles.leadCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
            <View style={styles.leadHeader}>
              <LinearGradient
                colors={item.quality === "Hot" ? ["#DC2626", "#EF4444"] : item.quality === "Warm" ? ["#D97706", "#F59E0B"] : ["#6B7280", "#9CA3AF"]}
                style={styles.leadAvatar}
              >
                <Text style={styles.leadAvatarText}>
                  {item.name.split(" ").map((n) => n[0]).join("")}
                </Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={[styles.leadName, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={[styles.qualityBadge, { backgroundColor: qualityInfo.bg }]}>
                    <Feather name={qualityInfo.icon as any} size={10} color={qualityInfo.color} />
                    <Text style={[styles.qualityText, { color: qualityInfo.color }]}>
                      {qualityInfo.label}
                    </Text>
                  </View>
                </View>
                <View style={styles.leadMeta}>
                  <Feather name="map-pin" size={11} color={colors.textMuted} />
                  <Text style={[styles.leadCity, { color: colors.textMuted }]}>{item.city}</Text>
                  <Text style={[styles.leadTime, { color: colors.textMuted }]}>• {item.createdAt}</Text>
                </View>
              </View>
            </View>

            <View style={styles.leadDetails}>
              <View style={[styles.detailRow]}>
                <Feather name="package" size={13} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{item.machineInterest}</Text>
              </View>
              {item.budget && (
                <View style={styles.detailRow}>
                  <Feather name="dollar-sign" size={13} color={colors.textSecondary} />
                  <Text style={[styles.detailText, { color: colors.text }]}>Budget: {item.budget}</Text>
                </View>
              )}
              {item.notes && (
                <View style={styles.detailRow}>
                  <Feather name="file-text" size={13} color={colors.textSecondary} />
                  <Text style={[styles.detailText, { color: colors.textMuted }]} numberOfLines={1}>{item.notes}</Text>
                </View>
              )}
            </View>

            <View style={[styles.leadFooter, { borderTopColor: colors.border }]}>
              <View style={styles.badgeRow}>
                <View style={[styles.sourceBadge, { backgroundColor: sourceInfo.bg }]}>
                  <Feather name={sourceInfo.icon as any} size={10} color={sourceInfo.color} />
                  <Text style={[styles.sourceText, { color: sourceInfo.color }]}>{sourceInfo.label}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                  <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                </View>
              </View>
              <View style={styles.actionRow}>
                <AnimatedPressable onPress={() => handleCall(item.phone)} scaleDown={0.9}>
                  <View style={[styles.actionIcon, { backgroundColor: "#F0FDF4" }]}>
                    <Feather name="phone" size={14} color="#059669" />
                  </View>
                </AnimatedPressable>
                <AnimatedPressable onPress={() => handleWhatsApp(item.phone)} scaleDown={0.9}>
                  <View style={[styles.actionIcon, { backgroundColor: "#F0FDF4" }]}>
                    <Ionicons name="logo-whatsapp" size={14} color="#25D366" />
                  </View>
                </AnimatedPressable>
              </View>
            </View>

            {item.nextFollowUp && (
              <View style={[styles.followUpBar, { backgroundColor: "#FFFBEB", borderTopColor: "#FDE68A" }]}>
                <Feather name="clock" size={12} color="#D97706" />
                <Text style={styles.followUpText}>Next follow-up: {item.nextFollowUp}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      );
    },
    [colors, getSourceInfo, getStatusInfo, getQualityInfo, handleCall, handleWhatsApp]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#0F172A", "#1E293B"]} style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View style={styles.headerRow}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </AnimatedPressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Lead Dashboard</Text>
            <Text style={styles.headerSub}>{stats.total} total leads</Text>
          </View>
          <AnimatedPressable onPress={() => router.push("/add-lead" as any)} scaleDown={0.9}>
            <LinearGradient colors={["#1E40AF", "#3B82F6"]} style={styles.addBtn}>
              <Feather name="plus" size={18} color="#fff" />
            </LinearGradient>
          </AnimatedPressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
          {[
            { label: "Hot 🔥", value: stats.hot, gradient: ["#DC2626", "#EF4444"] as [string, string] },
            { label: "Warm", value: stats.warm, gradient: ["#D97706", "#F59E0B"] as [string, string] },
            { label: "New", value: stats.newLeads, gradient: ["#1E40AF", "#3B82F6"] as [string, string] },
            { label: "Follow Up", value: stats.followUp, gradient: ["#7C3AED", "#8B5CF6"] as [string, string] },
            { label: "Converted", value: stats.converted, gradient: ["#059669", "#10B981"] as [string, string] },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <LinearGradient colors={stat.gradient} style={styles.statDot} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}>
          <AnimatedPressable
            onPress={() => setQualityFilter("All")}
            style={[styles.filterChip, { backgroundColor: qualityFilter === "All" ? "#1A56DB" : colors.card, borderColor: qualityFilter === "All" ? "#1A56DB" : colors.border }]}
            scaleDown={0.95}
          >
            <Text style={[styles.filterText, { color: qualityFilter === "All" ? "#fff" : colors.text }]}>All</Text>
          </AnimatedPressable>
          {LEAD_QUALITIES.map((q) => (
            <AnimatedPressable
              key={q.key}
              onPress={() => setQualityFilter(qualityFilter === q.key ? "All" : q.key)}
              style={[styles.filterChip, { backgroundColor: qualityFilter === q.key ? q.color : colors.card, borderColor: qualityFilter === q.key ? q.color : colors.border }]}
              scaleDown={0.95}
            >
              <Text style={[styles.filterText, { color: qualityFilter === q.key ? "#fff" : colors.text }]}>{q.label}</Text>
            </AnimatedPressable>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 6, marginTop: 6 }}>
          {LEAD_STATUSES.map((s) => (
            <AnimatedPressable
              key={s.key}
              onPress={() => setStatusFilter(statusFilter === s.key ? "All" : s.key)}
              style={[styles.filterChip, { backgroundColor: statusFilter === s.key ? s.color : colors.card, borderColor: statusFilter === s.key ? s.color : colors.border }]}
              scaleDown={0.95}
            >
              <Text style={[styles.filterText, { color: statusFilter === s.key ? "#fff" : colors.text }]}>{s.label}</Text>
            </AnimatedPressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredLeads}
        renderItem={renderLead}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomInset + 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No leads match filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#F1F5F9" },
  headerSub: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  addBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statsRow: { gap: 12 },
  statCard: { alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, minWidth: 70 },
  statDot: { width: 8, height: 8, borderRadius: 4 },
  statValue: { fontSize: 20, fontWeight: "800", color: "#F1F5F9" },
  statLabel: { fontSize: 10, fontWeight: "600", color: "#94A3B8" },
  filtersSection: { paddingVertical: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 12, fontWeight: "600" },
  leadCard: { borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: "hidden" },
  leadHeader: { flexDirection: "row", alignItems: "center", padding: 14, paddingBottom: 8 },
  leadAvatar: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 10 },
  leadAvatarText: { fontSize: 14, fontWeight: "800", color: "#fff" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  leadName: { fontSize: 15, fontWeight: "700", flex: 1 },
  qualityBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  qualityText: { fontSize: 10, fontWeight: "700" },
  leadMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  leadCity: { fontSize: 11 },
  leadTime: { fontSize: 11 },
  leadDetails: { paddingHorizontal: 14, gap: 4, paddingBottom: 10 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { fontSize: 13 },
  leadFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
  badgeRow: { flexDirection: "row", gap: 6 },
  sourceBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  sourceText: { fontSize: 10, fontWeight: "700" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: "700" },
  actionRow: { flexDirection: "row", gap: 8 },
  actionIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  followUpBar: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1 },
  followUpText: { fontSize: 11, fontWeight: "600", color: "#D97706" },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontWeight: "500" },
});
