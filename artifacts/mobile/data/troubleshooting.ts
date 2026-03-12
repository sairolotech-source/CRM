export interface TroubleshootingItem {
  id: string;
  problem: string;
  keywords: string[];
  machineTypes: string[];
  possibleCauses: { cause: string; likelihood: "High" | "Medium" | "Low" }[];
  solutions: string[];
  preventiveMeasure: string;
  urgency: "Critical" | "High" | "Medium" | "Low";
}

export const TROUBLESHOOTING_DATA: TroubleshootingItem[] = [
  {
    id: "T001",
    problem: "Sheet bending / Sheet bend ho rahi hai",
    keywords: ["bend", "bending", "curved", "tedhi", "straight nahi"],
    machineTypes: ["RS-5000", "RF-2000", "DW-1500"],
    possibleCauses: [
      { cause: "Roller alignment is off — rollers are not parallel", likelihood: "High" },
      { cause: "Sheet thickness mismatch — using wrong thickness coil", likelihood: "High" },
      { cause: "Uneven roller pressure on left/right side", likelihood: "Medium" },
      { cause: "Worn out rollers need replacement", likelihood: "Medium" },
      { cause: "Sheet coil has internal stress from manufacturing", likelihood: "Low" },
    ],
    solutions: [
      "Check and re-align all forming rollers using dial gauge",
      "Verify coil thickness matches machine specification",
      "Adjust pressure equally on both sides of each station",
      "Inspect rollers for wear — replace if groove depth >0.5mm",
      "Try reversing coil direction or use stress-free coil",
    ],
    preventiveMeasure: "Weekly roller alignment check, monthly wear inspection",
    urgency: "High",
  },
  {
    id: "T002",
    problem: "Unusual noise during operation",
    keywords: ["noise", "awaaz", "sound", "khatkhata", "grinding", "vibration"],
    machineTypes: ["RS-5000", "TG-3000", "RF-2000", "DW-1500"],
    possibleCauses: [
      { cause: "Bearing failure or dry bearing", likelihood: "High" },
      { cause: "Loose bolts on roller stations", likelihood: "High" },
      { cause: "Chain tension too tight or too loose", likelihood: "Medium" },
      { cause: "Gear mesh misalignment", likelihood: "Medium" },
      { cause: "Motor coupling misalignment", likelihood: "Low" },
    ],
    solutions: [
      "Check all bearings — replace if noisy or rough rotation",
      "Tighten all station bolts to specified torque",
      "Adjust chain tension — 10-15mm slack recommended",
      "Re-align gear mesh using feeler gauge",
      "Check motor coupling alignment with laser tool",
    ],
    preventiveMeasure: "Daily lubrication, weekly bolt tightening check",
    urgency: "Critical",
  },
  {
    id: "T003",
    problem: "Hydraulic oil leaking",
    keywords: ["oil", "leak", "leaking", "hydraulic", "tel", "drip"],
    machineTypes: ["RS-5000", "RF-2000", "DW-1500"],
    possibleCauses: [
      { cause: "O-ring or seal failure in hydraulic cylinder", likelihood: "High" },
      { cause: "Loose hydraulic hose fitting", likelihood: "High" },
      { cause: "Cracked hydraulic hose", likelihood: "Medium" },
      { cause: "Cylinder rod scored or damaged", likelihood: "Medium" },
      { cause: "Pump seal failure", likelihood: "Low" },
    ],
    solutions: [
      "Replace O-rings and seals in affected cylinder",
      "Tighten all hydraulic fittings with proper wrench",
      "Replace cracked or aged hydraulic hoses",
      "Inspect cylinder rod — chrome plate if scored",
      "Replace pump seal kit if leak is from pump",
    ],
    preventiveMeasure: "Monthly hydraulic system inspection, check oil level daily",
    urgency: "High",
  },
  {
    id: "T004",
    problem: "Machine not starting / Power issue",
    keywords: ["start nahi", "not starting", "power", "chalu nahi", "motor", "electrical"],
    machineTypes: ["RS-5000", "TG-3000", "RF-2000", "DW-1500", "SAI-6.0"],
    possibleCauses: [
      { cause: "Emergency stop button is pressed", likelihood: "High" },
      { cause: "Main breaker tripped due to overload", likelihood: "High" },
      { cause: "PLC fault — error displayed on HMI", likelihood: "Medium" },
      { cause: "Motor overheated — thermal relay tripped", likelihood: "Medium" },
      { cause: "Wiring issue — loose connection in panel", likelihood: "Low" },
    ],
    solutions: [
      "Release emergency stop button and reset",
      "Check and reset main breaker, check for short circuit",
      "Read PLC error code on HMI, clear fault and restart",
      "Wait 10 minutes for motor to cool, check ventilation",
      "Check all connections in electrical panel with multimeter",
    ],
    preventiveMeasure: "Monthly electrical panel cleaning, check wire connections quarterly",
    urgency: "Critical",
  },
  {
    id: "T005",
    problem: "Profile dimensions not accurate",
    keywords: ["dimension", "size", "naap", "profile", "width", "height", "inaccurate"],
    machineTypes: ["RS-5000", "TG-3000", "RF-2000"],
    possibleCauses: [
      { cause: "Roller gap setting is incorrect", likelihood: "High" },
      { cause: "Side guide not properly positioned", likelihood: "High" },
      { cause: "Sheet width variation from supplier", likelihood: "Medium" },
      { cause: "Roller station spacing error", likelihood: "Low" },
    ],
    solutions: [
      "Recalibrate roller gaps using sample piece and feeler gauge",
      "Adjust side guides to correct width with equal clearance",
      "Measure incoming coil width — reject if out of spec",
      "Check station spacing matches design drawing",
    ],
    preventiveMeasure: "Check first piece dimensions before production run",
    urgency: "High",
  },
  {
    id: "T006",
    problem: "Cutting length not consistent",
    keywords: ["cutting", "length", "lambaai", "kat", "uneven", "measure"],
    machineTypes: ["RS-5000", "RF-2000", "DW-1500"],
    possibleCauses: [
      { cause: "Encoder calibration is off", likelihood: "High" },
      { cause: "Encoder wheel slipping on sheet", likelihood: "High" },
      { cause: "PLC length counter needs recalibration", likelihood: "Medium" },
      { cause: "Sheet speed variation during cutting", likelihood: "Medium" },
    ],
    solutions: [
      "Recalibrate encoder — measure 10 pieces and adjust factor",
      "Clean encoder wheel, increase spring pressure for grip",
      "Reset PLC counter and re-enter calibration values",
      "Check if machine stops during cut — adjust deceleration",
    ],
    preventiveMeasure: "Weekly encoder calibration check with tape measure",
    urgency: "Medium",
  },
  {
    id: "T007",
    problem: "Sheet surface scratches",
    keywords: ["scratch", "kharoch", "surface", "marks", "damage", "paint"],
    machineTypes: ["RS-5000", "TG-3000", "RF-2000"],
    possibleCauses: [
      { cause: "Metal debris stuck on roller surface", likelihood: "High" },
      { cause: "Roller surface damaged or rough", likelihood: "Medium" },
      { cause: "Side guide edges are sharp", likelihood: "Medium" },
      { cause: "Decoiler brake too tight causing drag marks", likelihood: "Low" },
    ],
    solutions: [
      "Clean all roller surfaces with cloth and solvent",
      "Polish roller surfaces or chrome plate if damaged",
      "File and smooth side guide edges, add PTFE tape",
      "Reduce decoiler brake pressure to minimum needed",
    ],
    preventiveMeasure: "Clean rollers after every coil change",
    urgency: "Medium",
  },
  {
    id: "T008",
    problem: "Machine speed is slow",
    keywords: ["slow", "speed", "dhima", "production", "output", "capacity"],
    machineTypes: ["RS-5000", "TG-3000", "RF-2000", "DW-1500", "SAI-6.0"],
    possibleCauses: [
      { cause: "VFD (drive) speed setting is low", likelihood: "High" },
      { cause: "Motor is overloaded — pulling more current", likelihood: "Medium" },
      { cause: "Chain/gear drive has high friction", likelihood: "Medium" },
      { cause: "Hydraulic system pressure is low", likelihood: "Medium" },
    ],
    solutions: [
      "Check VFD parameters — increase frequency setting if safe",
      "Check motor current with clamp meter — reduce load if high",
      "Lubricate all chains, gears, and bearings properly",
      "Check hydraulic pressure gauge — top up oil if low",
    ],
    preventiveMeasure: "Monthly speed test and lubrication schedule",
    urgency: "Medium",
  },
];

export const MAINTENANCE_SCHEDULE = [
  { task: "Roller lubrication (grease all bearings)", frequency: "Daily", icon: "droplet" },
  { task: "Check chain tension and lubricate", frequency: "Daily", icon: "link" },
  { task: "Inspect hydraulic oil level", frequency: "Daily", icon: "thermometer" },
  { task: "Tighten all station bolts", frequency: "Weekly", icon: "tool" },
  { task: "Check roller alignment with dial gauge", frequency: "Weekly", icon: "crosshair" },
  { task: "Clean electrical panel and check connections", frequency: "Monthly", icon: "zap" },
  { task: "Replace hydraulic filters", frequency: "3 Months", icon: "filter" },
  { task: "Change hydraulic oil (Grade 68)", frequency: "6 Months", icon: "refresh-cw" },
  { task: "Full machine inspection and calibration", frequency: "Yearly", icon: "clipboard" },
];

export function findTroubleshootingSolutions(query: string): TroubleshootingItem[] {
  const q = query.toLowerCase();
  return TROUBLESHOOTING_DATA.filter(
    (item) =>
      item.problem.toLowerCase().includes(q) ||
      item.keywords.some((k) => q.includes(k.toLowerCase()))
  );
}
