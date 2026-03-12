import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { BUTTON_SHADOW, CARD_SHADOW, shadow3D } from "@/constants/shadows";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ROLES: { key: UserRole; label: string; icon: string; desc: string; gradient: [string, string] }[] = [
  { key: "machine_user", label: "Machine Buyer", icon: "settings", desc: "Purchase & manage machines", gradient: ["#1E40AF", "#3B82F6"] },
  { key: "supplier", label: "Supplier", icon: "truck", desc: "Supply raw materials", gradient: ["#059669", "#10B981"] },
  { key: "vendor", label: "Vendor", icon: "package", desc: "Spare parts & accessories", gradient: ["#D97706", "#F59E0B"] },
  { key: "job_seeker", label: "Job Seeker", icon: "briefcase", desc: "Find industrial jobs", gradient: ["#7C3AED", "#8B5CF6"] },
  { key: "employer", label: "Employer", icon: "users", desc: "Hire skilled workers", gradient: ["#DC2626", "#EF4444"] },
];

type AuthMode = "login" | "pin" | "role_select";

export default function LoginScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const { login, loginWithPin, loginWithBiometric } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("machine_user");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pinRefs = useRef<(TextInput | null)[]>([]);

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email, password, selectedRole);
      router.replace("/(tabs)");
    } catch {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  }, [email, password, selectedRole, login]);

  const handlePinLogin = useCallback(async () => {
    if (pin.length < 4) return;
    setLoading(true);
    try {
      await loginWithPin(pin);
      router.replace("/(tabs)");
    } catch {
      setError("Invalid PIN");
    }
    setLoading(false);
  }, [pin, loginWithPin]);

  const handleBiometric = useCallback(async () => {
    setLoading(true);
    try {
      await loginWithBiometric();
      router.replace("/(tabs)");
    } catch {
      setError("Biometric failed");
    }
    setLoading(false);
  }, [loginWithBiometric]);

  const handlePinChange = useCallback((text: string, index: number) => {
    const newPin = pin.split("");
    newPin[index] = text;
    const joined = newPin.join("").slice(0, 4);
    setPin(joined);
    if (text && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }
  }, [pin]);

  const renderRoleSelector = () => (
    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.roleSection}>
      <Text style={[styles.roleTitle, { color: colors.text }]}>Select Your Role</Text>
      <Text style={[styles.roleSubtitle, { color: colors.textSecondary }]}>
        Choose how you want to use Sai Rolotech
      </Text>
      <View style={styles.roleGrid}>
        {ROLES.map((role, i) => (
          <AnimatedPressable
            key={role.key}
            onPress={() => {
              setSelectedRole(role.key);
              setMode("login");
            }}
            style={[
              styles.roleCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              CARD_SHADOW,
            ]}
            scaleDown={0.95}
          >
            <LinearGradient
              colors={role.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.roleIcon}
            >
              <Feather name={role.icon as any} size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.roleLabel, { color: colors.text }]}>{role.label}</Text>
            <Text style={[styles.roleDesc, { color: colors.textMuted }]}>{role.desc}</Text>
          </AnimatedPressable>
        ))}
      </View>
    </Animated.View>
  );

  const renderPinEntry = () => (
    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.pinSection}>
      <View style={styles.pinIconWrap}>
        <LinearGradient colors={["#1E40AF", "#3B82F6"]} style={styles.pinIconBg}>
          <Ionicons name="keypad" size={32} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={[styles.pinTitle, { color: colors.text }]}>Enter Your PIN</Text>
      <Text style={[styles.pinSubtitle, { color: colors.textSecondary }]}>
        Enter your 4-digit security PIN
      </Text>
      <View style={styles.pinRow}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.pinBox,
              {
                backgroundColor: colors.card,
                borderColor: pin[i] ? "#1A56DB" : colors.border,
                borderWidth: pin[i] ? 2 : 1,
              },
              CARD_SHADOW,
            ]}
          >
            <TextInput
              ref={(ref) => { pinRefs.current[i] = ref; }}
              style={[styles.pinInput, { color: colors.text }]}
              keyboardType="number-pad"
              maxLength={1}
              secureTextEntry
              value={pin[i] || ""}
              onChangeText={(t) => handlePinChange(t, i)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace" && !pin[i] && i > 0) {
                  pinRefs.current[i - 1]?.focus();
                }
              }}
            />
          </View>
        ))}
      </View>

      <AnimatedPressable
        onPress={handlePinLogin}
        disabled={pin.length < 4 || loading}
        style={{ marginTop: 24, width: "100%" }}
      >
        <LinearGradient
          colors={["#1E40AF", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.loginBtn, BUTTON_SHADOW, { opacity: pin.length < 4 ? 0.5 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>Verify PIN</Text>
          )}
        </LinearGradient>
      </AnimatedPressable>

      <AnimatedPressable onPress={() => { setMode("login"); setPin(""); }} style={{ marginTop: 16 }}>
        <Text style={[styles.switchText, { color: colors.primary }]}>Use Password Instead</Text>
      </AnimatedPressable>
    </Animated.View>
  );

  const renderLoginForm = () => {
    const activeRole = ROLES.find((r) => r.key === selectedRole)!;
    return (
      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.formSection}>
        <AnimatedPressable
          onPress={() => setMode("role_select")}
          style={[styles.activeRoleBadge, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}
        >
          <LinearGradient colors={activeRole.gradient} style={styles.activeRoleIcon}>
            <Feather name={activeRole.icon as any} size={16} color="#fff" />
          </LinearGradient>
          <Text style={[styles.activeRoleText, { color: colors.text }]}>{activeRole.label}</Text>
          <Feather name="chevron-down" size={16} color={colors.textMuted} />
        </AnimatedPressable>

        {error ? (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={14} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="mail" size={18} color={colors.textMuted} style={{ marginRight: 12 }} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Email or Phone Number"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="lock" size={18} color={colors.textMuted} style={{ marginRight: 12 }} />
          <TextInput
            style={[styles.input, { color: colors.text, flex: 1 }]}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <AnimatedPressable onPress={() => setShowPassword(!showPassword)} haptic={false}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
          </AnimatedPressable>
        </View>

        <View style={styles.forgotRow}>
          <AnimatedPressable onPress={() => router.push("/auth/forgot-password")} haptic={false}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
          </AnimatedPressable>
        </View>

        <AnimatedPressable onPress={handleLogin} disabled={loading} style={{ width: "100%" }}>
          <LinearGradient
            colors={activeRole.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.loginBtn, BUTTON_SHADOW]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Sign In</Text>
                <Feather name="arrow-right" size={18} color="#fff" />
              </>
            )}
          </LinearGradient>
        </AnimatedPressable>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>or sign in with</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.altLoginRow}>
          <AnimatedPressable
            onPress={() => { setMode("pin"); setPin(""); }}
            style={[styles.altLoginBtn, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}
          >
            <Ionicons name="keypad" size={22} color="#7C3AED" />
            <Text style={[styles.altLoginLabel, { color: colors.text }]}>PIN</Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={handleBiometric}
            style={[styles.altLoginBtn, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}
          >
            <Ionicons name="finger-print" size={22} color="#1A56DB" />
            <Text style={[styles.altLoginLabel, { color: colors.text }]}>Biometric</Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={handleBiometric}
            style={[styles.altLoginBtn, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]}
          >
            <MaterialCommunityIcons name="face-recognition" size={22} color="#059669" />
            <Text style={[styles.altLoginLabel, { color: colors.text }]}>Face ID</Text>
          </AnimatedPressable>
        </View>

        <View style={styles.registerRow}>
          <Text style={[styles.registerText, { color: colors.textSecondary }]}>
            Don't have an account?{" "}
          </Text>
          <AnimatedPressable onPress={() => router.push("/auth/register")} haptic={false}>
            <Text style={[styles.registerLink, { color: colors.primary }]}>Register Now</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>
    );
  };

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
          <Animated.View entering={FadeInUp.duration(600)} style={styles.headerSection}>
            <LinearGradient
              colors={["#0F172A", "#1E293B", "#0F172A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.logoCard, shadow3D(20, "#000", 0.3)]}
            >
              <LinearGradient
                colors={["#1E40AF", "#3B82F6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoBadge}
              >
                <Text style={styles.logoText}>SR</Text>
              </LinearGradient>
              <View style={styles.logoTextWrap}>
                <Text style={styles.brandName}>Sai Rolotech</Text>
                <Text style={styles.brandTag}>Industrial Roll Forming Solutions</Text>
              </View>
            </LinearGradient>

            <View style={styles.trustRow}>
              <View style={styles.trustBadge}>
                <Feather name="shield" size={12} color="#10B981" />
                <Text style={[styles.trustText, { color: colors.textMuted }]}>Secure</Text>
              </View>
              <View style={styles.trustBadge}>
                <Feather name="award" size={12} color="#F59E0B" />
                <Text style={[styles.trustText, { color: colors.textMuted }]}>Trusted</Text>
              </View>
              <View style={styles.trustBadge}>
                <Feather name="check-circle" size={12} color="#3B82F6" />
                <Text style={[styles.trustText, { color: colors.textMuted }]}>Verified</Text>
              </View>
            </View>
          </Animated.View>

          {mode === "role_select" && renderRoleSelector()}
          {mode === "login" && renderLoginForm()}
          {mode === "pin" && renderPinEntry()}

          <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              Made in India 🇮🇳 • Rajkot, Gujarat
            </Text>
            <Text style={[styles.footerText, { color: colors.textMuted, fontSize: 11 }]}>
              © 2009-2026 Sai Rolotech. All rights reserved.
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20 },
  headerSection: { alignItems: "center", marginBottom: 24 },
  logoCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 16,
    width: "100%",
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  logoText: { fontSize: 24, fontWeight: "800", color: "#fff", letterSpacing: 1 },
  logoTextWrap: { flex: 1 },
  brandName: { fontSize: 22, fontWeight: "800", color: "#F1F5F9", letterSpacing: 0.5 },
  brandTag: { fontSize: 12, color: "#94A3B8", marginTop: 2, letterSpacing: 0.3 },
  trustRow: { flexDirection: "row", gap: 16 },
  trustBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  trustText: { fontSize: 12, fontWeight: "600" },
  roleSection: { width: "100%" },
  roleTitle: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 4 },
  roleSubtitle: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  roleGrid: { gap: 12 },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  roleLabel: { fontSize: 16, fontWeight: "700" },
  roleDesc: { fontSize: 12, marginTop: 2 },
  formSection: { width: "100%", alignItems: "center" },
  activeRoleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    alignSelf: "center",
  },
  activeRoleIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  activeRoleText: { fontSize: 14, fontWeight: "600", marginRight: 6 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    width: "100%",
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
    width: "100%",
  },
  input: { flex: 1, fontSize: 15, fontWeight: "500" },
  forgotRow: { alignSelf: "flex-end", marginBottom: 20 },
  forgotText: { fontSize: 13, fontWeight: "600" },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    width: "100%",
  },
  loginBtnText: { fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    width: "100%",
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontSize: 13, fontWeight: "500" },
  altLoginRow: { flexDirection: "row", gap: 12, width: "100%", justifyContent: "center" },
  altLoginBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  altLoginLabel: { fontSize: 12, fontWeight: "600" },
  registerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: { fontSize: 14 },
  registerLink: { fontSize: 14, fontWeight: "700" },
  pinSection: { width: "100%", alignItems: "center" },
  pinIconWrap: { marginBottom: 20 },
  pinIconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pinTitle: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  pinSubtitle: { fontSize: 14, marginBottom: 24 },
  pinRow: { flexDirection: "row", gap: 16 },
  pinBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  pinInput: { fontSize: 24, fontWeight: "700", textAlign: "center", width: "100%", height: "100%" },
  switchText: { fontSize: 14, fontWeight: "600" },
  footer: { alignItems: "center", marginTop: 32, gap: 4 },
  footerText: { fontSize: 12, fontWeight: "500" },
});
