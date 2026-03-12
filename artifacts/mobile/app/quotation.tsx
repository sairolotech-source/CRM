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

const MACHINE_OPTIONS = [
  "Rolling Shutter Machine",
  "T-Grid Ceiling Machine",
  "C-Purlin Machine",
  "Trapezoidal Sheet Machine",
  "Door Frame Machine",
  "Solar Channel Machine",
  "Stud & Track Machine",
  "Z-Purlin Machine",
  "Custom / Not Listed",
];

const FINANCE_OPTIONS = [
  { value: "own", label: "Own Funds" },
  { value: "loan", label: "Bank Loan" },
  { value: "installment", label: "Installment" },
];

export default function QuotationScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [machine, setMachine] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [finance, setFinance] = useState("own");
  const [requirements, setRequirements] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showMachines, setShowMachines] = useState(false);
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const handleSubmit = () => {
    if (!name || !phone || !machine) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Missing Info", "Please fill in name, phone and machine type.");
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
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Get Quotation</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: "#F59E0B18" }]}>
            <Feather name="file-text" size={48} color="#F59E0B" />
          </View>
          <Text style={[styles.successTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Quote Requested!
          </Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Our sales team will prepare a detailed quotation and contact you within 24 hours.
          </Text>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: "#F59E0B" }]}
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
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Get Quotation</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 24,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Machine Type */}
        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
            Machine Type *
          </Text>
          <TouchableOpacity
            style={[styles.selectBtn, { backgroundColor: colors.backgroundSecondary, borderColor: machine ? "#F59E0B" : colors.border }]}
            onPress={() => setShowMachines(!showMachines)}
          >
            <Text style={[{ color: machine ? colors.text : colors.textMuted, fontFamily: "Inter_400Regular", flex: 1, fontSize: 15 }]}>
              {machine || "Select machine"}
            </Text>
            <Feather name={showMachines ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
          </TouchableOpacity>
          {showMachines && (
            <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {MACHINE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.dropdownItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    setMachine(opt);
                    setShowMachines(false);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[{ color: colors.text, fontFamily: "Inter_400Regular", fontSize: 14 }]}>{opt}</Text>
                  {machine === opt && <Feather name="check" size={16} color="#F59E0B" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Name */}
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

        {/* Phone */}
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

        {/* City */}
        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>City</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
            value={city}
            onChangeText={setCity}
            placeholder="Your city"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Quantity */}
        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Quantity</Text>
          <View style={styles.qtyRow}>
            {["1", "2", "3", "5", "10+"].map((q) => (
              <TouchableOpacity
                key={q}
                style={[
                  styles.qtyChip,
                  quantity === q
                    ? { backgroundColor: "#F59E0B", borderColor: "#F59E0B" }
                    : { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
                ]}
                onPress={() => { setQuantity(q); Haptics.selectionAsync(); }}
              >
                <Text style={[styles.qtyChipText, { color: quantity === q ? "#fff" : colors.text, fontFamily: "Inter_500Medium" }]}>
                  {q}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Finance */}
        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Finance Preference</Text>
          <View style={styles.financeRow}>
            {FINANCE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.financeChip,
                  finance === opt.value
                    ? { backgroundColor: "#F59E0B", borderColor: "#F59E0B" }
                    : { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
                ]}
                onPress={() => { setFinance(opt.value); Haptics.selectionAsync(); }}
              >
                <Text style={[styles.financeChipText, { color: finance === opt.value ? "#fff" : colors.text, fontFamily: "Inter_500Medium" }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Requirements */}
        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Special Requirements</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
            value={requirements}
            onChangeText={setRequirements}
            placeholder="Any specific requirements, configurations, or questions..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: "#F59E0B" }]}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Feather name="file-text" size={18} color="#fff" />
          <Text style={[styles.submitBtnText, { fontFamily: "Inter_600SemiBold" }]}>Request Quotation</Text>
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
  label: { fontSize: 14, marginBottom: 8 },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 100,
  },
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdown: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  qtyRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  qtyChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  qtyChipText: { fontSize: 14 },
  financeRow: { flexDirection: "row", gap: 8 },
  financeChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
  },
  financeChipText: { fontSize: 13 },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
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
