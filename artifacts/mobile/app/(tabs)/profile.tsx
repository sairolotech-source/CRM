import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const COMPANY_INFO = {
  name: "App Pro",
  tagline: "Industrial Roll Forming Solutions",
  established: "2009",
  location: "Rajkot, Gujarat, India",
  email: "info@sairolotech.com",
  phone: "+91 98765 43210",
  website: "www.sairolotech.com",
  gst: "24XXXXXX1234X1Z5",
  description:
    "App Pro is a leading manufacturer of industrial roll forming machines based in Rajkot, Gujarat. We have been serving the steel fabrication industry since 2009 with precision-engineered machinery and exceptional after-sales service.",
};

const MENU_ITEMS = [
  {
    section: "Services",
    items: [
      { id: "catalog", icon: "package", label: "Machine Catalog", color: "#1A56DB" },
      { id: "service", icon: "tool", label: "Service Request", color: "#10B981" },
      { id: "quotation", icon: "file-text", label: "Get Quotation", color: "#F59E0B" },
      { id: "amc", icon: "shield", label: "AMC Plans", color: "#8B5CF6" },
      { id: "support", icon: "message-circle", label: "Support Ticket", color: "#EF4444" },
    ],
  },
  {
    section: "Contact",
    items: [
      { id: "phone", icon: "phone", label: "Call Us", color: "#10B981", action: "phone" },
      { id: "whatsapp", icon: "message-square", label: "WhatsApp", color: "#25D366", action: "whatsapp" },
      { id: "email", icon: "mail", label: "Email Us", color: "#1A56DB", action: "email" },
    ],
  },
  {
    section: "Legal",
    items: [
      { id: "privacy", icon: "lock", label: "Privacy Policy", color: "#64748B" },
      { id: "terms", icon: "file", label: "Terms & Conditions", color: "#64748B" },
    ],
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const handleItemPress = (item: { id: string; action?: string }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.action === "phone") {
      Linking.openURL(`tel:${COMPANY_INFO.phone.replace(/\s/g, "")}`);
    } else if (item.action === "whatsapp") {
      Linking.openURL("https://wa.me/919876543210");
    } else if (item.action === "email") {
      Linking.openURL(`mailto:${COMPANY_INFO.email}`);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={[
          styles.headerSection,
          { paddingTop: topInset + 12, backgroundColor: "#0F172A" },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={[styles.logoText, { fontFamily: "Inter_700Bold" }]}>AP</Text>
          </View>
        </View>
        <Text style={[styles.companyName, { fontFamily: "Inter_700Bold" }]}>
          {COMPANY_INFO.name}
        </Text>
        <Text style={[styles.companyTagline, { fontFamily: "Inter_400Regular" }]}>
          {COMPANY_INFO.tagline}
        </Text>
        <View style={styles.companyMetaRow}>
          <View style={styles.metaChip}>
            <Feather name="map-pin" size={12} color="#94A3B8" />
            <Text style={[styles.metaChipText, { fontFamily: "Inter_400Regular" }]}>
              {COMPANY_INFO.location}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Feather name="calendar" size={12} color="#94A3B8" />
            <Text style={[styles.metaChipText, { fontFamily: "Inter_400Regular" }]}>
              Est. {COMPANY_INFO.established}
            </Text>
          </View>
        </View>
      </View>

      {/* About */}
      <View style={[styles.section, { paddingTop: 24 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          About Us
        </Text>
        <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.aboutText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {COMPANY_INFO.description}
          </Text>
        </View>
      </View>

      {/* Contact Cards */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Contact Information
        </Text>
        <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: "phone", label: "Phone", value: COMPANY_INFO.phone, action: "phone" },
            { icon: "mail", label: "Email", value: COMPANY_INFO.email, action: "email" },
            { icon: "globe", label: "Website", value: COMPANY_INFO.website, action: "web" },
            { icon: "map-pin", label: "Location", value: COMPANY_INFO.location },
          ].map((info, idx, arr) => (
            <TouchableOpacity
              key={info.label}
              style={[
                styles.contactRow,
                idx < arr.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (info.action === "phone") Linking.openURL(`tel:${info.value.replace(/\s/g, "")}`);
                else if (info.action === "email") Linking.openURL(`mailto:${info.value}`);
                else if (info.action === "web") Linking.openURL(`https://${info.value}`);
              }}
              activeOpacity={info.action ? 0.7 : 1}
            >
              <View style={[styles.contactIcon, { backgroundColor: "#1A56DB18" }]}>
                <Feather name={info.icon as any} size={16} color="#1A56DB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.contactLabel, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>
                  {info.label}
                </Text>
                <Text style={[styles.contactValue, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
                  {info.value}
                </Text>
              </View>
              {info.action && (
                <Feather name="external-link" size={14} color={colors.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Links */}
      {MENU_ITEMS.map((section) => (
        <View key={section.section} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            {section.section}
          </Text>
          <View style={[styles.menuGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {section.items.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  idx < section.items.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + "18" }]}>
                  <Feather name={item.icon as any} size={16} color={item.color} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.text, fontFamily: "Inter_400Regular" }]}>
                  {item.label}
                </Text>
                <Feather name="chevron-right" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Version */}
      <View style={styles.versionRow}>
        <Text style={[styles.versionText, { color: colors.textMuted, fontFamily: "Inter_400Regular" }]}>
          App Pro v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1A56DB",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 30,
    color: "#fff",
  },
  companyName: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 6,
  },
  companyTagline: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 14,
  },
  companyMetaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  metaChipText: {
    color: "#94A3B8",
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    marginBottom: 12,
  },
  aboutCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
  },
  contactCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  contactLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
  },
  menuGroup: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
  },
  versionRow: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 8,
  },
  versionText: {
    fontSize: 12,
  },
});
