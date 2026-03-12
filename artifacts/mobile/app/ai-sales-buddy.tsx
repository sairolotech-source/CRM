import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useTheme } from "@/hooks/useTheme";
import { CARD_SHADOW } from "@/constants/shadows";
import { MACHINES } from "@/data/machines";

interface Message {
  id: string;
  type: "bot" | "user" | "suggestion" | "price" | "lead_captured";
  text: string;
  options?: string[];
  machine?: typeof MACHINES[0];
  priceRange?: string;
}

const MACHINE_CATEGORIES: Record<string, string[]> = {
  "Roofing Sheet": ["RS-5000"],
  "False Ceiling / T-Grid": ["TG-3000"],
  "C-Purlin / Z-Purlin": ["CP-8000", "ZP-7000"],
  "Trapezoidal Sheet": ["TR-6000"],
  "Door Frame": ["DF-4000"],
  "Solar Channel": ["SC-2000"],
  "Stud & Track": ["ST-3500"],
  "Rolling Shutter": ["RS-5000"],
};

const THICKNESS_OPTIONS = ["0.3 – 0.5 mm", "0.5 – 0.8 mm", "0.8 – 1.2 mm", "1.2 – 2.0 mm", "2.0+ mm"];
const BUDGET_OPTIONS = ["Under ₹5 Lakh", "₹5 – ₹10 Lakh", "₹10 – ₹15 Lakh", "₹15 – ₹25 Lakh", "₹25 Lakh+"];
const CAPACITY_OPTIONS = ["5-10 m/min", "10-20 m/min", "20-30 m/min", "30+ m/min"];

type ChatStep = "welcome" | "machine_type" | "thickness" | "capacity" | "budget" | "location" | "suggestion" | "captured";

export default function AISalesBuddyScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<ChatStep>("welcome");
  const [userInput, setUserInput] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [selectedThickness, setSelectedThickness] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const addBotMessage = useCallback((text: string, options?: string[]) => {
    setTimeout(() => {
      addMessage({ id: `bot-${Date.now()}`, type: "bot", text, options });
    }, 500);
  }, [addMessage]);

  useEffect(() => {
    addMessage({
      id: "welcome-1",
      type: "bot",
      text: "Welcome to SAI ROLOTECH! 🏭\nI'm your AI Sales Assistant. I'll help you find the perfect roll forming machine.",
    });
    setTimeout(() => {
      addMessage({
        id: "welcome-2",
        type: "bot",
        text: "What type of machine are you looking for?",
        options: Object.keys(MACHINE_CATEGORIES),
      });
      setStep("machine_type");
    }, 800);
  }, []);

  const handleOptionSelect = useCallback(
    (option: string) => {
      Haptics.selectionAsync();
      addMessage({ id: `user-${Date.now()}`, type: "user", text: option });

      switch (step) {
        case "machine_type":
          setSelectedMachine(option);
          setStep("thickness");
          addBotMessage("What sheet thickness will you be working with?", THICKNESS_OPTIONS);
          break;

        case "thickness":
          setSelectedThickness(option);
          setStep("capacity");
          addBotMessage("What production speed do you need?", CAPACITY_OPTIONS);
          break;

        case "capacity":
          setSelectedCapacity(option);
          setStep("budget");
          addBotMessage("What is your approximate budget?", BUDGET_OPTIONS);
          break;

        case "budget":
          setSelectedBudget(option);
          setStep("location");
          addBotMessage("Which city/state are you located in? (Type below)");
          break;

        default:
          break;
      }
    },
    [step, addMessage, addBotMessage]
  );

  const handleSendLocation = useCallback(() => {
    if (!userInput.trim()) return;
    const location = userInput.trim();
    setSelectedLocation(location);
    setUserInput("");
    addMessage({ id: `user-${Date.now()}`, type: "user", text: location });

    const machineIds = MACHINE_CATEGORIES[selectedMachine] || [];
    const machine = MACHINES.find((m) => machineIds.includes(m.model));

    if (!machine) {
      setTimeout(() => {
        addMessage({
          id: `no-match-${Date.now()}`,
          type: "bot",
          text: `We couldn't find an exact match for "${selectedMachine}" in our catalog. Our sales team will prepare a custom recommendation for you. They'll contact you within 2 hours.`,
        });
        setStep("captured");
        addMessage({
          id: `captured-${Date.now()}`,
          type: "lead_captured",
          text: "Your inquiry has been captured! Our team will reach out with tailored options.",
        });
      }, 600);
      return;
    }

    setTimeout(() => {
      addMessage({
        id: `suggestion-${Date.now()}`,
        type: "suggestion",
        text: `Based on your requirements, I recommend:`,
        machine: machine,
        priceRange: selectedBudget,
      });

      setTimeout(() => {
        addMessage({
          id: `price-${Date.now()}`,
          type: "price",
          text: `💰 Estimated Price Range: ${machine?.price || "₹5,00,000 – ₹15,00,000"}\n\n📊 Production: ${selectedCapacity}\n📐 Thickness: ${selectedThickness}\n📍 Installation: ${location}\n\n✅ Includes: Installation + Training + 1 Year Warranty`,
        });

        setTimeout(() => {
          setStep("captured");
          addMessage({
            id: `captured-${Date.now()}`,
            type: "lead_captured",
            text: "Your inquiry has been captured! Our sales team will contact you within 2 hours with a detailed quotation.",
          });
        }, 800);
      }, 800);
    }, 600);
  }, [userInput, selectedMachine, selectedCapacity, selectedThickness, selectedBudget, addMessage]);

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      if (item.type === "user") {
        return (
          <Animated.View entering={FadeInUp.duration(300)} style={styles.userMsgWrap}>
            <LinearGradient colors={["#1E40AF", "#3B82F6"]} style={styles.userBubble}>
              <Text style={styles.userText}>{item.text}</Text>
            </LinearGradient>
          </Animated.View>
        );
      }

      if (item.type === "suggestion" && item.machine) {
        return (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.botMsgWrap}>
            <View style={[styles.suggestionCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
              <LinearGradient colors={["#059669", "#10B981"]} style={styles.suggestHeader}>
                <Feather name="cpu" size={16} color="#fff" />
                <Text style={styles.suggestHeaderText}>AI Recommendation</Text>
              </LinearGradient>
              <View style={styles.suggestBody}>
                <Text style={[styles.suggestMachine, { color: colors.text }]}>{item.machine.name}</Text>
                <Text style={[styles.suggestModel, { color: colors.textSecondary }]}>Model: {item.machine.model}</Text>
                <View style={styles.suggestSpecs}>
                  {[
                    { label: "Speed", value: item.machine.speed },
                    { label: "Power", value: item.machine.power },
                    { label: "Capacity", value: item.machine.capacity },
                  ].map((spec) => (
                    <View key={spec.label} style={[styles.specItem, { backgroundColor: colors.backgroundSecondary }]}>
                      <Text style={[styles.specLabel, { color: colors.textMuted }]}>{spec.label}</Text>
                      <Text style={[styles.specValue, { color: colors.text }]}>{spec.value}</Text>
                    </View>
                  ))}
                </View>
                <AnimatedPressable
                  onPress={() => router.push(`/catalog/${item.machine!.id}` as any)}
                  scaleDown={0.95}
                >
                  <LinearGradient colors={["#1E40AF", "#3B82F6"]} style={styles.viewDetailBtn}>
                    <Text style={styles.viewDetailText}>View Full Details</Text>
                    <Feather name="arrow-right" size={14} color="#fff" />
                  </LinearGradient>
                </AnimatedPressable>
              </View>
            </View>
          </Animated.View>
        );
      }

      if (item.type === "price") {
        return (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.botMsgWrap}>
            <View style={[styles.priceCard, { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }]}>
              <Text style={styles.priceText}>{item.text}</Text>
            </View>
          </Animated.View>
        );
      }

      if (item.type === "lead_captured") {
        return (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.botMsgWrap}>
            <View style={[styles.capturedCard, { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }]}>
              <View style={styles.capturedHeader}>
                <Feather name="check-circle" size={20} color="#059669" />
                <Text style={styles.capturedTitle}>Lead Captured!</Text>
              </View>
              <Text style={styles.capturedText}>{item.text}</Text>
              <View style={styles.capturedActions}>
                <AnimatedPressable onPress={() => router.push("/leads" as any)} scaleDown={0.95}>
                  <View style={styles.capturedBtn}>
                    <Feather name="bar-chart-2" size={14} color="#1A56DB" />
                    <Text style={styles.capturedBtnText}>View Dashboard</Text>
                  </View>
                </AnimatedPressable>
                <AnimatedPressable onPress={() => router.push("/quotation" as any)} scaleDown={0.95}>
                  <LinearGradient colors={["#059669", "#10B981"]} style={styles.capturedBtnGreen}>
                    <Feather name="file-text" size={14} color="#fff" />
                    <Text style={styles.capturedBtnGreenText}>Get Quote</Text>
                  </LinearGradient>
                </AnimatedPressable>
              </View>
            </View>
          </Animated.View>
        );
      }

      return (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.botMsgWrap}>
          <View style={styles.botRow}>
            <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.botAvatar}>
              <Text style={styles.botAvatarText}>AI</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <View style={[styles.botBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.botText, { color: colors.text }]}>{item.text}</Text>
              </View>
              {item.options && (
                <View style={styles.optionsWrap}>
                  {item.options.map((opt) => (
                    <AnimatedPressable
                      key={opt}
                      onPress={() => handleOptionSelect(opt)}
                      style={[styles.optionChip, { backgroundColor: colors.card, borderColor: "#1A56DB" }]}
                      scaleDown={0.95}
                    >
                      <Text style={styles.optionText}>{opt}</Text>
                    </AnimatedPressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      );
    },
    [colors, handleOptionSelect]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#0F172A", "#1E293B"]} style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View style={styles.headerRow}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </AnimatedPressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>AI Sales Buddy</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.headerSub}>Online • Ready to help</Text>
            </View>
          </View>
          <View style={styles.aiBadge}>
            <LinearGradient colors={["#059669", "#10B981"]} style={styles.aiBadgeGradient}>
              <Feather name="cpu" size={14} color="#fff" />
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }} keyboardVerticalOffset={0}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />

        {step === "location" && (
          <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomInset + 10 }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text, backgroundColor: colors.backgroundSecondary }]}
              placeholder="Type your city name..."
              placeholderTextColor={colors.textMuted}
              value={userInput}
              onChangeText={setUserInput}
              onSubmitEditing={handleSendLocation}
              returnKeyType="send"
            />
            <AnimatedPressable onPress={handleSendLocation} scaleDown={0.9}>
              <LinearGradient colors={["#1E40AF", "#3B82F6"]} style={styles.sendBtn}>
                <Feather name="send" size={16} color="#fff" />
              </LinearGradient>
            </AnimatedPressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#F1F5F9" },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10B981" },
  headerSub: { fontSize: 12, color: "#94A3B8" },
  aiBadge: {},
  aiBadgeGradient: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  userMsgWrap: { alignItems: "flex-end", marginBottom: 12 },
  userBubble: { borderRadius: 16, borderBottomRightRadius: 4, paddingHorizontal: 16, paddingVertical: 10, maxWidth: "80%" },
  userText: { color: "#fff", fontSize: 14, lineHeight: 20 },
  botMsgWrap: { marginBottom: 12 },
  botRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  botAvatar: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  botAvatarText: { fontSize: 11, fontWeight: "800", color: "#fff" },
  botBubble: { borderRadius: 16, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1 },
  botText: { fontSize: 14, lineHeight: 20 },
  optionsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8, paddingLeft: 4 },
  optionChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  optionText: { fontSize: 13, fontWeight: "600", color: "#1A56DB" },
  suggestionCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden", marginLeft: 40 },
  suggestHeader: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12 },
  suggestHeaderText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  suggestBody: { padding: 14 },
  suggestMachine: { fontSize: 17, fontWeight: "800" },
  suggestModel: { fontSize: 12, marginTop: 2 },
  suggestSpecs: { flexDirection: "row", gap: 8, marginTop: 10 },
  specItem: { flex: 1, padding: 8, borderRadius: 8, alignItems: "center" },
  specLabel: { fontSize: 9, fontWeight: "600", letterSpacing: 0.5 },
  specValue: { fontSize: 11, fontWeight: "700", marginTop: 2 },
  viewDetailBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 10, paddingVertical: 10, marginTop: 12 },
  viewDetailText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  priceCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginLeft: 40 },
  priceText: { fontSize: 14, lineHeight: 22, color: "#92400E" },
  capturedCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginLeft: 40 },
  capturedHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  capturedTitle: { fontSize: 16, fontWeight: "800", color: "#059669" },
  capturedText: { fontSize: 13, lineHeight: 20, color: "#065F46" },
  capturedActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  capturedBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EFF6FF", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  capturedBtnText: { fontSize: 12, fontWeight: "700", color: "#1A56DB" },
  capturedBtnGreen: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  capturedBtnGreenText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  inputBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1 },
  textInput: { flex: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  sendBtn: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
});
