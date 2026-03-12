import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useTheme } from "@/hooks/useTheme";
import { BUTTON_SHADOW, CARD_SHADOW } from "@/constants/shadows";
import { LEAD_SOURCES, URGENCY_OPTIONS, qualifyLead, type LeadSource } from "@/data/leads";
import { MACHINE_TYPES } from "@/data/machines";

export default function AddLeadScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [source, setSource] = useState<LeadSource>("DirectCall");
  const [machineInterest, setMachineInterest] = useState("");
  const [budget, setBudget] = useState("");
  const [urgency, setUrgency] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [leadQuality, setLeadQuality] = useState("");

  const handleSubmit = useCallback(() => {
    if (!name.trim() || !phone.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Missing Info", "Name and Phone are required.");
      return;
    }
    const quality = qualifyLead(budget, urgency, source);
    setLeadQuality(quality);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  }, [name, phone, budget, urgency, source]);

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topInset + 12, borderBottomColor: colors.border }]}>
          <AnimatedPressable onPress={() => router.back()}>
            <Text style={[styles.cancelBtn, { color: colors.textMuted }]}>Close</Text>
          </AnimatedPressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Add Lead</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={styles.successContainer}>
          <LinearGradient
            colors={leadQuality === "Hot" ? ["#DC2626", "#EF4444"] : leadQuality === "Warm" ? ["#D97706", "#F59E0B"] : ["#6B7280", "#9CA3AF"]}
            style={styles.successIcon}
          >
            <Feather name={leadQuality === "Hot" ? "trending-up" : leadQuality === "Warm" ? "sun" : "cloud"} size={36} color="#fff" />
          </LinearGradient>
          <Text style={[styles.successTitle, { color: colors.text }]}>Lead Added!</Text>
          <Text style={[styles.successQuality, { color: leadQuality === "Hot" ? "#EF4444" : leadQuality === "Warm" ? "#F59E0B" : "#6B7280" }]}>
            AI Qualification: {leadQuality} Lead {leadQuality === "Hot" ? "🔥" : leadQuality === "Warm" ? "☀️" : "❄️"}
          </Text>
          <Text style={[styles.successSub, { color: colors.textSecondary }]}>
            {leadQuality === "Hot"
              ? "High priority! Contact within 1 hour for best conversion."
              : leadQuality === "Warm"
                ? "Good prospect. Schedule follow-up within 24 hours."
                : "Low priority. Add to nurture campaign."}
          </Text>
          <AnimatedPressable onPress={() => router.back()} scaleDown={0.98}>
            <LinearGradient colors={["#1E40AF", "#3B82F6"]} style={styles.doneBtn}>
              <Text style={styles.doneBtnText}>Go to Dashboard</Text>
            </LinearGradient>
          </AnimatedPressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={[styles.header, { paddingTop: topInset + 12, borderBottomColor: colors.border }]}>
          <AnimatedPressable onPress={() => router.back()}>
            <Text style={[styles.cancelBtn, { color: colors.textMuted }]}>Cancel</Text>
          </AnimatedPressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Add Lead</Text>
          <AnimatedPressable onPress={handleSubmit}>
            <LinearGradient colors={["#1E40AF", "#3B82F6"]} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save</Text>
            </LinearGradient>
          </AnimatedPressable>
        </View>

        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomInset + 20 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>LEAD SOURCE</Text>
          <View style={styles.sourceGrid}>
            {LEAD_SOURCES.map((s) => (
              <AnimatedPressable
                key={s.key}
                onPress={() => setSource(s.key)}
                style={[styles.sourceChip, { backgroundColor: source === s.key ? s.bg : colors.card, borderColor: source === s.key ? s.color : colors.border, borderWidth: source === s.key ? 2 : 1 }]}
                scaleDown={0.95}
              >
                <Feather name={s.icon as any} size={14} color={source === s.key ? s.color : colors.textMuted} />
                <Text style={[styles.sourceLabel, { color: source === s.key ? s.color : colors.text }]}>{s.label}</Text>
              </AnimatedPressable>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>CONTACT INFO</Text>
          <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
              <Feather name="user" size={16} color={colors.textMuted} />
              <TextInput style={[styles.input, { color: colors.text }]} placeholder="Full Name *" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
            </View>
            <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
              <Feather name="phone" size={16} color={colors.textMuted} />
              <TextInput style={[styles.input, { color: colors.text }]} placeholder="Phone Number *" placeholderTextColor={colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>
            <View style={styles.inputRow}>
              <Feather name="map-pin" size={16} color={colors.textMuted} />
              <TextInput style={[styles.input, { color: colors.text }]} placeholder="City" placeholderTextColor={colors.textMuted} value={city} onChangeText={setCity} />
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>MACHINE INTEREST</Text>
          <View style={styles.tagsWrap}>
            {MACHINE_TYPES.filter((t) => t !== "Other").map((m) => (
              <AnimatedPressable
                key={m}
                onPress={() => setMachineInterest(machineInterest === m ? "" : m)}
                style={[styles.machineChip, { backgroundColor: machineInterest === m ? "#EFF6FF" : colors.card, borderColor: machineInterest === m ? "#1A56DB" : colors.border }]}
                scaleDown={0.95}
              >
                <Text style={[styles.machineText, { color: machineInterest === m ? "#1A56DB" : colors.text }]}>{m}</Text>
              </AnimatedPressable>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>BUDGET (OPTIONAL)</Text>
          <View style={[styles.singleInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="dollar-sign" size={16} color={colors.textMuted} />
            <TextInput style={[styles.input, { color: colors.text }]} placeholder="e.g. ₹8,00,000" placeholderTextColor={colors.textMuted} value={budget} onChangeText={setBudget} keyboardType="numeric" />
          </View>

          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>URGENCY</Text>
          <View style={styles.urgencyRow}>
            {URGENCY_OPTIONS.map((u) => (
              <AnimatedPressable
                key={u.key}
                onPress={() => setUrgency(urgency === u.key ? "" : u.key)}
                style={[styles.urgencyChip, { backgroundColor: urgency === u.key ? u.color : colors.card, borderColor: urgency === u.key ? u.color : colors.border }]}
                scaleDown={0.95}
              >
                <Text style={[styles.urgencyText, { color: urgency === u.key ? "#fff" : colors.text }]}>{u.label}</Text>
              </AnimatedPressable>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>NOTES</Text>
          <View style={[styles.singleInput, { backgroundColor: colors.card, borderColor: colors.border, minHeight: 80 }]}>
            <TextInput style={[styles.input, { color: colors.text, textAlignVertical: "top" }]} placeholder="Any notes about this lead..." placeholderTextColor={colors.textMuted} value={notes} onChangeText={setNotes} multiline />
          </View>

          <View style={[styles.aiHint, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}>
            <Feather name="cpu" size={14} color="#1A56DB" />
            <Text style={styles.aiHintText}>AI will automatically qualify this lead as Hot/Warm/Cold based on budget, urgency, and source.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  cancelBtn: { fontSize: 15, fontWeight: "500" },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  saveBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10 },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  scroll: { padding: 16 },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1.2, marginBottom: 10, marginTop: 12 },
  sourceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  sourceChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10 },
  sourceLabel: { fontSize: 12, fontWeight: "600" },
  inputGroup: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  inputRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 10, borderBottomWidth: 1 },
  input: { flex: 1, fontSize: 15, paddingVertical: 13 },
  singleInput: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 14, gap: 10, borderRadius: 14, borderWidth: 1, paddingTop: 13 },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  machineChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  machineText: { fontSize: 12, fontWeight: "600" },
  urgencyRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  urgencyChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1 },
  urgencyText: { fontSize: 12, fontWeight: "600" },
  aiHint: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, marginTop: 16 },
  aiHintText: { fontSize: 12, color: "#1E40AF", flex: 1, lineHeight: 18 },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 12 },
  successIcon: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  successTitle: { fontSize: 24, fontWeight: "800" },
  successQuality: { fontSize: 18, fontWeight: "700" },
  successSub: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  doneBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, marginTop: 12 },
  doneBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
