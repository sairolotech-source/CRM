import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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
import Animated, { FadeInDown } from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useTheme } from "@/hooks/useTheme";
import { BUTTON_SHADOW, CARD_SHADOW } from "@/constants/shadows";
import { SPAM_RULES } from "@/data/community";

const POST_CATEGORIES = [
  { key: "question", label: "Ask Question", icon: "help-circle", gradient: ["#7C3AED", "#8B5CF6"] as [string, string] },
  { key: "photo", label: "Share Photo", icon: "camera", gradient: ["#1E40AF", "#3B82F6"] as [string, string] },
  { key: "problem", label: "Report Problem", icon: "alert-triangle", gradient: ["#DC2626", "#EF4444"] as [string, string] },
  { key: "promotion", label: "Promotion", icon: "tag", gradient: ["#D97706", "#F59E0B"] as [string, string] },
  { key: "discussion", label: "Discussion", icon: "message-square", gradient: ["#059669", "#10B981"] as [string, string] },
];

const MACHINE_TAGS = ["RS-5000", "TG-3000", "RF-2000", "DW-1500", "SS-4000", "SI-1000", "GP-3500", "SAI-6.0"];

export default function CreatePostScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const [category, setCategory] = useState("question");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handlePost = useCallback(async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please write something before posting.");
      return;
    }
    if (content.length < 10) {
      Alert.alert("Error", "Post must be at least 10 characters.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    Alert.alert(
      "Post Published! ✅",
      "Your post is now visible in the community feed.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  }, [content]);

  const activeCategory = POST_CATEGORIES.find((c) => c.key === category)!;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={[styles.header, { paddingTop: topInset + 12, borderBottomColor: colors.border }]}>
          <AnimatedPressable onPress={() => router.back()}>
            <Text style={[styles.cancelBtn, { color: colors.textMuted }]}>Cancel</Text>
          </AnimatedPressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>New Post</Text>
          <AnimatedPressable onPress={handlePost} disabled={loading || !content.trim()}>
            <LinearGradient
              colors={activeCategory.gradient}
              style={[styles.postBtn, { opacity: !content.trim() ? 0.5 : 1 }]}
            >
              <Text style={styles.postBtnText}>{loading ? "Posting..." : "Post"}</Text>
            </LinearGradient>
          </AnimatedPressable>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: bottomInset + 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>POST TYPE</Text>
            <View style={styles.categoryRow}>
              {POST_CATEGORIES.map((cat) => (
                <AnimatedPressable
                  key={cat.key}
                  onPress={() => setCategory(cat.key)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: category === cat.key ? "transparent" : colors.card,
                      borderColor: category === cat.key ? cat.gradient[0] : colors.border,
                      borderWidth: category === cat.key ? 2 : 1,
                      overflow: "hidden",
                    },
                  ]}
                  scaleDown={0.95}
                >
                  {category === cat.key && (
                    <LinearGradient colors={cat.gradient} style={StyleSheet.absoluteFill} />
                  )}
                  <Feather
                    name={cat.icon as any}
                    size={14}
                    color={category === cat.key ? "#fff" : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      { color: category === cat.key ? "#fff" : colors.text },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </AnimatedPressable>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>CONTENT</Text>
            <View style={[styles.contentBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.contentInput, { color: colors.text }]}
                placeholder={
                  category === "question"
                    ? "Ask your question about machines, parts, or operations..."
                    : category === "problem"
                      ? "Describe the machine problem in detail..."
                      : "Share your thoughts with the community..."
                }
                placeholderTextColor={colors.textMuted}
                multiline
                value={content}
                onChangeText={setContent}
                maxLength={1000}
              />
              <Text style={[styles.charCount, { color: colors.textMuted }]}>
                {content.length}/1000
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ADD PHOTOS</Text>
            <AnimatedPressable
              style={[styles.photoUpload, { backgroundColor: colors.card, borderColor: colors.border }]}
              scaleDown={0.98}
            >
              <Feather name="camera" size={24} color={colors.textMuted} />
              <Text style={[styles.photoText, { color: colors.textMuted }]}>Tap to add photos</Text>
              <Text style={[styles.photoHint, { color: colors.textMuted }]}>Max 4 photos</Text>
            </AnimatedPressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>TAG MACHINE</Text>
            <View style={styles.tagsWrap}>
              {MACHINE_TAGS.map((tag) => (
                <AnimatedPressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: selectedTags.includes(tag) ? "#EFF6FF" : colors.card,
                      borderColor: selectedTags.includes(tag) ? "#1A56DB" : colors.border,
                    },
                  ]}
                  scaleDown={0.95}
                >
                  <Feather
                    name="hash"
                    size={12}
                    color={selectedTags.includes(tag) ? "#1A56DB" : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.tagText,
                      { color: selectedTags.includes(tag) ? "#1A56DB" : colors.text },
                    ]}
                  >
                    {tag}
                  </Text>
                </AnimatedPressable>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            <View style={[styles.spamNotice, { backgroundColor: "#FEF3C7", borderColor: "#FDE68A" }]}>
              <Feather name="info" size={14} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={styles.spamTitle}>Community Guidelines</Text>
                <Text style={styles.spamText}>
                  Max {SPAM_RULES.maxPostsPerDay} posts/day • No spam or fake promotions • Violations may freeze your account for {SPAM_RULES.freezeDurationHours}h
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  cancelBtn: { fontSize: 15, fontWeight: "500" },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  postBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10 },
  postBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  scroll: { padding: 16 },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1.2, marginBottom: 10, marginTop: 8 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  categoryLabel: { fontSize: 13, fontWeight: "600" },
  contentBox: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 8 },
  contentInput: { fontSize: 15, minHeight: 120, textAlignVertical: "top", lineHeight: 22 },
  charCount: { fontSize: 11, textAlign: "right", marginTop: 4 },
  photoUpload: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 24,
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  photoText: { fontSize: 14, fontWeight: "500" },
  photoHint: { fontSize: 11 },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: { fontSize: 12, fontWeight: "600" },
  spamNotice: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  spamTitle: { fontSize: 13, fontWeight: "700", color: "#92400E", marginBottom: 2 },
  spamText: { fontSize: 11, color: "#92400E", lineHeight: 16 },
});
