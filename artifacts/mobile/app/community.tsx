import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useTheme } from "@/hooks/useTheme";
import { CARD_SHADOW, BUTTON_SHADOW, shadow3D } from "@/constants/shadows";
import {
  COMMUNITY_POSTS,
  SAMPLE_COMMENTS,
  POST_TYPES,
  BANNER_ADS,
  SPAM_RULES,
  type CommunityPost,
  type PostTypeFilter,
} from "@/data/community";

const { width: SW } = Dimensions.get("window");

const TYPE_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  question: { icon: "help-circle", color: "#7C3AED", bg: "#F5F3FF" },
  photo: { icon: "camera", color: "#1A56DB", bg: "#EFF6FF" },
  problem: { icon: "alert-triangle", color: "#EF4444", bg: "#FEF2F2" },
  promotion: { icon: "tag", color: "#D97706", bg: "#FEF3C7" },
  discussion: { icon: "message-square", color: "#059669", bg: "#F0FDF4" },
};

const TrustStars = React.memo(function TrustStars({ score }: { score: number }) {
  return (
    <View style={ts.row}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons
          key={s}
          name={s <= Math.floor(score) ? "star" : s - 0.5 <= score ? "star-half" : "star-outline"}
          size={10}
          color="#F59E0B"
        />
      ))}
    </View>
  );
});
const ts = StyleSheet.create({ row: { flexDirection: "row", gap: 1 } });

export default function CommunityScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const [filter, setFilter] = useState<PostTypeFilter>("All");
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [commentModal, setCommentModal] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [reportModal, setReportModal] = useState<string | null>(null);
  const [localComments, setLocalComments] = useState<typeof SAMPLE_COMMENTS>([]);

  const allComments = useMemo(() => [...SAMPLE_COMMENTS, ...localComments], [localComments]);

  const handleSendComment = useCallback(() => {
    if (!commentText.trim() || !commentModal) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: "You",
      avatar: "YO",
      text: commentText.trim(),
      time: "Just now",
      likes: 0,
    };
    setLocalComments((prev) => [...prev, newComment]);
    setPosts((prev) =>
      prev.map((p) => (p.id === commentModal ? { ...p, comments: p.comments + 1 } : p))
    );
    setCommentText("");
  }, [commentText, commentModal]);

  const filteredPosts = useMemo(() => {
    if (filter === "All") return posts;
    const typeMap: Record<string, string> = {
      Questions: "question",
      Photos: "photo",
      Problems: "problem",
      Promotions: "promotion",
      Discussions: "discussion",
    };
    return posts.filter((p) => p.type === typeMap[filter]);
  }, [filter, posts]);

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }, []);

  const handleReport = useCallback((postId: string) => {
    setReportModal(null);
    Alert.alert(
      "Post Reported",
      "Thank you for reporting. Our admin team will review this post within 24 hours.",
      [{ text: "OK" }]
    );
  }, []);

  const handleShare = useCallback(() => {
    Alert.alert("Share", "Post link copied to clipboard!");
  }, []);

  const renderBannerAd = useCallback(
    ({ item }: { item: typeof BANNER_ADS[0] }) => (
      <AnimatedPressable
        style={[styles.bannerCard, CARD_SHADOW]}
        scaleDown={0.97}
      >
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerGradient}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerLogoCircle}>
              <Text style={styles.bannerLogoText}>{item.supplierLogo}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.premiumRow}>
                <Text style={styles.bannerSupplier}>{item.supplierName}</Text>
                <View style={styles.premiumBadge}>
                  <Feather name="award" size={8} color="#F59E0B" />
                  <Text style={styles.premiumText}>PREMIUM</Text>
                </View>
              </View>
              <Text style={styles.bannerProduct}>{item.productName}</Text>
              <Text style={styles.bannerTagline}>{item.tagline}</Text>
            </View>
          </View>
          <AnimatedPressable scaleDown={0.95}>
            <View style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>View Products</Text>
              <Feather name="arrow-right" size={14} color="#1A56DB" />
            </View>
          </AnimatedPressable>
        </LinearGradient>
      </AnimatedPressable>
    ),
    []
  );

  const renderPost = useCallback(
    ({ item, index }: { item: CommunityPost; index: number }) => {
      const typeInfo = TYPE_ICONS[item.type] || TYPE_ICONS.discussion;
      return (
        <Animated.View entering={FadeInDown.delay(index * 60).duration(350)}>
          <View
            style={[
              styles.postCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              CARD_SHADOW,
              item.isSponsored && styles.sponsoredBorder,
            ]}
          >
            {item.isSponsored && (
              <View style={styles.sponsoredHeader}>
                <Feather name="zap" size={12} color="#D97706" />
                <Text style={styles.sponsoredLabel}>Sponsored</Text>
              </View>
            )}

            <View style={styles.postHeader}>
              <LinearGradient
                colors={item.author.isPremium ? ["#D97706", "#F59E0B"] : ["#0F172A", "#1E293B"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{item.author.avatar}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <View style={styles.authorRow}>
                  <Text style={[styles.authorName, { color: colors.text }]}>
                    {item.author.name}
                  </Text>
                  {item.author.isVerified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#1A56DB" />
                    </View>
                  )}
                  {item.author.isPremium && (
                    <View style={styles.premiumAuthorBadge}>
                      <Feather name="award" size={10} color="#D97706" />
                    </View>
                  )}
                </View>
                <View style={styles.authorMeta}>
                  {item.author.company && (
                    <Text style={[styles.authorCompany, { color: colors.textMuted }]}>
                      {item.author.company}
                    </Text>
                  )}
                  <Text style={[styles.postTime, { color: colors.textMuted }]}>
                    • {item.createdAt}
                  </Text>
                </View>
                <TrustStars score={item.author.trustScore} />
              </View>
              <View style={styles.postTypeWrap}>
                <View style={[styles.postTypeBadge, { backgroundColor: typeInfo.bg }]}>
                  <Feather name={typeInfo.icon as any} size={12} color={typeInfo.color} />
                </View>
                <AnimatedPressable onPress={() => setReportModal(item.id)} haptic={false}>
                  <Feather name="more-horizontal" size={18} color={colors.textMuted} />
                </AnimatedPressable>
              </View>
            </View>

            <Text style={[styles.postContent, { color: colors.text }]}>{item.content}</Text>

            {item.images && item.images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageScroll}
              >
                {item.images.map((img, i) => (
                  <Image
                    key={i}
                    source={{ uri: img }}
                    style={[
                      styles.postImage,
                      { width: item.images!.length === 1 ? SW - 72 : SW * 0.65 },
                    ]}
                  />
                ))}
              </ScrollView>
            )}

            {item.machineTags && (
              <View style={styles.tagsRow}>
                {item.machineTags.map((tag) => (
                  <View key={tag} style={[styles.machineTag, { backgroundColor: "#EFF6FF" }]}>
                    <Feather name="hash" size={10} color="#1A56DB" />
                    <Text style={styles.machineTagText}>{tag}</Text>
                  </View>
                ))}
                {item.supplierTag && (
                  <View style={[styles.machineTag, { backgroundColor: "#FEF3C7" }]}>
                    <Feather name="truck" size={10} color="#D97706" />
                    <Text style={[styles.machineTagText, { color: "#D97706" }]}>
                      {item.supplierTag}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={[styles.postActions, { borderTopColor: colors.border }]}>
              <AnimatedPressable
                onPress={() => toggleLike(item.id)}
                style={styles.actionBtn}
                scaleDown={0.9}
              >
                <Ionicons
                  name={item.isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={item.isLiked ? "#EF4444" : colors.textMuted}
                />
                <Text
                  style={[
                    styles.actionText,
                    { color: item.isLiked ? "#EF4444" : colors.textMuted },
                  ]}
                >
                  {item.likes}
                </Text>
              </AnimatedPressable>

              <AnimatedPressable
                onPress={() => setCommentModal(item.id)}
                style={styles.actionBtn}
                scaleDown={0.9}
              >
                <Feather name="message-circle" size={18} color={colors.textMuted} />
                <Text style={[styles.actionText, { color: colors.textMuted }]}>
                  {item.comments}
                </Text>
              </AnimatedPressable>

              <AnimatedPressable onPress={handleShare} style={styles.actionBtn} scaleDown={0.9}>
                <Feather name="share-2" size={18} color={colors.textMuted} />
                <Text style={[styles.actionText, { color: colors.textMuted }]}>{item.shares}</Text>
              </AnimatedPressable>

              {item.isSponsored && (
                <AnimatedPressable style={styles.chatSupplierBtn} scaleDown={0.95}>
                  <LinearGradient
                    colors={["#25D366", "#128C7E"]}
                    style={styles.chatBtnGradient}
                  >
                    <Ionicons name="chatbubble" size={12} color="#fff" />
                    <Text style={styles.chatBtnText}>Chat</Text>
                  </LinearGradient>
                </AnimatedPressable>
              )}
            </View>
          </View>
        </Animated.View>
      );
    },
    [colors, toggleLike, handleShare]
  );

  const renderGoogleAd = useCallback(
    () => (
      <View style={[styles.googleAd, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.adLabel, { color: colors.textMuted }]}>Ad</Text>
        <View style={styles.googleAdContent}>
          <LinearGradient colors={["#4285F4", "#34A853"]} style={styles.googleAdIcon}>
            <Text style={styles.googleAdG}>G</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={[styles.googleAdTitle, { color: colors.text }]}>
              Industrial Machine Insurance
            </Text>
            <Text style={[styles.googleAdDesc, { color: colors.textSecondary }]}>
              Protect your investment. Get a quote today.
            </Text>
          </View>
          <AnimatedPressable scaleDown={0.95}>
            <View style={styles.googleAdBtn}>
              <Text style={styles.googleAdBtnText}>Learn More</Text>
            </View>
          </AnimatedPressable>
        </View>
      </View>
    ),
    [colors]
  );

  const feedData = useMemo(() => {
    const result: (CommunityPost | { id: string; type: "google_ad" })[] = [];
    filteredPosts.forEach((post, i) => {
      result.push(post);
      if (i === 2 || i === 5) {
        result.push({ id: `ad-${i}`, type: "google_ad" });
      }
    });
    return result;
  }, [filteredPosts]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0F172A", "#1E293B"]}
        style={[styles.header, { paddingTop: topInset + 12 }]}
      >
        <View style={styles.headerRow}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </AnimatedPressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Community</Text>
            <Text style={styles.headerSub}>Connect with machine owners & suppliers</Text>
          </View>
          <AnimatedPressable
            onPress={() => router.push("/create-post" as any)}
            style={styles.newPostBtn}
            scaleDown={0.9}
          >
            <LinearGradient colors={["#1E40AF", "#3B82F6"]} style={styles.newPostGradient}>
              <Feather name="edit-3" size={18} color="#fff" />
            </LinearGradient>
          </AnimatedPressable>
        </View>
      </LinearGradient>

      <View style={styles.bannerSection}>
        <FlatList
          data={BANNER_ADS}
          renderItem={renderBannerAd}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          snapToInterval={SW - 48}
          decelerationRate="fast"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {POST_TYPES.map((type) => (
          <AnimatedPressable
            key={type}
            onPress={() => setFilter(type)}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === type ? "#1A56DB" : colors.card,
                borderColor: filter === type ? "#1A56DB" : colors.border,
              },
            ]}
            scaleDown={0.95}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === type ? "#fff" : colors.text },
              ]}
            >
              {type}
            </Text>
          </AnimatedPressable>
        ))}
      </ScrollView>

      <FlatList
        data={feedData}
        renderItem={({ item, index }) => {
          if ("type" in item && item.type === "google_ad") {
            return renderGoogleAd();
          }
          return renderPost({ item: item as CommunityPost, index });
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomInset + 20 }}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={!!commentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.commentSheet, { backgroundColor: colors.card }]}>
            <View style={styles.commentHeader}>
              <Text style={[styles.commentTitle, { color: colors.text }]}>Comments</Text>
              <AnimatedPressable onPress={() => setCommentModal(null)}>
                <Feather name="x" size={22} color={colors.textMuted} />
              </AnimatedPressable>
            </View>
            <ScrollView style={styles.commentList}>
              {allComments.map((c) => (
                <View key={c.id} style={[styles.commentItem, { borderBottomColor: colors.border }]}>
                  <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>{c.avatar}</Text>
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.commentAuthor, { color: colors.text }]}>{c.author}</Text>
                    <Text style={[styles.commentBody, { color: colors.textSecondary }]}>{c.text}</Text>
                    <View style={styles.commentMeta}>
                      <Text style={[styles.commentTime, { color: colors.textMuted }]}>{c.time}</Text>
                      <AnimatedPressable style={styles.commentLikeBtn} scaleDown={0.9}>
                        <Ionicons name="heart-outline" size={12} color={colors.textMuted} />
                        <Text style={[styles.commentLikes, { color: colors.textMuted }]}>{c.likes}</Text>
                      </AnimatedPressable>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={[styles.commentInputRow, { borderTopColor: colors.border }]}>
              <TextInput
                style={[styles.commentInput, { color: colors.text, backgroundColor: colors.backgroundSecondary }]}
                placeholder="Write a comment..."
                placeholderTextColor={colors.textMuted}
                value={commentText}
                onChangeText={setCommentText}
              />
              <AnimatedPressable onPress={handleSendComment} scaleDown={0.9}>
                <LinearGradient colors={["#1E40AF", "#3B82F6"]} style={styles.sendBtn}>
                  <Feather name="send" size={16} color="#fff" />
                </LinearGradient>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!reportModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.reportSheet, { backgroundColor: colors.card }, CARD_SHADOW]}>
            <Text style={[styles.reportTitle, { color: colors.text }]}>Report Post</Text>
            <Text style={[styles.reportDesc, { color: colors.textSecondary }]}>
              Why are you reporting this post?
            </Text>
            {["Spam or fake content", "Fraudulent supplier", "Inappropriate content", "Duplicate post", "Suspicious links"].map(
              (reason) => (
                <AnimatedPressable
                  key={reason}
                  onPress={() => handleReport(reportModal!)}
                  style={[styles.reportOption, { borderColor: colors.border }]}
                  scaleDown={0.98}
                >
                  <Feather name="flag" size={14} color="#EF4444" />
                  <Text style={[styles.reportOptionText, { color: colors.text }]}>{reason}</Text>
                </AnimatedPressable>
              )
            )}
            <AnimatedPressable onPress={() => setReportModal(null)} style={{ marginTop: 8 }}>
              <Text style={[styles.cancelText, { color: colors.textMuted }]}>Cancel</Text>
            </AnimatedPressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#F1F5F9" },
  headerSub: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  newPostBtn: {},
  newPostGradient: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  bannerSection: { paddingVertical: 12 },
  bannerCard: { width: SW - 64, marginRight: 12, borderRadius: 16, overflow: "hidden" },
  bannerGradient: { padding: 16, borderRadius: 16 },
  bannerContent: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  bannerLogoCircle: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  bannerLogoText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  premiumRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  bannerSupplier: { fontSize: 13, fontWeight: "700", color: "#fff" },
  premiumBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  premiumText: { fontSize: 8, fontWeight: "800", color: "#FDE68A", letterSpacing: 0.5 },
  bannerProduct: { fontSize: 16, fontWeight: "800", color: "#fff", marginTop: 2 },
  bannerTagline: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  bannerBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#fff", borderRadius: 10, paddingVertical: 10 },
  bannerBtnText: { fontSize: 13, fontWeight: "700", color: "#1A56DB" },
  filterRow: { marginBottom: 4 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: "600" },
  postCard: { borderRadius: 16, borderWidth: 1, marginBottom: 14, overflow: "hidden" },
  sponsoredBorder: { borderColor: "#FDE68A", borderWidth: 1.5 },
  sponsoredHeader: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFFBEB", paddingHorizontal: 14, paddingVertical: 6 },
  sponsoredLabel: { fontSize: 11, fontWeight: "700", color: "#D97706" },
  postHeader: { flexDirection: "row", alignItems: "flex-start", padding: 14, paddingBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 10 },
  avatarText: { fontSize: 14, fontWeight: "800", color: "#fff" },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  authorName: { fontSize: 14, fontWeight: "700" },
  verifiedBadge: {},
  premiumAuthorBadge: { backgroundColor: "#FEF3C7", width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  authorMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 1 },
  authorCompany: { fontSize: 11 },
  postTime: { fontSize: 11 },
  postTypeWrap: { alignItems: "center", gap: 6 },
  postTypeBadge: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  postContent: { fontSize: 14, lineHeight: 21, paddingHorizontal: 14, marginBottom: 10 },
  imageScroll: { marginBottom: 10 },
  postImage: { height: 200, borderRadius: 12, marginLeft: 14, marginRight: 8 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: 14, marginBottom: 10 },
  machineTag: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  machineTagText: { fontSize: 11, fontWeight: "600", color: "#1A56DB" },
  postActions: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, paddingHorizontal: 8, paddingVertical: 6, gap: 4 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  actionText: { fontSize: 13, fontWeight: "600" },
  chatSupplierBtn: { marginLeft: "auto" },
  chatBtnGradient: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  chatBtnText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  googleAd: { borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 14 },
  adLabel: { fontSize: 9, fontWeight: "700", letterSpacing: 1, marginBottom: 6 },
  googleAdContent: { flexDirection: "row", alignItems: "center", gap: 10 },
  googleAdIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  googleAdG: { fontSize: 18, fontWeight: "800", color: "#fff" },
  googleAdTitle: { fontSize: 13, fontWeight: "700" },
  googleAdDesc: { fontSize: 11, marginTop: 2 },
  googleAdBtn: { backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  googleAdBtnText: { fontSize: 11, fontWeight: "700", color: "#1A56DB" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  commentSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "70%", paddingBottom: 20 },
  commentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, paddingBottom: 8 },
  commentTitle: { fontSize: 18, fontWeight: "700" },
  commentList: { paddingHorizontal: 16 },
  commentItem: { flexDirection: "row", gap: 10, paddingVertical: 12, borderBottomWidth: 1 },
  commentAvatar: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  commentAvatarText: { fontSize: 11, fontWeight: "800", color: "#fff" },
  commentAuthor: { fontSize: 13, fontWeight: "700" },
  commentBody: { fontSize: 13, lineHeight: 19, marginTop: 2 },
  commentMeta: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 },
  commentTime: { fontSize: 11 },
  commentLikeBtn: { flexDirection: "row", alignItems: "center", gap: 3 },
  commentLikes: { fontSize: 11 },
  commentInputRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, gap: 10, borderTopWidth: 1 },
  commentInput: { flex: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  sendBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  reportSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  reportTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  reportDesc: { fontSize: 13, marginBottom: 16 },
  reportOption: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 14, borderBottomWidth: 1 },
  reportOptionText: { fontSize: 14, fontWeight: "500" },
  cancelText: { fontSize: 14, fontWeight: "600", textAlign: "center", paddingVertical: 8 },
});
