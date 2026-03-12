import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import AnimatedPressable from "@/components/AnimatedPressable";
import { BUTTON_SHADOW } from "@/constants/shadows";

const AMC_PLANS = [
  {
    id: "basic",
    name: "Basic AMC",
    price: "₹15,000",
    period: "/year",
    color: "#64748B",
    popular: false,
    features: ["2 preventive maintenance visits", "Lubrication & cleaning service", "Phone & email support", "Machine health report", "Parts supplied at cost price"],
    notIncluded: ["Priority response", "Parts discount", "Emergency support"],
  },
  {
    id: "standard",
    name: "Standard AMC",
    price: "₹28,000",
    period: "/year",
    color: "#1A56DB",
    popular: true,
    features: ["4 preventive maintenance visits", "All Basic AMC services", "Priority phone support", "10% discount on spare parts", "Roller condition check", "Electrical system inspection"],
    notIncluded: ["24/7 support", "Emergency response"],
  },
  {
    id: "premium",
    name: "Premium AMC",
    price: "₹45,000",
    period: "/year",
    color: "#8B5CF6",
    popular: false,
    features: ["8 preventive maintenance visits", "All Standard AMC services", "24/7 emergency support", "20% discount on spare parts", "Free minor parts (up to ₹5,000)", "Same-day emergency response", "Operator training session", "Annual performance report"],
    notIncluded: [],
  },
] as const;

const spacer = { width: 38 } as const;

const PlanCard = React.memo(function PlanCard({
  plan, isSelected, cardBg, borderColor, textColor, mutedColor, onSelect,
}: {
  plan: typeof AMC_PLANS[number]; isSelected: boolean;
  cardBg: string; borderColor: string; textColor: string; mutedColor: string; onSelect: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.planCard, isSelected ? { borderColor: plan.color, borderWidth: 2, backgroundColor: plan.color + "08" } : { borderColor, borderWidth: 1, backgroundColor: cardBg }]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {plan.popular && (
        <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
          <Text style={[styles.popularBadgeText, { fontFamily: "Inter_600SemiBold" }]}>Most Popular</Text>
        </View>
      )}
      <View style={styles.planHeader}>
        <View>
          <Text style={[styles.planName, { color: textColor, fontFamily: "Inter_700Bold" }]}>{plan.name}</Text>
          <View style={styles.planPriceRow}>
            <Text style={[styles.planPrice, { color: plan.color, fontFamily: "Inter_700Bold" }]}>{plan.price}</Text>
            <Text style={[styles.planPeriod, { color: mutedColor, fontFamily: "Inter_400Regular" }]}>{plan.period}</Text>
          </View>
        </View>
        <View style={[styles.planRadio, isSelected ? { backgroundColor: plan.color, borderColor: plan.color } : { backgroundColor: "transparent", borderColor }]}>
          {isSelected && <Feather name="check" size={14} color="#fff" />}
        </View>
      </View>
      <View style={styles.planFeatures}>
        {plan.features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Feather name="check-circle" size={14} color={plan.color} />
            <Text style={[styles.featureText, { color: textColor, fontFamily: "Inter_400Regular" }]}>{f}</Text>
          </View>
        ))}
        {plan.notIncluded.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Feather name="x-circle" size={14} color={mutedColor} />
            <Text style={[styles.featureText, { color: mutedColor, fontFamily: "Inter_400Regular" }]}>{f}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
});

export default function AmcScreen() {
  const { colors, topInset, bottomInset } = useTheme();

  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [machineCount, setMachineCount] = useState("1");
  const [submitted, setSubmitted] = useState(false);

  const plan = useMemo(() => AMC_PLANS.find((p) => p.id === selectedPlan)!, [selectedPlan]);

  const handleClose = useCallback(() => router.back(), []);

  const handleSubmit = useCallback(() => {
    if (!name || !phone) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Missing Info", "Please fill in your name and phone number.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  }, [name, phone]);

  const headerEl = (
    <View style={[styles.header, { paddingTop: topInset + 12, borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={handleClose} style={[styles.closeBtn, { backgroundColor: colors.backgroundSecondary }]}>
        <Feather name="x" size={18} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>AMC Plans</Text>
      <View style={spacer} />
    </View>
  );

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {headerEl}
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: "#8B5CF618" }]}>
            <Feather name="shield" size={48} color="#8B5CF6" />
          </View>
          <Text style={[styles.successTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>AMC Enrolled!</Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>You've been enrolled in the {plan.name}. Our team will contact you to schedule your first visit.</Text>
          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: "#8B5CF6" }]} onPress={handleClose}>
            <Text style={[styles.doneBtnText, { fontFamily: "Inter_600SemiBold" }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {headerEl}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: bottomInset + 24, gap: 20 }} showsVerticalScrollIndicator={false}>
        {AMC_PLANS.map((p) => (
          <PlanCard key={p.id} plan={p} isSelected={selectedPlan === p.id} cardBg={colors.card} borderColor={colors.border} textColor={colors.text} mutedColor={colors.textMuted} onSelect={() => { setSelectedPlan(p.id); Haptics.selectionAsync(); }} />
        ))}

        <View style={[styles.formSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Enrollment Details</Text>
          <View style={{ gap: 14 }}>
            <View>
              <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Full Name *</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.textMuted} />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Phone *</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]} value={phone} onChangeText={setPhone} placeholder="+91 XXXXX XXXXX" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>No. of Machines</Text>
              <View style={styles.qtyRow}>
                {["1", "2", "3", "4", "5+"].map((q) => (
                  <TouchableOpacity key={q} style={[styles.qtyChip, machineCount === q ? { backgroundColor: "#8B5CF6", borderColor: "#8B5CF6" } : { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]} onPress={() => { setMachineCount(q); Haptics.selectionAsync(); }}>
                    <Text style={[styles.qtyChipText, { color: machineCount === q ? "#fff" : colors.text, fontFamily: "Inter_500Medium" }]}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <AnimatedPressable onPress={handleSubmit} scaleDown={0.98}>
          <LinearGradient colors={plan.id === "basic" ? ["#475569", "#64748B"] : plan.id === "standard" ? ["#1E40AF", "#3B82F6"] : ["#7C3AED", "#A78BFA"]} style={[styles.submitBtn, BUTTON_SHADOW]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Feather name="shield" size={18} color="#fff" />
            <Text style={[styles.submitBtnText, { fontFamily: "Inter_600SemiBold" }]}>Enroll in {plan.name}</Text>
          </LinearGradient>
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  closeBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17 },
  planCard: { borderRadius: 16, padding: 18, gap: 14 },
  popularBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 4 },
  popularBadgeText: { color: "#fff", fontSize: 11 },
  planHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  planName: { fontSize: 18, marginBottom: 4 },
  planPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  planPrice: { fontSize: 22 },
  planPeriod: { fontSize: 14 },
  planRadio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  planFeatures: { gap: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontSize: 13 },
  formSection: { borderRadius: 16, borderWidth: 1, padding: 18, gap: 16 },
  formTitle: { fontSize: 16 },
  label: { fontSize: 14, marginBottom: 8 },
  input: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  qtyRow: { flexDirection: "row", gap: 8 },
  qtyChip: { flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 10, borderWidth: 1 },
  qtyChipText: { fontSize: 14 },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 14, paddingVertical: 16 },
  submitBtnText: { color: "#fff", fontSize: 16 },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 16 },
  successIcon: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  successTitle: { fontSize: 24, textAlign: "center" },
  successSubtitle: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  doneBtn: { paddingHorizontal: 40, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  doneBtnText: { color: "#fff", fontSize: 16 },
});
