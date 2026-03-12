import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { BUTTON_SHADOW, CARD_SHADOW, shadow3D } from "@/constants/shadows";

type Step = "phone" | "otp" | "reset" | "success";

export default function ForgotPasswordScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const { sendOtp, verifyOtp, resetPassword } = useAuth();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const otpRefs = useRef<(TextInput | null)[]>([]);

  const handleSendOtp = useCallback(async () => {
    if (!phone.trim() || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await sendOtp(phone);
      setStep("otp");
    } catch {
      setError("Failed to send OTP");
    }
    setLoading(false);
  }, [phone, sendOtp]);

  const handleVerifyOtp = useCallback(async () => {
    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyOtp(phone, otp);
      setStep("reset");
    } catch {
      setError("Invalid OTP. Please try again.");
    }
    setLoading(false);
  }, [otp, phone, verifyOtp]);

  const handleResetPassword = useCallback(async () => {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(phone, newPassword);
      setStep("success");
    } catch {
      setError("Failed to reset password");
    }
    setLoading(false);
  }, [newPassword, confirmPassword, phone, resetPassword]);

  const handleOtpChange = useCallback(
    (text: string, index: number) => {
      const chars = otp.split("");
      chars[index] = text;
      const joined = chars.join("").slice(0, 6);
      setOtp(joined);
      if (text && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const renderPhoneStep = () => (
    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.stepContent}>
      <View style={styles.iconWrap}>
        <LinearGradient colors={["#D97706", "#F59E0B"]} style={styles.stepIcon}>
          <Feather name="smartphone" size={28} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Forgot Password?</Text>
      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
        Enter your registered phone number. We'll send you a 6-digit OTP to verify your identity.
      </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Feather name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.countryCode, { color: colors.textMuted }]}>+91</Text>
        <View style={[styles.inputDivider, { backgroundColor: colors.border }]} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Phone Number"
          placeholderTextColor={colors.textMuted}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <AnimatedPressable onPress={handleSendOtp} disabled={loading} style={{ width: "100%", marginTop: 8 }}>
        <LinearGradient
          colors={["#D97706", "#F59E0B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.actionBtn, BUTTON_SHADOW]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.actionBtnText}>Send OTP</Text>
              <Feather name="send" size={18} color="#fff" />
            </>
          )}
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );

  const renderOtpStep = () => (
    <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.stepContent}>
      <View style={styles.iconWrap}>
        <LinearGradient colors={["#059669", "#10B981"]} style={styles.stepIcon}>
          <Feather name="message-circle" size={28} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Verify OTP</Text>
      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
        Enter the 6-digit code sent to +91 {phone}
      </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Feather name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.otpRow}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={[
              styles.otpBox,
              {
                backgroundColor: colors.card,
                borderColor: otp[i] ? "#059669" : colors.border,
                borderWidth: otp[i] ? 2 : 1,
              },
            ]}
          >
            <TextInput
              ref={(ref) => { otpRefs.current[i] = ref; }}
              style={[styles.otpInput, { color: colors.text }]}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[i] || ""}
              onChangeText={(t) => handleOtpChange(t, i)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace" && !otp[i] && i > 0) {
                  otpRefs.current[i - 1]?.focus();
                }
              }}
            />
          </View>
        ))}
      </View>

      <AnimatedPressable onPress={handleVerifyOtp} disabled={loading} style={{ width: "100%", marginTop: 16 }}>
        <LinearGradient
          colors={["#059669", "#10B981"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.actionBtn, BUTTON_SHADOW]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionBtnText}>Verify Code</Text>
          )}
        </LinearGradient>
      </AnimatedPressable>

      <AnimatedPressable onPress={handleSendOtp} style={{ marginTop: 16 }}>
        <Text style={[styles.resendText, { color: colors.primary }]}>Resend OTP</Text>
      </AnimatedPressable>
    </Animated.View>
  );

  const renderResetStep = () => (
    <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.stepContent}>
      <View style={styles.iconWrap}>
        <LinearGradient colors={["#1E40AF", "#3B82F6"]} style={styles.stepIcon}>
          <Feather name="key" size={28} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Set New Password</Text>
      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
        Create a strong password for your account
      </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Feather name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="lock" size={18} color={colors.textMuted} style={{ marginRight: 12 }} />
        <TextInput
          style={[styles.input, { color: colors.text, flex: 1 }]}
          placeholder="New Password"
          placeholderTextColor={colors.textMuted}
          value={newPassword}
          onChangeText={setNewPassword}
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
          placeholder="Confirm Password"
          placeholderTextColor={colors.textMuted}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
        />
      </View>

      <AnimatedPressable onPress={handleResetPassword} disabled={loading} style={{ width: "100%", marginTop: 8 }}>
        <LinearGradient
          colors={["#1E40AF", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.actionBtn, BUTTON_SHADOW]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionBtnText}>Reset Password</Text>
          )}
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );

  const renderSuccess = () => (
    <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.stepContent}>
      <View style={styles.iconWrap}>
        <LinearGradient colors={["#059669", "#10B981"]} style={[styles.stepIcon, { width: 80, height: 80, borderRadius: 24 }]}>
          <Feather name="check" size={40} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Password Reset!</Text>
      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
        Your password has been successfully reset. You can now sign in with your new password.
      </Text>

      <AnimatedPressable onPress={() => router.back()} style={{ width: "100%", marginTop: 16 }}>
        <LinearGradient
          colors={["#1E40AF", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.actionBtn, BUTTON_SHADOW]}
        >
          <Text style={styles.actionBtnText}>Back to Sign In</Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );

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
          <Animated.View entering={FadeInUp.duration(400)}>
            <View style={styles.headerRow}>
              <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
                <Feather name="arrow-left" size={22} color={colors.text} />
              </AnimatedPressable>
              <View style={{ flex: 1 }}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Password Recovery</Text>
              </View>
            </View>

            <View style={styles.progressRow}>
              {["phone", "otp", "reset", "success"].map((s, i) => (
                <View
                  key={s}
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor:
                        ["phone", "otp", "reset", "success"].indexOf(step) >= i
                          ? "#1A56DB"
                          : colors.border,
                      width: step === s ? 24 : 8,
                    },
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          {step === "phone" && renderPhoneStep()}
          {step === "otp" && renderOtpStep()}
          {step === "reset" && renderResetStep()}
          {step === "success" && renderSuccess()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 12 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  progressRow: { flexDirection: "row", gap: 6, marginBottom: 32, paddingLeft: 52 },
  progressDot: { height: 8, borderRadius: 4 },
  stepContent: { width: "100%", alignItems: "center" },
  iconWrap: { marginBottom: 20 },
  stepIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: { fontSize: 24, fontWeight: "800", marginBottom: 8, textAlign: "center" },
  stepDesc: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 24, paddingHorizontal: 10 },
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
  countryCode: { fontSize: 15, fontWeight: "600", marginRight: 8 },
  inputDivider: { width: 1, height: 20, marginRight: 12 },
  otpRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  otpBox: {
    width: 46,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  otpInput: { fontSize: 22, fontWeight: "700", textAlign: "center", width: "100%", height: "100%" },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  actionBtnText: { fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  resendText: { fontSize: 14, fontWeight: "600" },
});
