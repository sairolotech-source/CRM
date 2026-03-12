import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  RefreshControl,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import AnimatedPressable from "@/components/AnimatedPressable";
import { CARD_SHADOW, CARD_SHADOW_LG } from "@/constants/shadows";

const COMPANY_INFO = {
  name: "Sai Rolotech",
  tagline: "Industrial Roll Forming Solutions",
  established: "2009",
  location: "Rajkot, Gujarat, India",
  email: "info@sairolotech.com",
  phone: "+91 98765 43210",
  website: "www.sairolotech.com",
  description: "Sai Rolotech is a leading manufacturer of industrial roll forming machines based in Rajkot, Gujarat. We have been serving the steel fabrication industry since 2009 with precision-engineered machinery and exceptional after-sales service.",
} as const;

const CONTACT_ITEMS = [
  { icon: "phone", label: "Phone", value: COMPANY_INFO.phone, action: "phone", color: "#10B981", gradient: ["#059669", "#10B981"] },
  { icon: "mail", label: "Email", value: COMPANY_INFO.email, action: "email", color: "#1A56DB", gradient: ["#1E40AF", "#3B82F6"] },
  { icon: "globe", label: "Website", value: COMPANY_INFO.website, action: "web", color: "#8B5CF6", gradient: ["#7C3AED", "#8B5CF6"] },
  { icon: "map-pin", label: "Location", value: COMPANY_INFO.location, color: "#F59E0B", gradient: ["#D97706", "#F59E0B"] },
] as const;

const MENU_SECTIONS = [
  {
    section: "Services",
    items: [
      { id: "catalog", icon: "package", label: "Machine Catalog", color: "#1A56DB", gradient: ["#1A56DB", "#3B82F6"] },
      { id: "service", icon: "tool", label: "Service Request", color: "#10B981", gradient: ["#059669", "#10B981"] },
      { id: "quotation", icon: "file-text", label: "Get Quotation", color: "#F59E0B", gradient: ["#D97706", "#F59E0B"] },
      { id: "amc", icon: "shield", label: "AMC Plans", color: "#8B5CF6", gradient: ["#7C3AED", "#8B5CF6"] },
      { id: "support", icon: "message-circle", label: "Support Ticket", color: "#EF4444", gradient: ["#DC2626", "#EF4444"] },
    ],
  },
  {
    section: "Contact",
    items: [
      { id: "phone", icon: "phone", label: "Call Us", color: "#10B981", gradient: ["#059669", "#10B981"], action: "phone" },
      { id: "whatsapp", icon: "message-square", label: "WhatsApp", color: "#25D366", gradient: ["#25D366", "#128C7E"], action: "whatsapp" },
      { id: "email", icon: "mail", label: "Email Us", color: "#1A56DB", gradient: ["#1E40AF", "#3B82F6"], action: "email" },
    ],
  },
  {
    section: "Legal",
    items: [
      { id: "privacy", icon: "lock", label: "Privacy Policy", color: "#64748B", gradient: ["#475569", "#64748B"] },
      { id: "terms", icon: "file", label: "Terms & Conditions", color: "#64748B", gradient: ["#475569", "#64748B"] },
    ],
  },
] as const;

const ContactRow = React.memo(function ContactRow({
  info, isLast, borderColor, textColor, mutedColor, labelColor,
}: {
  info: typeof CONTACT_ITEMS[number]; isLast: boolean;
  borderColor: string; textColor: string; mutedColor: string; labelColor: string;
}) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (info.action === "phone") Linking.openURL(`tel:${info.value.replace(/\s/g, "")}`);
    else if (info.action === "email") Linking.openURL(`mailto:${info.value}`);
    else if (info.action === "web") Linking.openURL(`https://${info.value}`);
  }, [info]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={!info.action}
      style={[styles.contactRow, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor }]}
      scaleDown={0.99}
    >
      <LinearGradient colors={[...info.gradient]} style={styles.contactIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Feather name={info.icon as any} size={15} color="#fff" />
      </LinearGradient>
      <View style={styles.flex}>
        <Text style={[styles.contactLabel, { color: labelColor, fontFamily: "Inter_400Regular" }]}>{info.label}</Text>
        <Text style={[styles.contactValue, { color: textColor, fontFamily: "Inter_500Medium" }]}>{info.value}</Text>
      </View>
      {info.action && <Feather name="external-link" size={14} color={mutedColor} />}
    </AnimatedPressable>
  );
});

const MenuItem = React.memo(function MenuItem({
  item, isLast, borderColor, textColor, mutedColor, onPress,
}: {
  item: { id: string; icon: string; label: string; color: string; gradient: readonly string[]; action?: string };
  isLast: boolean; borderColor: string; textColor: string; mutedColor: string; onPress: () => void;
}) {
  return (
    <AnimatedPressable onPress={onPress} style={[styles.menuItem, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor }]} scaleDown={0.99}>
      <LinearGradient colors={[...item.gradient]} style={styles.menuIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Feather name={item.icon as any} size={15} color="#fff" />
      </LinearGradient>
      <Text style={[styles.menuLabel, { color: textColor, fontFamily: "Inter_400Regular" }]}>{item.label}</Text>
      <Feather name="chevron-right" size={16} color={mutedColor} />
    </AnimatedPressable>
  );
});

export default function ProfileScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleMenuPress = useCallback((item: { id: string; action?: string }) => {
    if (item.action === "phone") Linking.openURL(`tel:${COMPANY_INFO.phone.replace(/\s/g, "")}`);
    else if (item.action === "whatsapp") Linking.openURL("https://wa.me/919876543210");
    else if (item.action === "email") Linking.openURL(`mailto:${COMPANY_INFO.email}`);
    else if (item.id === "catalog") router.push("/catalog" as any);
    else if (item.id === "service") router.push("/service-request" as any);
    else if (item.id === "quotation") router.push("/quotation" as any);
    else if (item.id === "amc") router.push("/amc" as any);
    else if (item.id === "support") router.push("/support-ticket" as any);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomInset + 20 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />}
    >
      <LinearGradient colors={["#0F172A", "#1E293B", "#0F172A"]} style={[styles.headerSection, { paddingTop: topInset + 12 }]}>
        <LinearGradient colors={["#1A56DB", "#2563EB"]} style={[styles.logoCircle, CARD_SHADOW_LG]}>
          <Text style={[styles.logoText, { fontFamily: "Inter_700Bold" }]}>SR</Text>
        </LinearGradient>
        <Text style={[styles.companyName, { fontFamily: "Inter_700Bold" }]}>{COMPANY_INFO.name}</Text>
        <Text style={[styles.companyTagline, { fontFamily: "Inter_400Regular" }]}>{COMPANY_INFO.tagline}</Text>
        <View style={styles.companyMetaRow}>
          <View style={styles.metaChip}>
            <Feather name="map-pin" size={12} color="#94A3B8" />
            <Text style={[styles.metaChipText, { fontFamily: "Inter_400Regular" }]}>{COMPANY_INFO.location}</Text>
          </View>
          <View style={styles.metaChip}>
            <Feather name="calendar" size={12} color="#94A3B8" />
            <Text style={[styles.metaChipText, { fontFamily: "Inter_400Regular" }]}>Est. {COMPANY_INFO.established}</Text>
          </View>
        </View>
      </LinearGradient>

      <Animated.View entering={FadeInDown.delay(100).duration(300)} style={[styles.section, { paddingTop: 24 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>About Us</Text>
        <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
          <Text style={[styles.aboutText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{COMPANY_INFO.description}</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Contact Information</Text>
        <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
          {CONTACT_ITEMS.map((info, idx) => (
            <ContactRow key={info.label} info={info} isLast={idx === CONTACT_ITEMS.length - 1} borderColor={colors.border} textColor={colors.text} mutedColor={colors.textMuted} labelColor={colors.textMuted} />
          ))}
        </View>
      </Animated.View>

      {MENU_SECTIONS.map((section, sIdx) => (
        <Animated.View key={section.section} entering={FadeInDown.delay(300 + sIdx * 80).duration(300)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>{section.section}</Text>
          <View style={[styles.menuGroup, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}>
            {section.items.map((item, idx) => (
              <MenuItem key={item.id} item={item as any} isLast={idx === section.items.length - 1} borderColor={colors.border} textColor={colors.text} mutedColor={colors.textMuted} onPress={() => handleMenuPress(item as any)} />
            ))}
          </View>
        </Animated.View>
      ))}

      <Animated.View entering={FadeInDown.delay(500).duration(300)} style={styles.versionRow}>
        <Text style={[styles.versionText, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>Sai Rolotech Mobile v1.0.0</Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerSection: { paddingHorizontal: 20, paddingBottom: 28, alignItems: "center" },
  logoCircle: { width: 84, height: 84, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  logoText: { fontSize: 30, color: "#fff" },
  companyName: { fontSize: 24, color: "#fff", marginBottom: 6 },
  companyTagline: { fontSize: 14, color: "#94A3B8", marginBottom: 14 },
  companyMetaRow: { flexDirection: "row", gap: 12 },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.08)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  metaChipText: { color: "#94A3B8", fontSize: 12 },
  section: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 17, marginBottom: 12 },
  aboutCard: { borderRadius: 16, borderWidth: 1, padding: 18 },
  aboutText: { fontSize: 14, lineHeight: 22 },
  contactCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  contactRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  contactIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  contactLabel: { fontSize: 11, marginBottom: 2 },
  contactValue: { fontSize: 14 },
  menuGroup: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 15 },
  versionRow: { alignItems: "center", paddingTop: 24, paddingBottom: 8 },
  versionText: { fontSize: 12 },
});
