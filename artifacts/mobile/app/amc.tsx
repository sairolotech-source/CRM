import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import Colors from "@/constants/colors";

const AMC_PLANS = [
  {
    id: "basic",
    name: "Basic AMC",
    price: "₹15,000",
    period: "/year",
    color: "#64748B",
    features: [
      "2 preventive maintenance visits",
      "Lubrication & cleaning service",
      "Phone & email support",
      "Machine health report",
      "Parts supplied at cost price",
    ],
    notIncluded: ["Priority response", "Parts discount", "Emergency support"],
  },
  {
    id: "standard",
    name: "Standard AMC",
    price: "₹28,000",
    period: "/year",
    color: "#1A56DB",
    popular: true,
    features: [
      "4 preventive maintenance visits",
      "All Basic AMC services",
      "Priority phone support",
      "10% discount on spare parts",
      "Roller condition check",
      "Electrical system inspection",
    ],
    notIncluded: ["24/7 support", "Emergency response"],
  },
  {
    id: "premium",
    name: "Premium AMC",
    price: "₹45,000",
    period: "/year",
    color: "#8B5CF6",
    features: [
      "8 preventive maintenance visits",
      "All Standard AMC services",
      "24/7 emergency support",
      "20% discount on spare parts",
      "Free minor parts (up to ₹5,000)",
      "Same-day emergency response",
      "Operator training session",
      "Annual performance report",
    ],
    notIncluded: [],
  },
];

export default function AmcScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [machineCount, setMachineCount] = useState("1");
  const [submitted, setSubmitted] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const plan = AMC_PLANS.find((p) => p.id === selectedPlan)!;

  const handleSubmit = () => {
    if (!name || !phone) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Missing Info", "Please fill in your name and phone number.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topInset + 12, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.backgroundSecondary }]}>
            <Feather name="x" size={18} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>AMC Plans</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: "#8B5CF618" }]}>
            <Feather name="shield" size={48} color="#8B5CF6" />
          </View>
          <Text style={[styles.successTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>AMC Enrolled!</Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            You've been enrolled in the {plan.name}. Our team will contact you to schedule your first visit.
          </Text>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: "#8B5CF6" }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.doneBtnText, { fontFamily: "Inter_600SemiBold" }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.backgroundSecondary }]}>
          <Feather name="x" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>AMC Plans</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 24,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan Cards */}
        {AMC_PLANS.map((p) => {
          const isSelected = selectedPlan === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.planCard,
                isSelected
                  ? { borderColor: p.color, borderWidth: 2, backgroundColor: p.color + "08" }
                  : { borderColor: colors.border, borderWidth: 1, backgroundColor: colors.card },
              ]}
              onPress={() => {
                setSelectedPlan(p.id);
                Haptics.selectionAsync();
              }}
              activeOpacity={0.8}
            >
              {(p as any).popular && (
                <View style={[styles.popularBadge, { backgroundColor: p.color }]}>
                  <Text style={[styles.popularBadgeText, { fontFamily: "Inter_600SemiBold" }]}>Most Popular</Text>
                </View>
              )}
              <View style={styles.planHeader}>
                <View>
                  <Text style={[styles.planName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                    {p.name}
                  </Text>
                  <View style={styles.planPriceRow}>
                    <Text style={[styles.planPrice, { color: p.color, fontFamily: "Inter_700Bold" }]}>
                      {p.price}
                    </Text>
                    <Text style={[styles.planPeriod, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>
                      {p.period}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.planRadio,
                    isSelected
                      ? { backgroundColor: p.color, borderColor: p.color }
                      : { backgroundColor: "transparent", borderColor: colors.border },
                  ]}
                >
                  {isSelected && <Feather name="check" size={14} color="#fff" />}
                </View>
              </View>

              <View style={styles.planFeatures}>
                {p.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="check-circle" size={14} color={p.color} />
                    <Text style={[styles.featureText, { color: colors.text, fontFamily: "Inter_400Regular" }]}>
                      {f}
                    </Text>
                  </View>
                ))}
                {p.notIncluded.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="x-circle" size={14} color={colors.textMuted} />
                    <Text style={[styles.featureText, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>
                      {f}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Contact Form */}
        <View style={[styles.formSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Enrollment Details
          </Text>

          <View style={{ gap: 14 }}>
            <View>
              <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Full Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Phone *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 XXXXX XXXXX"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
              />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>No. of Machines</Text>
              <View style={styles.qtyRow}>
                {["1", "2", "3", "4", "5+"].map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={[
                      styles.qtyChip,
                      machineCount === q
                        ? { backgroundColor: "#8B5CF6", borderColor: "#8B5CF6" }
                        : { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
                    ]}
                    onPress={() => { setMachineCount(q); Haptics.selectionAsync(); }}
                  >
                    <Text style={[styles.qtyChipText, { color: machineCount === q ? "#fff" : colors.text, fontFamily: "Inter_500Medium" }]}>
                      {q}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: plan.color }]}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Feather name="shield" size={18} color="#fff" />
          <Text style={[styles.submitBtnText, { fontFamily: "Inter_600SemiBold" }]}>
            Enroll in {plan.name}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17 },
  planCard: {
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  popularBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  popularBadgeText: { color: "#fff", fontSize: 11 },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  planName: { fontSize: 18, marginBottom: 4 },
  planPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  planPrice: { fontSize: 22 },
  planPeriod: { fontSize: 14 },
  planRadio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  planFeatures: { gap: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontSize: 13 },
  formSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 16,
  },
  formTitle: { fontSize: 16 },
  label: { fontSize: 14, marginBottom: 8 },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  qtyRow: { flexDirection: "row", gap: 8 },
  qtyChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  qtyChipText: { fontSize: 14 },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
  },
  submitBtnText: { color: "#fff", fontSize: 16 },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  successTitle: { fontSize: 24, textAlign: "center" },
  successSubtitle: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  doneBtn: { paddingHorizontal: 40, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  doneBtnText: { color: "#fff", fontSize: 16 },
});
