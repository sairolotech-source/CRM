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

const CATEGORIES = [
  { id: "technical", label: "Technical Issue", icon: "settings", color: "#1A56DB" },
  { id: "service", label: "Service Quality", icon: "tool", color: "#10B981" },
  { id: "billing", label: "Billing Query", icon: "credit-card", color: "#F59E0B" },
  { id: "parts", label: "Spare Parts", icon: "package", color: "#8B5CF6" },
  { id: "training", label: "Training", icon: "book", color: "#0EA5E9" },
  { id: "other", label: "Other", icon: "help-circle", color: "#64748B" },
];

export default function SupportTicketScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const handleSubmit = () => {
    if (!name || !phone || !category || !subject || !description) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  };

  if (submitted) {
    const ticketNo = `TKT-${Date.now().toString().slice(-6)}`;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topInset + 12, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.backgroundSecondary }]}>
            <Feather name="x" size={18} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Support Ticket</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: "#EF444418" }]}>
            <Feather name="check-circle" size={48} color="#EF4444" />
          </View>
          <Text style={[styles.successTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Ticket Raised!
          </Text>
          <View style={[styles.ticketNoCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
            <Text style={[styles.ticketNoLabel, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>
              Ticket Number
            </Text>
            <Text style={[styles.ticketNo, { color: "#EF4444", fontFamily: "Inter_700Bold" }]}>
              {ticketNo}
            </Text>
          </View>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Our support team will respond within 24-48 hours. Please keep your ticket number handy.
          </Text>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: "#EF4444" }]}
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
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Support Ticket</Text>
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
        {/* Category */}
        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
            Category *
          </Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  category === cat.id
                    ? { backgroundColor: cat.color, borderColor: cat.color }
                    : { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
                ]}
                onPress={() => {
                  setCategory(cat.id);
                  Haptics.selectionAsync();
                }}
              >
                <Feather
                  name={cat.icon as any}
                  size={16}
                  color={category === cat.id ? "#fff" : cat.color}
                />
                <Text style={[styles.categoryChipText, { color: category === cat.id ? "#fff" : colors.text, fontFamily: "Inter_500Medium" }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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

        {/* Email */}
        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Subject */}
        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Subject *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
            value={subject}
            onChangeText={setSubject}
            placeholder="Brief summary of your issue"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Description */}
        <View>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_500Medium" }]}>Description *</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your issue in detail. Include machine model, error codes, and steps already taken..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: "#EF4444" }]}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Feather name="send" size={18} color="#fff" />
          <Text style={[styles.submitBtnText, { fontFamily: "Inter_600SemiBold" }]}>Submit Ticket</Text>
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
    minHeight: 120,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  categoryChipText: { fontSize: 13 },
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
  ticketNoCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: "center",
    gap: 4,
  },
  ticketNoLabel: { fontSize: 12 },
  ticketNo: { fontSize: 22 },
  successSubtitle: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  doneBtn: { paddingHorizontal: 40, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  doneBtnText: { color: "#fff", fontSize: 16 },
});
