import React, { useCallback, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Image,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { MACHINE_DETAILS, type MachineImage, type MachineVideo } from "@/data/machines";
import AnimatedPressable from "@/components/AnimatedPressable";
import { CARD_SHADOW, CARD_SHADOW_LG, BUTTON_SHADOW } from "@/constants/shadows";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_WIDTH = SCREEN_WIDTH - 40;
const IMAGE_HEIGHT = 220;

const COLOR_GRADIENTS: Record<string, string[]> = {
  "#1A56DB": ["#1E40AF", "#3B82F6"],
  "#10B981": ["#047857", "#34D399"],
  "#EF4444": ["#DC2626", "#F87171"],
  "#8B5CF6": ["#6D28D9", "#A78BFA"],
  "#F59E0B": ["#B45309", "#FBBF24"],
  "#0EA5E9": ["#0369A1", "#38BDF8"],
  "#EC4899": ["#BE185D", "#F472B6"],
  "#14B8A6": ["#0D9488", "#5EEAD4"],
  "#64748B": ["#475569", "#94A3B8"],
};

const TYPE_ICONS: Record<string, string> = {
  front: "monitor",
  side: "sidebar",
  detail: "zoom-in",
  output: "box",
  panel: "cpu",
  process: "activity",
};

const VIDEO_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  demo: { label: "Demo", color: "#10B981" },
  installation: { label: "Installation", color: "#1A56DB" },
  maintenance: { label: "Maintenance", color: "#F59E0B" },
  output: { label: "Output", color: "#8B5CF6" },
};

const GalleryImage = React.memo(function GalleryImage({
  item, isDark,
}: { item: MachineImage; isDark: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const iconName = TYPE_ICONS[item.type] || "image";

  return (
    <View style={styles.galleryImageWrap}>
      {!error ? (
        <>
          <Image
            source={{ uri: item.url }}
            style={styles.galleryImage}
            resizeMode="cover"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
          {!loaded && (
            <View style={[styles.imagePlaceholder, { backgroundColor: isDark ? "#1E293B" : "#E2E8F0" }]}>
              <Feather name={iconName as any} size={32} color={isDark ? "#475569" : "#94A3B8"} />
            </View>
          )}
        </>
      ) : (
        <LinearGradient colors={isDark ? ["#1E293B", "#334155"] : ["#E2E8F0", "#F1F5F9"]} style={styles.imagePlaceholder}>
          <Feather name={iconName as any} size={36} color={isDark ? "#64748B" : "#94A3B8"} />
          <Text style={[styles.placeholderLabel, { color: isDark ? "#64748B" : "#94A3B8", fontFamily: "Inter_400Regular" }]}>{item.label}</Text>
        </LinearGradient>
      )}
      <View style={styles.imageLabel}>
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.imageLabelGradient}>
          <Feather name={iconName as any} size={12} color="#fff" />
          <Text style={[styles.imageLabelText, { fontFamily: "Inter_500Medium" }]}>{item.label}</Text>
        </LinearGradient>
      </View>
    </View>
  );
});

const VideoCard = React.memo(function VideoCard({
  video, gradient, cardBg, borderColor, textColor, subColor,
}: {
  video: MachineVideo; gradient: string[];
  cardBg: string; borderColor: string; textColor: string; subColor: string;
}) {
  const [thumbError, setThumbError] = useState(false);
  const typeInfo = VIDEO_TYPE_LABELS[video.type] || VIDEO_TYPE_LABELS.demo;

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`https://www.youtube.com/watch?v=${video.youtubeId}`);
  }, [video.youtubeId]);

  return (
    <AnimatedPressable onPress={handlePress} style={[styles.videoCard, { backgroundColor: cardBg, borderColor }, CARD_SHADOW]} scaleDown={0.97}>
      <View style={styles.videoThumbWrap}>
        {!thumbError ? (
          <Image
            source={{ uri: video.thumbnail }}
            style={styles.videoThumb}
            resizeMode="cover"
            onError={() => setThumbError(true)}
          />
        ) : (
          <LinearGradient colors={gradient} style={styles.videoThumb}>
            <Feather name="video" size={24} color="rgba(255,255,255,0.5)" />
          </LinearGradient>
        )}
        <View style={styles.playOverlay}>
          <LinearGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]} style={styles.playOverlayGradient}>
            <View style={styles.playButton}>
              <Ionicons name="play" size={18} color="#fff" />
            </View>
          </LinearGradient>
        </View>
        <View style={styles.durationBadge}>
          <Text style={[styles.durationText, { fontFamily: "Inter_500Medium" }]}>{video.duration}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={[styles.videoTitle, { color: textColor, fontFamily: "Inter_600SemiBold" }]} numberOfLines={2}>{video.title}</Text>
        <View style={[styles.videoTypeBadge, { backgroundColor: typeInfo.color + "18" }]}>
          <Text style={[styles.videoTypeText, { color: typeInfo.color, fontFamily: "Inter_500Medium" }]}>{typeInfo.label}</Text>
        </View>
      </View>
    </AnimatedPressable>
  );
});

const SpecRow = React.memo(function SpecRow({
  spec, isLast, borderColor, subColor, textColor,
}: {
  spec: { label: string; value: string }; isLast: boolean;
  borderColor: string; subColor: string; textColor: string;
}) {
  return (
    <View style={[styles.specRow, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor }]}>
      <Text style={[styles.specLabel, { color: subColor, fontFamily: "Inter_400Regular" }]}>{spec.label}</Text>
      <Text style={[styles.specValue, { color: textColor, fontFamily: "Inter_600SemiBold" }]}>{spec.value}</Text>
    </View>
  );
});

const AccessoryItem = React.memo(function AccessoryItem({
  item, color, gradient, textColor,
}: { item: string; color: string; gradient: string[]; textColor: string }) {
  return (
    <View style={styles.accessoryRow}>
      <LinearGradient colors={gradient} style={styles.accessoryDot} />
      <Text style={[styles.accessoryText, { color: textColor, fontFamily: "Inter_400Regular" }]}>{item}</Text>
    </View>
  );
});

export default function CatalogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark, colors, topInset, bottomInset } = useTheme();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const machine = useMemo(() => MACHINE_DETAILS[id] || MACHINE_DETAILS["1"], [id]);
  const gradient = useMemo(() => COLOR_GRADIENTS[machine.color] || [machine.color, machine.color + "CC"], [machine.color]);

  const handleBack = useCallback(() => router.back(), []);
  const handleGetQuote = useCallback(() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/quotation" as any); }, []);
  const handleWhatsApp = useCallback(() => { Linking.openURL("https://wa.me/919876543210"); }, []);
  const handleServiceRequest = useCallback(() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/service-request" as any); }, []);

  const onGalleryScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (IMAGE_WIDTH + 12));
    setActiveImageIndex(idx);
  }, []);

  const renderGalleryImage = useCallback(({ item }: { item: MachineImage }) => (
    <GalleryImage item={item} isDark={isDark} />
  ), [isDark]);

  const galleryKeyExtractor = useCallback((item: MachineImage) => item.id, []);

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <LinearGradient colors={gradient} style={[styles.header, { paddingTop: topInset + 12 }]}>
        <AnimatedPressable onPress={handleBack} style={styles.backBtn} scaleDown={0.9}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </AnimatedPressable>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.categoryBadgeText, { fontFamily: "Inter_400Regular" }]}>{machine.category}</Text>
          <Text style={[styles.machineName, { fontFamily: "Inter_700Bold" }]} numberOfLines={2}>{machine.name}</Text>
          <Text style={[styles.machineModel, { fontFamily: "Inter_400Regular" }]}>Model: {machine.model}</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: bottomInset + 24 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(300)} style={[styles.priceBanner, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW_LG]}>
          <View>
            <Text style={[styles.priceLabel, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>Price Range</Text>
            <Text style={[styles.price, { color: machine.color, fontFamily: "Inter_700Bold" }]}>{machine.price}</Text>
          </View>
          <View style={styles.ctaButtons}>
            <AnimatedPressable onPress={handleGetQuote} scaleDown={0.95}>
              <LinearGradient colors={gradient} style={[styles.ctaBtn, BUTTON_SHADOW]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={[styles.ctaBtnText, { fontFamily: "Inter_600SemiBold" }]}>Get Quote</Text>
              </LinearGradient>
            </AnimatedPressable>
            <AnimatedPressable onPress={handleWhatsApp} style={[styles.ctaBtnOutline, { borderColor: machine.color }]} scaleDown={0.95}>
              <Ionicons name="logo-whatsapp" size={16} color={machine.color} />
            </AnimatedPressable>
          </View>
        </Animated.View>

        {machine.images && machine.images.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="camera" size={16} color={machine.color} />
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                Photos ({machine.images.length})
              </Text>
            </View>
            <FlatList
              data={machine.images}
              keyExtractor={galleryKeyExtractor}
              renderItem={renderGalleryImage}
              horizontal
              pagingEnabled={false}
              snapToInterval={IMAGE_WIDTH + 12}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryList}
              onScroll={onGalleryScroll}
              scrollEventThrottle={32}
            />
            {machine.images.length > 1 && (
              <View style={styles.dotsRow}>
                {machine.images.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.dot,
                      idx === activeImageIndex
                        ? { backgroundColor: machine.color, width: 20 }
                        : { backgroundColor: isDark ? "#475569" : "#CBD5E1", width: 6 },
                    ]}
                  />
                ))}
              </View>
            )}
          </Animated.View>
        )}

        {machine.videos && machine.videos.length > 0 && (
          <Animated.View entering={FadeInDown.delay(150).duration(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="play-circle" size={16} color={machine.color} />
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                Videos ({machine.videos.length})
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.videosScroll}>
              {machine.videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  gradient={gradient}
                  cardBg={colors.card}
                  borderColor={colors.border}
                  textColor={colors.text}
                  subColor={colors.textSecondary}
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={16} color={machine.color} />
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Description</Text>
          </View>
          <Text style={[styles.description, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {machine.detailedDescription || machine.description}
          </Text>
        </Animated.View>

        {machine.applications && machine.applications.length > 0 && (
          <Animated.View entering={FadeInDown.delay(250).duration(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="target" size={16} color={machine.color} />
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Applications</Text>
            </View>
            <View style={styles.tagsWrap}>
              {machine.applications.map((app) => (
                <View key={app} style={[styles.appTag, { backgroundColor: machine.color + "12", borderColor: machine.color + "30" }]}>
                  <Feather name="check" size={12} color={machine.color} />
                  <Text style={[styles.appTagText, { color: machine.color, fontFamily: "Inter_500Medium" }]}>{app}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="list" size={16} color={machine.color} />
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Technical Specifications</Text>
          </View>
          <View style={[styles.specsCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
            {machine.specs?.map((spec, idx) => (
              <SpecRow key={spec.label} spec={spec} isLast={idx === machine.specs.length - 1} borderColor={colors.border} subColor={colors.textSecondary} textColor={colors.text} />
            ))}
          </View>
        </Animated.View>

        {machine.features && (
          <Animated.View entering={FadeInDown.delay(350).duration(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="star" size={16} color={machine.color} />
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Key Features</Text>
            </View>
            <View style={{ gap: 10 }}>
              {machine.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <LinearGradient colors={gradient} style={styles.featureDot} />
                  <Text style={[styles.featureText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{f}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {machine.accessories && machine.accessories.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="package" size={16} color={machine.color} />
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Included Accessories</Text>
            </View>
            <View style={[styles.accessoriesCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
              {machine.accessories.map((acc) => (
                <AccessoryItem key={acc} item={acc} color={machine.color} gradient={gradient} textColor={colors.text} />
              ))}
            </View>
          </Animated.View>
        )}

        {machine.warranty && (
          <Animated.View entering={FadeInDown.delay(450).duration(300)} style={styles.section}>
            <View style={[styles.warrantyCard, { backgroundColor: machine.color + "10", borderColor: machine.color + "30" }, CARD_SHADOW]}>
              <LinearGradient colors={gradient} style={styles.warrantyIcon}>
                <Feather name="shield" size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.flex}>
                <Text style={[styles.warrantyTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Warranty</Text>
                <Text style={[styles.warrantyValue, { color: machine.color, fontFamily: "Inter_700Bold" }]}>{machine.warranty}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(500).duration(300)} style={[styles.section, { paddingBottom: 8 }]}>
          <AnimatedPressable onPress={handleServiceRequest} scaleDown={0.98}>
            <LinearGradient colors={gradient} style={[styles.mainCta, CARD_SHADOW_LG]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Feather name="tool" size={18} color="#fff" />
              <Text style={[styles.mainCtaText, { fontFamily: "Inter_600SemiBold" }]}>Request Service for This Machine</Text>
            </LinearGradient>
          </AnimatedPressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 20, paddingBottom: 28 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginTop: 4 },
  headerTextWrap: { flex: 1, paddingHorizontal: 12 },
  categoryBadgeText: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginBottom: 4 },
  machineName: { fontSize: 22, color: "#fff", marginBottom: 4 },
  machineModel: { color: "rgba(255,255,255,0.75)", fontSize: 13 },
  priceBanner: { marginHorizontal: 20, marginTop: -10, borderRadius: 18, borderWidth: 1, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, zIndex: 1 },
  priceLabel: { fontSize: 12, marginBottom: 2 },
  price: { fontSize: 22 },
  ctaButtons: { flexDirection: "row", gap: 8 },
  ctaBtn: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: 12 },
  ctaBtnText: { color: "#fff", fontSize: 14 },
  ctaBtnOutline: { width: 42, height: 42, borderRadius: 12, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 17 },
  galleryList: { paddingLeft: 20, paddingRight: 8, gap: 12 },
  galleryImageWrap: { width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 16, overflow: "hidden" },
  galleryImage: { width: "100%", height: "100%", borderRadius: 16 },
  imagePlaceholder: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", borderRadius: 16, gap: 8 },
  placeholderLabel: { fontSize: 12 },
  imageLabel: { position: "absolute", bottom: 0, left: 0, right: 0 },
  imageLabelGradient: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, paddingTop: 24, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  imageLabelText: { color: "#fff", fontSize: 12 },
  dotsRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5, marginTop: 12 },
  dot: { height: 6, borderRadius: 3 },
  videosScroll: { gap: 12, paddingRight: 20 },
  videoCard: { width: 200, borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  videoThumbWrap: { width: "100%", height: 112, position: "relative" },
  videoThumb: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  playOverlay: { ...StyleSheet.absoluteFillObject },
  playOverlayGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
  playButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(255,255,255,0.5)" },
  durationBadge: { position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  durationText: { color: "#fff", fontSize: 11 },
  videoInfo: { padding: 12, gap: 8 },
  videoTitle: { fontSize: 13, lineHeight: 18 },
  videoTypeBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  videoTypeText: { fontSize: 11 },
  description: { fontSize: 14, lineHeight: 22 },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  appTag: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  appTagText: { fontSize: 13 },
  specsCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  specRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13 },
  specLabel: { fontSize: 13 },
  specValue: { fontSize: 14 },
  featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  featureDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  featureText: { flex: 1, fontSize: 14, lineHeight: 20 },
  accessoriesCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  accessoryRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  accessoryDot: { width: 6, height: 6, borderRadius: 3 },
  accessoryText: { flex: 1, fontSize: 14 },
  warrantyCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  warrantyIcon: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  warrantyTitle: { fontSize: 13, marginBottom: 2 },
  warrantyValue: { fontSize: 15 },
  mainCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 16, paddingVertical: 16 },
  mainCtaText: { color: "#fff", fontSize: 16 },
});
