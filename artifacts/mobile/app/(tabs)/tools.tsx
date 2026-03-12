import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

type ToolId = "roi" | "emi" | "gst" | "rf";

const TOOLS = [
  {
    id: "roi" as ToolId,
    title: "ROI Calculator",
    subtitle: "Calculate return on machine investment",
    icon: "trending-up",
    color: "#10B981",
  },
  {
    id: "emi" as ToolId,
    title: "EMI Calculator",
    subtitle: "Calculate monthly EMI for finance",
    icon: "credit-card",
    color: "#1A56DB",
  },
  {
    id: "gst" as ToolId,
    title: "GST Calculator",
    subtitle: "Compute GST on machine purchase",
    icon: "percent",
    color: "#F59E0B",
  },
  {
    id: "rf" as ToolId,
    title: "RF Calculator",
    subtitle: "Calculate roll forming parameters",
    icon: "settings",
    color: "#8B5CF6",
  },
];

type CalcResult = {
  monthlyProfit?: number;
  annualProfit?: number;
  payback?: number;
  roi?: number;
  monthlyEmi?: number;
  totalAmount?: number;
  totalInterest?: number;
  gstAmount?: number;
  totalWithGst?: number;
  productionPerHour?: number;
  productionPerDay?: number;
};

function ROICalc({ isDark }: { isDark: boolean }) {
  const colors = isDark ? Colors.dark : Colors.light;
  const [machinePrice, setMachinePrice] = useState("1500000");
  const [dailyProduction, setDailyProduction] = useState("500");
  const [sellingPrice, setSellingPrice] = useState("65");
  const [costPerKg, setCostPerKg] = useState("45");
  const [workingDays, setWorkingDays] = useState("26");

  const calc = (): CalcResult => {
    const price = parseFloat(machinePrice) || 0;
    const prod = parseFloat(dailyProduction) || 0;
    const sell = parseFloat(sellingPrice) || 0;
    const cost = parseFloat(costPerKg) || 0;
    const days = parseFloat(workingDays) || 26;
    const profitPerKg = sell - cost;
    const dailyProfit = profitPerKg * prod;
    const annualProfit = dailyProfit * days * 12;
    const monthlyProfit = dailyProfit * days;
    const payback = price > 0 ? price / monthlyProfit : 0;
    const roi = price > 0 ? (annualProfit / price) * 100 : 0;
    return { monthlyProfit, annualProfit, payback, roi };
  };

  const result = calc();

  return (
    <View style={{ gap: 14 }}>
      {[
        { label: "Machine Price (₹)", value: machinePrice, setter: setMachinePrice },
        { label: "Daily Production (kg)", value: dailyProduction, setter: setDailyProduction },
        { label: "Selling Price (₹/kg)", value: sellingPrice, setter: setSellingPrice },
        { label: "Material Cost (₹/kg)", value: costPerKg, setter: setCostPerKg },
        { label: "Working Days/Month", value: workingDays, setter: setWorkingDays },
      ].map((field) => (
        <View key={field.label}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {field.label}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
            value={field.value}
            onChangeText={field.setter}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      ))}
      <View style={[styles.resultCard, { backgroundColor: "#10B98118", borderColor: "#10B981" }]}>
        <Text style={[styles.resultTitle, { color: "#10B981", fontFamily: "Inter_700Bold" }]}>
          Results
        </Text>
        {[
          { label: "Monthly Profit", value: `₹${result.monthlyProfit?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) || 0}` },
          { label: "Annual Profit", value: `₹${result.annualProfit?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) || 0}` },
          { label: "Payback Period", value: `${result.payback?.toFixed(1) || 0} months` },
          { label: "ROI", value: `${result.roi?.toFixed(1) || 0}%` },
        ].map((r) => (
          <View key={r.label} style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {r.label}
            </Text>
            <Text style={[styles.resultValue, { color: "#10B981", fontFamily: "Inter_700Bold" }]}>
              {r.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function EMICalc({ isDark }: { isDark: boolean }) {
  const colors = isDark ? Colors.dark : Colors.light;
  const [principal, setPrincipal] = useState("1500000");
  const [rate, setRate] = useState("12");
  const [tenure, setTenure] = useState("36");

  const calc = (): CalcResult => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 12 / 100;
    const n = parseFloat(tenure) || 1;
    const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - p;
    return { monthlyEmi: emi, totalAmount: total, totalInterest: interest };
  };

  const result = calc();

  return (
    <View style={{ gap: 14 }}>
      {[
        { label: "Loan Amount (₹)", value: principal, setter: setPrincipal },
        { label: "Annual Interest Rate (%)", value: rate, setter: setRate },
        { label: "Tenure (months)", value: tenure, setter: setTenure },
      ].map((field) => (
        <View key={field.label}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {field.label}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
            value={field.value}
            onChangeText={field.setter}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      ))}
      <View style={[styles.resultCard, { backgroundColor: "#1A56DB18", borderColor: "#1A56DB" }]}>
        <Text style={[styles.resultTitle, { color: "#1A56DB", fontFamily: "Inter_700Bold" }]}>
          Results
        </Text>
        {[
          { label: "Monthly EMI", value: `₹${result.monthlyEmi?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) || 0}` },
          { label: "Total Amount", value: `₹${result.totalAmount?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) || 0}` },
          { label: "Total Interest", value: `₹${result.totalInterest?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) || 0}` },
        ].map((r) => (
          <View key={r.label} style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {r.label}
            </Text>
            <Text style={[styles.resultValue, { color: "#1A56DB", fontFamily: "Inter_700Bold" }]}>
              {r.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function GSTCalc({ isDark }: { isDark: boolean }) {
  const colors = isDark ? Colors.dark : Colors.light;
  const [amount, setAmount] = useState("1500000");
  const [gstRate, setGstRate] = useState("18");

  const calc = (): CalcResult => {
    const a = parseFloat(amount) || 0;
    const g = parseFloat(gstRate) || 0;
    const gstAmount = a * g / 100;
    return { gstAmount, totalWithGst: a + gstAmount };
  };

  const result = calc();

  return (
    <View style={{ gap: 14 }}>
      {[
        { label: "Machine Price (₹)", value: amount, setter: setAmount },
        { label: "GST Rate (%)", value: gstRate, setter: setGstRate },
      ].map((field) => (
        <View key={field.label}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {field.label}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
            value={field.value}
            onChangeText={field.setter}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      ))}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {["5", "12", "18", "28"].map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              styles.gstChip,
              gstRate === r
                ? { backgroundColor: "#F59E0B" }
                : { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, borderWidth: 1 },
            ]}
            onPress={() => setGstRate(r)}
          >
            <Text style={[styles.gstChipText, { color: gstRate === r ? "#fff" : colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
              {r}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.resultCard, { backgroundColor: "#F59E0B18", borderColor: "#F59E0B" }]}>
        <Text style={[styles.resultTitle, { color: "#F59E0B", fontFamily: "Inter_700Bold" }]}>
          Results
        </Text>
        {[
          { label: "GST Amount", value: `₹${result.gstAmount?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) || 0}` },
          { label: "Total with GST", value: `₹${result.totalWithGst?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) || 0}` },
        ].map((r) => (
          <View key={r.label} style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {r.label}
            </Text>
            <Text style={[styles.resultValue, { color: "#F59E0B", fontFamily: "Inter_700Bold" }]}>
              {r.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function RFCalc({ isDark }: { isDark: boolean }) {
  const colors = isDark ? Colors.dark : Colors.light;
  const [speed, setSpeed] = useState("20");
  const [shifts, setShifts] = useState("1");
  const [hoursPerShift, setHoursPerShift] = useState("8");

  const calc = (): CalcResult => {
    const s = parseFloat(speed) || 0;
    const sh = parseFloat(shifts) || 1;
    const h = parseFloat(hoursPerShift) || 8;
    const productionPerHour = s * 60;
    const productionPerDay = productionPerHour * h * sh;
    return { productionPerHour, productionPerDay };
  };

  const result = calc();

  return (
    <View style={{ gap: 14 }}>
      {[
        { label: "Machine Speed (m/min)", value: speed, setter: setSpeed },
        { label: "Number of Shifts", value: shifts, setter: setShifts },
        { label: "Hours per Shift", value: hoursPerShift, setter: setHoursPerShift },
      ].map((field) => (
        <View key={field.label}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {field.label}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text, fontFamily: "Inter_400Regular" }]}
            value={field.value}
            onChangeText={field.setter}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      ))}
      <View style={[styles.resultCard, { backgroundColor: "#8B5CF618", borderColor: "#8B5CF6" }]}>
        <Text style={[styles.resultTitle, { color: "#8B5CF6", fontFamily: "Inter_700Bold" }]}>
          Production Capacity
        </Text>
        {[
          { label: "Production/Hour", value: `${result.productionPerHour?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) || 0} meters` },
          { label: "Production/Day", value: `${result.productionPerDay?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) || 0} meters` },
        ].map((r) => (
          <View key={r.label} style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {r.label}
            </Text>
            <Text style={[styles.resultValue, { color: "#8B5CF6", fontFamily: "Inter_700Bold" }]}>
              {r.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const CALC_COMPONENTS: Record<ToolId, React.ComponentType<{ isDark: boolean }>> = {
  roi: ROICalc,
  emi: EMICalc,
  gst: GSTCalc,
  rf: RFCalc,
};

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const ActiveCalc = activeTool ? CALC_COMPONENTS[activeTool] : null;
  const activeMeta = activeTool ? TOOLS.find((t) => t.id === activeTool) : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topInset + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            borderBottomWidth: activeTool ? StyleSheet.hairlineWidth : 0,
          },
        ]}
      >
        {activeTool ? (
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTool(null);
              }}
              style={[styles.backBtn, { backgroundColor: colors.backgroundSecondary }]}
            >
              <Feather name="arrow-left" size={18} color={colors.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                {activeMeta?.title}
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                {activeMeta?.subtitle}
              </Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              Business Tools
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Industrial calculators & utilities
            </Text>
          </>
        )}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20,
          gap: 14,
        }}
        showsVerticalScrollIndicator={false}
      >
        {!activeTool ? (
          TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[
                styles.toolCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTool(tool.id);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.toolIcon, { backgroundColor: tool.color + "18" }]}>
                <Feather name={tool.icon as any} size={24} color={tool.color} />
              </View>
              <View style={styles.toolText}>
                <Text style={[styles.toolTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  {tool.title}
                </Text>
                <Text style={[styles.toolSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  {tool.subtitle}
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))
        ) : (
          ActiveCalc && <ActiveCalc isDark={isDark} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
  },
  toolCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  toolIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  toolText: {
    flex: 1,
    gap: 4,
  },
  toolTitle: {
    fontSize: 16,
  },
  toolSubtitle: {
    fontSize: 13,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  resultCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    marginTop: 8,
  },
  resultTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 14,
  },
  resultValue: {
    fontSize: 16,
  },
  gstChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  gstChipText: {
    fontSize: 14,
  },
});
