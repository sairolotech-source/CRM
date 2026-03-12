import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { MACHINE_TYPES } from "@/data/machines";

const ISSUE_TYPES = [
  "Routine Maintenance",
  "Breakdown Repair",
  "Roller Replacement",
  "Electrical Issue",
  "Hydraulic Issue",
  "PLC/Control Panel",
  "Alignment Problem",
  "Other",
] as const;

const PRIORITY_OPTIONS = [
  { value: "normal", label: "Normal", color: "#10B981", desc: "Within 2-3 days" },
  { value: "urgent", label: "Urgent", color: "#F59E0B", desc: "Within 24 hours" },
  { value: "emergency", label: "Emergency", color: "#EF4444", desc: "Same day" },
] as const;

const spacer = { width: 38 } as const;

export default function ServiceRequestScreen() {
  const { colors, topInset, bottomInset } = useTheme();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [machineType, setMachineType] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");
  const [submitted, setSubmitted] = useState(false);
  const [showMachineTypes, setShowMachineTypes] = useState(false);
  const [showIssueTypes, setShowIssueTypes] = useState(false);

  const handleClose = useCallback(() => router.back(), []);

  const handleSubmit = useCallback(() => {
    if (!name || !phone || !machineType || !issueType) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  }, [name, phone, machineType, issueType]);

  const headerEl = (
    <View style={[styles.modalHeader, { paddingTop: topInset + 12, borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={handleClose} style={[styles.closeBtn, { backgroundColor: colors.backgroundSecondary }]}>
        <Feather name="x" size={18} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.modalTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Service Request</Text>
      <View style={spacer} />
    </View>
  );

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {headerEl}
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: "#10B98120" }]}>
            <Feather name="check-circle" size={48} color="#10B981" />
          </View>
          <Text style={[styles.successTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Request Submitted!</Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Our team will contact you within {priority === "emergency" ? "2-4 hours" : priority === "urgent" ? "24 hours" : "2-3 business days"}.
          </Text>
          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: "#10B981" }]} onPress={handleClose}>
            <Text style={[styles.doneBtnText, { fontFamily: "Inter_600SemiBold" }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {headerEl}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: bottomInset + 24, gap: 16 }} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Priority *</Text>
          <View style={styles.priorityRow}>
            {PRIORITY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.priorityChip, priority === opt.value ? { backgroundColor: opt.color, borderColor: opt.color } : { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                onPress={() => { Haptics.selectionAsync(); setPriority(opt.value); }}
              >
                <Text style={[styles.priorityLabel, { color: priority === opt.value ? "#fff" : colors.text, fontFamily: "Inter_600SemiBold" }]}>{opt.label}</Text>
                <Text style={[styles.priorityDesc, { color: priority === opt.value ? "rgba(255,255,255,0.8)" : colors.textMuted, fontFamily: "Inter_400Regular" }]}>{opt.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Full Name *</Text>
          <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]} value={name} onChangeText={setName} placeholder="Enter your name" placeholderTextColor={colors.textMuted} />
        </View>

        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Phone Number *</Text>
          <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]} value={phone} onChangeText={setPhone} placeholder="+91 XXXXX XXXXX" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />
        </View>

        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>City</Text>
          <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]} value={city} onChangeText={setCity} placeholder="Your city" placeholderTextColor={colors.textMuted} />
        </View>

        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Machine Type *</Text>
          <TouchableOpacity style={[styles.selectBtn, { backgroundColor: colors.backgroundSecondary, borderColor: machineType ? "#10B981" : colors.border }]} onPress={() => setShowMachineTypes(!showMachineTypes)}>
            <Text style={[styles.selectBtnText, { color: machineType ? colors.text : colors.textMuted, fontFamily: "Inter_400Regular" }]}>{machineType || "Select machine type"}</Text>
            <Feather name={showMachineTypes ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
          </TouchableOpacity>
          {showMachineTypes && (
            <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {MACHINE_TYPES.map((type) => (
                <TouchableOpacity key={type} style={[styles.dropdownItem, { borderBottomColor: colors.border }]} onPress={() => { setMachineType(type); setShowMachineTypes(false); Haptics.selectionAsync(); }}>
                  <Text style={[styles.dropdownItemText, { color: colors.text, fontFamily: "Inter_400Regular" }]}>{type}</Text>
                  {machineType === type && <Feather name="check" size={16} color="#10B981" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Issue Type *</Text>
          <TouchableOpacity style={[styles.selectBtn, { backgroundColor: colors.backgroundSecondary, borderColor: issueType ? "#10B981" : colors.border }]} onPress={() => setShowIssueTypes(!showIssueTypes)}>
            <Text style={[styles.selectBtnText, { color: issueType ? colors.text : colors.textMuted, fontFamily: "Inter_400Regular" }]}>{issueType || "Select issue type"}</Text>
            <Feather name={showIssueTypes ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
          </TouchableOpacity>
          {showIssueTypes && (
            <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {ISSUE_TYPES.map((type) => (
                <TouchableOpacity key={type} style={[styles.dropdownItem, { borderBottomColor: colors.border }]} onPress={() => { setIssueType(type); setShowIssueTypes(false); Haptics.selectionAsync(); }}>
                  <Text style={[styles.dropdownItemText, { color: colors.text, fontFamily: "Inter_400Regular" }]}>{type}</Text>
                  {issueType === type && <Feather name="check" size={16} color="#10B981" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Description</Text>
          <TextInput style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]} value={description} onChangeText={setDescription} placeholder="Describe the issue in detail..." placeholderTextColor={colors.textMuted} multiline numberOfLines={4} textAlignVertical="top" />
        </View>

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: "#10B981" }]} onPress={handleSubmit} activeOpacity={0.85}>
          <Feather name="send" size={18} color="#fff" />
          <Text style={[styles.submitBtnText, { fontFamily: "Inter_600SemiBold" }]}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  closeBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  modalTitle: { fontSize: 17 },
  label: { fontSize: 14, marginBottom: 8 },
  input: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  textArea: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, minHeight: 100 },
  priorityRow: { flexDirection: "row", gap: 8 },
  priorityChip: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: "center", gap: 4 },
  priorityLabel: { fontSize: 14 },
  priorityDesc: { fontSize: 11 },
  selectBtn: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  selectBtnText: { fontSize: 15, flex: 1 },
  dropdown: { borderRadius: 10, borderWidth: 1, marginTop: 6, overflow: "hidden" },
  dropdownItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  dropdownItemText: { fontSize: 14 },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 14, paddingVertical: 16, marginTop: 8 },
  submitBtnText: { color: "#fff", fontSize: 16 },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 16 },
  successIcon: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  successTitle: { fontSize: 24, textAlign: "center" },
  successSubtitle: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  doneBtn: { paddingHorizontal: 40, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  doneBtnText: { color: "#fff", fontSize: 16 },
});
