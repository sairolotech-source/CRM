import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { BUTTON_SHADOW, CARD_SHADOW } from "@/constants/shadows";

const ROLES: { key: UserRole; label: string; icon: string; gradient: [string, string] }[] = [
  { key: "machine_user", label: "Machine Buyer", icon: "settings", gradient: ["#1E40AF", "#3B82F6"] },
  { key: "supplier", label: "Supplier", icon: "truck", gradient: ["#059669", "#10B981"] },
  { key: "vendor", label: "Vendor", icon: "package", gradient: ["#D97706", "#F59E0B"] },
  { key: "job_seeker", label: "Job Seeker", icon: "briefcase", gradient: ["#7C3AED", "#8B5CF6"] },
  { key: "employer", label: "Employer", icon: "users", gradient: ["#DC2626", "#EF4444"] },
];

export default function RegisterScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("machine_user");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeRole = ROLES.find((r) => r.key === selectedRole)!;

  const handleRegister = useCallback(async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({ name, email, phone, password, role: selectedRole, company });
      router.replace("/(tabs)");
    } catch {
      setError("Registration failed. Please try again.");
    }
    setLoading(false);
  }, [name, email, phone, password, confirmPassword, selectedRole, company, register]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: topInset + 10, paddingBottom: bottomInset + 30 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInUp.duration(500)}>
            <View style={styles.headerRow}>
              <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
                <Feather name="arrow-left" size={22} color={colors.text} />
              </AnimatedPressable>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Join Sai Rolotech platform
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.form}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>YOUR ROLE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleScroll}>
              {ROLES.map((role) => (
                <AnimatedPressable
                  key={role.key}
                  onPress={() => setSelectedRole(role.key)}
                  style={[
                    styles.roleChip,
                    {
                      backgroundColor: selectedRole === role.key ? "transparent" : colors.card,
                      borderColor: selectedRole === role.key ? role.gradient[0] : colors.border,
                      borderWidth: selectedRole === role.key ? 2 : 1,
                    },
                  ]}
                  scaleDown={0.95}
                >
                  {selectedRole === role.key ? (
                    <LinearGradient colors={role.gradient} style={StyleSheet.absoluteFill} />
                  ) : null}
                  <LinearGradient
                    colors={selectedRole === role.key ? ["transparent", "transparent"] : role.gradient}
                    style={styles.roleChipIcon}
                  >
                    <Feather name={role.icon as any} size={14} color="#fff" />
                  </LinearGradient>
                  <Text
                    style={[
                      styles.roleChipLabel,
                      { color: selectedRole === role.key ? "#fff" : colors.text },
                    ]}
                  >
                    {role.label}
                  </Text>
                </AnimatedPressable>
              ))}
            </ScrollView>

            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PERSONAL INFO</Text>

            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="user" size={18} color={colors.textMuted} style={{ marginRight: 12 }} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Full Name *"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="mail" size={18} color={colors.textMuted} style={{ marginRight: 12 }} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email Address *"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="phone" size={18} color={colors.textMuted} style={{ marginRight: 12 }} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Phone Number *"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {(selectedRole === "machine_user" || selectedRole === "supplier" || selectedRole === "vendor" || selectedRole === "employer") && (
              <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="briefcase" size={18} color={colors.textMuted} style={{ marginRight: 12 }} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Company Name"
                  placeholderTextColor={colors.textMuted}
                  value={company}
                  onChangeText={setCompany}
                />
              </View>
            )}

            <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: 8 }]}>SECURITY</Text>

            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="lock" size={18} color={colors.textMuted} style={{ marginRight: 12 }} />
              <TextInput
                style={[styles.input, { color: colors.text, flex: 1 }]}
                placeholder="Password *"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <AnimatedPressable onPress={() => setShowPassword(!showPassword)} haptic={false}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
              </AnimatedPressable>
            </View>

            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="check-circle" size={18} color={colors.textMuted} style={{ marginRight: 12 }} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Confirm Password *"
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            <AnimatedPressable onPress={handleRegister} disabled={loading} style={{ marginTop: 8 }}>
              <LinearGradient
                colors={activeRole.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.registerBtn, BUTTON_SHADOW]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.registerBtnText}>Create Account</Text>
                    <Feather name="arrow-right" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </AnimatedPressable>

            <View style={styles.loginRow}>
              <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                Already have an account?{" "}
              </Text>
              <AnimatedPressable onPress={() => router.back()} haptic={false}>
                <Text style={[styles.loginLink, { color: colors.primary }]}>Sign In</Text>
              </AnimatedPressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 24, gap: 12 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "800", letterSpacing: 0.3 },
  subtitle: { fontSize: 14, marginTop: 2 },
  form: { width: "100%" },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1.2, marginBottom: 10, marginTop: 4 },
  roleScroll: { marginBottom: 16 },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    overflow: "hidden",
  },
  roleChipIcon: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  roleChipLabel: { fontSize: 13, fontWeight: "600" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, color: "#EF4444", fontWeight: "500" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  input: { flex: 1, fontSize: 15, fontWeight: "500" },
  registerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  registerBtnText: { fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: { fontSize: 14 },
  loginLink: { fontSize: 14, fontWeight: "700" },
});
