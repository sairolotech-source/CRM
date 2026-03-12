import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";

type ToolId = "roi" | "emi" | "gst" | "rf";

const TOOLS = [
  { id: "roi" as ToolId, title: "ROI Calculator", subtitle: "Calculate return on machine investment", icon: "trending-up", color: "#10B981" },
  { id: "emi" as ToolId, title: "EMI Calculator", subtitle: "Calculate monthly EMI for finance", icon: "credit-card", color: "#1A56DB" },
  { id: "gst" as ToolId, title: "GST Calculator", subtitle: "Compute GST on machine purchase", icon: "percent", color: "#F59E0B" },
  { id: "rf" as ToolId, title: "RF Calculator", subtitle: "Calculate roll forming parameters", icon: "settings", color: "#8B5CF6" },
] as const;

const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const Field = React.memo(function Field({ label, value, onChange, colors }: { label: string; value: string; onChange: (v: string) => void; colors: any }) {
  return (
    <View>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
});

const ResultCard = React.memo(function ResultCard({ title, color, results, subColor }: { title: string; color: string; results: { label: string; value: string }[]; subColor: string }) {
  return (
    <View style={[styles.resultCard, { backgroundColor: color + "18", borderColor: color }]}>
      <Text style={[styles.resultTitle, { color, fontFamily: "Inter_700Bold" }]}>{title}</Text>
      {results.map((r) => (
        <View key={r.label} style={styles.resultRow}>
          <Text style={[styles.resultLabel, { color: subColor, fontFamily: "Inter_400Regular" }]}>{r.label}</Text>
          <Text style={[styles.resultValue, { color, fontFamily: "Inter_700Bold" }]}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
});

function ROICalc({ colors }: { colors: any }) {
  const [machinePrice, setMachinePrice] = useState("1500000");
  const [dailyProduction, setDailyProduction] = useState("500");
  const [sellingPrice, setSellingPrice] = useState("65");
  const [costPerKg, setCostPerKg] = useState("45");
  const [workingDays, setWorkingDays] = useState("26");

  const results = useMemo(() => {
    const price = parseFloat(machinePrice) || 0;
    const prod = parseFloat(dailyProduction) || 0;
    const sell = parseFloat(sellingPrice) || 0;
    const cost = parseFloat(costPerKg) || 0;
    const days = parseFloat(workingDays) || 26;
    const monthlyProfit = (sell - cost) * prod * days;
    const annualProfit = monthlyProfit * 12;
    const payback = price > 0 ? price / monthlyProfit : 0;
    const roi = price > 0 ? (annualProfit / price) * 100 : 0;
    return [
      { label: "Monthly Profit", value: `₹${fmt(monthlyProfit)}` },
      { label: "Annual Profit", value: `₹${fmt(annualProfit)}` },
      { label: "Payback Period", value: `${payback.toFixed(1)} months` },
      { label: "ROI", value: `${roi.toFixed(1)}%` },
    ];
  }, [machinePrice, dailyProduction, sellingPrice, costPerKg, workingDays]);

  return (
    <View style={styles.calcGap}>
      <Field label="Machine Price (₹)" value={machinePrice} onChange={setMachinePrice} colors={colors} />
      <Field label="Daily Production (kg)" value={dailyProduction} onChange={setDailyProduction} colors={colors} />
      <Field label="Selling Price (₹/kg)" value={sellingPrice} onChange={setSellingPrice} colors={colors} />
      <Field label="Material Cost (₹/kg)" value={costPerKg} onChange={setCostPerKg} colors={colors} />
      <Field label="Working Days/Month" value={workingDays} onChange={setWorkingDays} colors={colors} />
      <ResultCard title="Results" color="#10B981" results={results} subColor={colors.textSecondary} />
    </View>
  );
}

function EMICalc({ colors }: { colors: any }) {
  const [principal, setPrincipal] = useState("1500000");
  const [rate, setRate] = useState("12");
  const [tenure, setTenure] = useState("36");

  const results = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 12 / 100;
    const n = parseFloat(tenure) || 1;
    const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    return [
      { label: "Monthly EMI", value: `₹${fmt(emi)}` },
      { label: "Total Amount", value: `₹${fmt(total)}` },
      { label: "Total Interest", value: `₹${fmt(total - p)}` },
    ];
  }, [principal, rate, tenure]);

  return (
    <View style={styles.calcGap}>
      <Field label="Loan Amount (₹)" value={principal} onChange={setPrincipal} colors={colors} />
      <Field label="Annual Interest Rate (%)" value={rate} onChange={setRate} colors={colors} />
      <Field label="Tenure (months)" value={tenure} onChange={setTenure} colors={colors} />
      <ResultCard title="Results" color="#1A56DB" results={results} subColor={colors.textSecondary} />
    </View>
  );
}

function GSTCalc({ colors }: { colors: any }) {
  const [amount, setAmount] = useState("1500000");
  const [gstRate, setGstRate] = useState("18");

  const results = useMemo(() => {
    const a = parseFloat(amount) || 0;
    const g = parseFloat(gstRate) || 0;
    const gst = (a * g) / 100;
    return [
      { label: "GST Amount", value: `₹${fmt(gst)}` },
      { label: "Total with GST", value: `₹${fmt(a + gst)}` },
    ];
  }, [amount, gstRate]);

  return (
    <View style={styles.calcGap}>
      <Field label="Machine Price (₹)" value={amount} onChange={setAmount} colors={colors} />
      <Field label="GST Rate (%)" value={gstRate} onChange={setGstRate} colors={colors} />
      <View style={styles.gstRow}>
        {["5", "12", "18", "28"].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.gstChip, gstRate === r ? { backgroundColor: "#F59E0B" } : { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, borderWidth: 1 }]}
            onPress={() => setGstRate(r)}
          >
            <Text style={[styles.gstChipText, { color: gstRate === r ? "#fff" : colors.textSecondary, fontFamily: "Inter_500Medium" }]}>{r}%</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ResultCard title="Results" color="#F59E0B" results={results} subColor={colors.textSecondary} />
    </View>
  );
}

function RFCalc({ colors }: { colors: any }) {
  const [speed, setSpeed] = useState("20");
  const [shifts, setShifts] = useState("1");
  const [hoursPerShift, setHoursPerShift] = useState("8");

  const results = useMemo(() => {
    const s = parseFloat(speed) || 0;
    const sh = parseFloat(shifts) || 1;
    const h = parseFloat(hoursPerShift) || 8;
    const perHour = s * 60;
    const perDay = perHour * h * sh;
    return [
      { label: "Production/Hour", value: `${fmt(perHour)} meters` },
      { label: "Production/Day", value: `${fmt(perDay)} meters` },
    ];
  }, [speed, shifts, hoursPerShift]);

  return (
    <View style={styles.calcGap}>
      <Field label="Machine Speed (m/min)" value={speed} onChange={setSpeed} colors={colors} />
      <Field label="Number of Shifts" value={shifts} onChange={setShifts} colors={colors} />
      <Field label="Hours per Shift" value={hoursPerShift} onChange={setHoursPerShift} colors={colors} />
      <ResultCard title="Production Capacity" color="#8B5CF6" results={results} subColor={colors.textSecondary} />
    </View>
  );
}

const CALC_MAP: Record<ToolId, React.ComponentType<{ colors: any }>> = { roi: ROICalc, emi: EMICalc, gst: GSTCalc, rf: RFCalc };

const ToolCard = React.memo(function ToolCard({
  tool, cardBg, borderColor, textColor, subColor, mutedColor, onPress,
}: {
  tool: typeof TOOLS[number];
  cardBg: string; borderColor: string; textColor: string; subColor: string; mutedColor: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.toolCard, { backgroundColor: cardBg, borderColor }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.toolIcon, { backgroundColor: tool.color + "18" }]}>
        <Feather name={tool.icon as any} size={24} color={tool.color} />
      </View>
      <View style={styles.toolText}>
        <Text style={[styles.toolTitle, { color: textColor, fontFamily: "Inter_600SemiBold" }]}>{tool.title}</Text>
        <Text style={[styles.toolSubtitle, { color: subColor, fontFamily: "Inter_400Regular" }]}>{tool.subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={mutedColor} />
    </TouchableOpacity>
  );
});

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
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12, borderBottomColor: colors.border, borderBottomWidth: activeTool ? StyleSheet.hairlineWidth : 0 }]}>
        {activeTool ? (
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBack} style={[styles.backBtn, { backgroundColor: colors.backgroundSecondary }]}>
              <Feather name="arrow-left" size={18} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.flex}>
              <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>{activeMeta?.title}</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{activeMeta?.subtitle}</Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Business Tools</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>Industrial calculators & utilities</Text>
          </>
        )}
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: bottomInset + 20, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        {!activeTool ? (
          TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} cardBg={colors.card} borderColor={colors.border} textColor={colors.text} subColor={colors.textSecondary} mutedColor={colors.textMuted} onPress={() => handleToolSelect(tool.id)} />
          ))
        ) : (
          ActiveCalc && <ActiveCalc colors={colors} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 24, marginBottom: 2 },
  headerSubtitle: { fontSize: 13 },
  toolCard: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, padding: 16, gap: 14 },
  toolIcon: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  toolText: { flex: 1, gap: 4 },
  toolTitle: { fontSize: 16 },
  toolSubtitle: { fontSize: 13 },
  calcGap: { gap: 14 },
  fieldLabel: { fontSize: 13, marginBottom: 6 },
  input: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  resultCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 10, marginTop: 8 },
  resultTitle: { fontSize: 16, marginBottom: 4 },
  resultRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  resultLabel: { fontSize: 14 },
  resultValue: { fontSize: 16 },
  gstRow: { flexDirection: "row", gap: 8 },
  gstChip: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: "center" },
  gstChipText: { fontSize: 14 },
});
