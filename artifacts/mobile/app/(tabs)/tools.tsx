import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import Animated, { FadeIn, FadeInDown, SlideInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";
import AnimatedPressable from "@/components/AnimatedPressable";
import { CARD_SHADOW, CARD_SHADOW_LG, BUTTON_SHADOW } from "@/constants/shadows";

type ToolId = "roi" | "emi" | "gst" | "rf";

const TOOLS = [
  { id: "roi" as ToolId, title: "ROI Calculator", subtitle: "Calculate return on machine investment", icon: "trending-up", color: "#10B981", gradient: ["#059669", "#10B981"] },
  { id: "emi" as ToolId, title: "EMI Calculator", subtitle: "Calculate monthly EMI for finance", icon: "credit-card", color: "#1A56DB", gradient: ["#1E40AF", "#3B82F6"] },
  { id: "gst" as ToolId, title: "GST Calculator", subtitle: "Compute GST on machine purchase", icon: "percent", color: "#F59E0B", gradient: ["#D97706", "#F59E0B"] },
  { id: "rf" as ToolId, title: "RF Calculator", subtitle: "Calculate roll forming parameters", icon: "settings", color: "#8B5CF6", gradient: ["#7C3AED", "#8B5CF6"] },
] as const;

const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const Field = React.memo(function Field({ label, value, onChange, colors }: { label: string; value: string; onChange: (v: string) => void; colors: any }) {
  return (
    <View>
      <Text style={[s.fieldLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{label}</Text>
      <TextInput
        style={[s.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }, CARD_SHADOW]}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
});

const ResultCard = React.memo(function ResultCard({ title, color, gradient, results, subColor }: { title: string; color: string; gradient: readonly string[]; results: { label: string; value: string }[]; subColor: string }) {
  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <LinearGradient colors={[gradient[0] + "15", gradient[1] + "08"]} style={[s.resultCard, { borderColor: color + "40" }, CARD_SHADOW]}>
        <Text style={[s.resultTitle, { color, fontFamily: "Inter_700Bold" }]}>{title}</Text>
        {results.map((r) => (
          <View key={r.label} style={s.resultRow}>
            <Text style={[s.resultLabel, { color: subColor, fontFamily: "Inter_400Regular" }]}>{r.label}</Text>
            <Text style={[s.resultValue, { color, fontFamily: "Inter_700Bold" }]}>{r.value}</Text>
          </View>
        ))}
      </LinearGradient>
    </Animated.View>
  );
});

function ROICalc({ colors }: { colors: any }) {
  const [machinePrice, setMachinePrice] = useState("1500000");
  const [dailyProduction, setDailyProduction] = useState("500");
  const [sellingPrice, setSellingPrice] = useState("65");
  const [costPerKg, setCostPerKg] = useState("45");
  const [workingDays, setWorkingDays] = useState("26");
  const results = useMemo(() => {
    const price = parseFloat(machinePrice) || 0; const prod = parseFloat(dailyProduction) || 0;
    const sell = parseFloat(sellingPrice) || 0; const cost = parseFloat(costPerKg) || 0; const days = parseFloat(workingDays) || 26;
    const mp = (sell - cost) * prod * days; const ap = mp * 12;
    return [{ label: "Monthly Profit", value: `₹${fmt(mp)}` }, { label: "Annual Profit", value: `₹${fmt(ap)}` }, { label: "Payback Period", value: `${(price > 0 ? price / mp : 0).toFixed(1)} months` }, { label: "ROI", value: `${(price > 0 ? (ap / price) * 100 : 0).toFixed(1)}%` }];
  }, [machinePrice, dailyProduction, sellingPrice, costPerKg, workingDays]);
  return (
    <View style={s.calcGap}>
      <Field label="Machine Price (₹)" value={machinePrice} onChange={setMachinePrice} colors={colors} />
      <Field label="Daily Production (kg)" value={dailyProduction} onChange={setDailyProduction} colors={colors} />
      <Field label="Selling Price (₹/kg)" value={sellingPrice} onChange={setSellingPrice} colors={colors} />
      <Field label="Material Cost (₹/kg)" value={costPerKg} onChange={setCostPerKg} colors={colors} />
      <Field label="Working Days/Month" value={workingDays} onChange={setWorkingDays} colors={colors} />
      <ResultCard title="Results" color="#10B981" gradient={["#059669", "#10B981"]} results={results} subColor={colors.textSecondary} />
    </View>
  );
}

function EMICalc({ colors }: { colors: any }) {
  const [principal, setPrincipal] = useState("1500000"); const [rate, setRate] = useState("12"); const [tenure, setTenure] = useState("36");
  const results = useMemo(() => {
    const p = parseFloat(principal) || 0; const r = (parseFloat(rate) || 0) / 12 / 100; const n = parseFloat(tenure) || 1;
    const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); const total = emi * n;
    return [{ label: "Monthly EMI", value: `₹${fmt(emi)}` }, { label: "Total Amount", value: `₹${fmt(total)}` }, { label: "Total Interest", value: `₹${fmt(total - p)}` }];
  }, [principal, rate, tenure]);
  return (
    <View style={s.calcGap}>
      <Field label="Loan Amount (₹)" value={principal} onChange={setPrincipal} colors={colors} />
      <Field label="Annual Interest Rate (%)" value={rate} onChange={setRate} colors={colors} />
      <Field label="Tenure (months)" value={tenure} onChange={setTenure} colors={colors} />
      <ResultCard title="Results" color="#1A56DB" gradient={["#1E40AF", "#3B82F6"]} results={results} subColor={colors.textSecondary} />
    </View>
  );
}

function GSTCalc({ colors }: { colors: any }) {
  const [amount, setAmount] = useState("1500000"); const [gstRate, setGstRate] = useState("18");
  const results = useMemo(() => {
    const a = parseFloat(amount) || 0; const g = parseFloat(gstRate) || 0; const gst = (a * g) / 100;
    return [{ label: "GST Amount", value: `₹${fmt(gst)}` }, { label: "Total with GST", value: `₹${fmt(a + gst)}` }];
  }, [amount, gstRate]);
  return (
    <View style={s.calcGap}>
      <Field label="Machine Price (₹)" value={amount} onChange={setAmount} colors={colors} />
      <Field label="GST Rate (%)" value={gstRate} onChange={setGstRate} colors={colors} />
      <View style={s.gstRow}>
        {["5", "12", "18", "28"].map((r) => (
          <AnimatedPressable key={r} onPress={() => setGstRate(r)} scaleDown={0.92}>
            {gstRate === r ? (
              <LinearGradient colors={["#D97706", "#F59E0B"]} style={[s.gstChip, BUTTON_SHADOW]}>
                <Text style={[s.gstChipText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>{r}%</Text>
              </LinearGradient>
            ) : (
              <View style={[s.gstChip, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, borderWidth: 1 }]}>
                <Text style={[s.gstChipText, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>{r}%</Text>
              </View>
            )}
          </AnimatedPressable>
        ))}
      </View>
      <ResultCard title="Results" color="#F59E0B" gradient={["#D97706", "#F59E0B"]} results={results} subColor={colors.textSecondary} />
    </View>
  );
}

function RFCalc({ colors }: { colors: any }) {
  const [speed, setSpeed] = useState("20"); const [shifts, setShifts] = useState("1"); const [hoursPerShift, setHoursPerShift] = useState("8");
  const results = useMemo(() => {
    const sp = parseFloat(speed) || 0; const sh = parseFloat(shifts) || 1; const h = parseFloat(hoursPerShift) || 8;
    return [{ label: "Production/Hour", value: `${fmt(sp * 60)} meters` }, { label: "Production/Day", value: `${fmt(sp * 60 * h * sh)} meters` }];
  }, [speed, shifts, hoursPerShift]);
  return (
    <View style={s.calcGap}>
      <Field label="Machine Speed (m/min)" value={speed} onChange={setSpeed} colors={colors} />
      <Field label="Number of Shifts" value={shifts} onChange={setShifts} colors={colors} />
      <Field label="Hours per Shift" value={hoursPerShift} onChange={setHoursPerShift} colors={colors} />
      <ResultCard title="Production Capacity" color="#8B5CF6" gradient={["#7C3AED", "#8B5CF6"]} results={results} subColor={colors.textSecondary} />
    </View>
  );
}

const CALC_MAP: Record<ToolId, React.ComponentType<{ colors: any }>> = { roi: ROICalc, emi: EMICalc, gst: GSTCalc, rf: RFCalc };

export default function ToolsScreen() {
  const { colors, topInset, bottomInset } = useTheme();
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const activeMeta = useMemo(() => (activeTool ? TOOLS.find((t) => t.id === activeTool) : null), [activeTool]);
  const ActiveCalc = activeTool ? CALC_MAP[activeTool] : null;

  const handleToolSelect = useCallback((id: ToolId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTool(id);
  }, []);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTool(null);
  }, []);

  return (
    <View style={[s.flex, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: topInset + 12, borderBottomColor: colors.border, borderBottomWidth: activeTool ? StyleSheet.hairlineWidth : 0 }]}>
        {activeTool ? (
          <View style={s.headerRow}>
            <AnimatedPressable onPress={handleBack} style={[s.backBtn, { backgroundColor: colors.backgroundSecondary }]} scaleDown={0.9}>
              <Feather name="arrow-left" size={18} color={colors.text} />
            </AnimatedPressable>
            <View style={s.flex}>
              <Text style={[s.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>{activeMeta?.title}</Text>
              <Text style={[s.headerSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{activeMeta?.subtitle}</Text>
            </View>
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={[s.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Business Tools</Text>
            <Text style={[s.headerSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>Industrial calculators & utilities</Text>
          </Animated.View>
        )}
      </View>

      <ScrollView style={s.flex} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: bottomInset + 20, gap: 14 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {!activeTool ? (
          TOOLS.map((tool, idx) => (
            <Animated.View key={tool.id} entering={FadeInDown.delay(idx * 80).duration(300)}>
              <AnimatedPressable onPress={() => handleToolSelect(tool.id)} style={[s.toolCard, { backgroundColor: colors.card, borderColor: colors.border }, CARD_SHADOW]} scaleDown={0.97}>
                <LinearGradient colors={[...tool.gradient]} style={s.toolIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Feather name={tool.icon as any} size={24} color="#fff" />
                </LinearGradient>
                <View style={s.toolText}>
                  <Text style={[s.toolTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>{tool.title}</Text>
                  <Text style={[s.toolSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{tool.subtitle}</Text>
                </View>
                <View style={[s.toolArrow, { backgroundColor: colors.backgroundSecondary }]}>
                  <Feather name="chevron-right" size={16} color={colors.textMuted} />
                </View>
              </AnimatedPressable>
            </Animated.View>
          ))
        ) : (
          <Animated.View entering={SlideInRight.duration(250)}>
            {ActiveCalc && <ActiveCalc colors={colors} />}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 24, marginBottom: 2 },
  headerSubtitle: { fontSize: 13 },
  toolCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  toolIcon: { width: 52, height: 52, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  toolText: { flex: 1, gap: 4 },
  toolTitle: { fontSize: 16 },
  toolSubtitle: { fontSize: 13 },
  toolArrow: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  calcGap: { gap: 14 },
  fieldLabel: { fontSize: 13, marginBottom: 6 },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  resultCard: { borderRadius: 16, borderWidth: 1, padding: 18, gap: 10, marginTop: 8 },
  resultTitle: { fontSize: 16, marginBottom: 4 },
  resultRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  resultLabel: { fontSize: 14 },
  resultValue: { fontSize: 16 },
  gstRow: { flexDirection: "row", gap: 8 },
  gstChip: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  gstChipText: { fontSize: 14 },
});
