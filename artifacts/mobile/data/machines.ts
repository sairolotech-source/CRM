export type Machine = {
  id: string;
  name: string;
  model: string;
  category: string;
  capacity: string;
  power: string;
  speed: string;
  price: string;
  description: string;
  tags: string[];
};

export type MachineDetail = Machine & {
  weight?: string;
  dimensions?: string;
  rollers?: string;
  color: string;
  specs: { label: string; value: string }[];
  features: string[];
};

export const CATEGORIES = [
  "All",
  "Rolling Shutter",
  "False Ceiling",
  "Door & Window",
  "Roofing & Cladding",
  "Structural",
  "Solar & Infrastructure",
  "Drywall & Partition",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  "Rolling Shutter": "#1A56DB",
  "False Ceiling": "#10B981",
  "Door & Window": "#F59E0B",
  "Roofing & Cladding": "#64748B",
  Structural: "#8B5CF6",
  "Solar & Infrastructure": "#0EA5E9",
  "Drywall & Partition": "#EF4444",
};

export const MACHINES: Machine[] = [
  {
    id: "1",
    name: "Rolling Shutter Machine",
    model: "RS-5000",
    category: "Rolling Shutter",
    capacity: "2-4 tons/hr",
    power: "15 kW",
    speed: "25 m/min",
    price: "₹12-18 Lakhs",
    description:
      "High-speed rolling shutter patti making machine with automatic stacking",
    tags: ["High Speed", "Auto Stack", "ISO Certified"],
  },
  {
    id: "2",
    name: "T-Grid Ceiling Machine",
    model: "TG-3000",
    category: "False Ceiling",
    capacity: "1.5-2 tons/hr",
    power: "11 kW",
    speed: "20 m/min",
    price: "₹8-12 Lakhs",
    description:
      "T-Grid false ceiling section making machine for commercial projects",
    tags: ["Precision", "Low Noise"],
  },
  {
    id: "3",
    name: "C-Purlin Machine",
    model: "CP-8000",
    category: "Structural",
    capacity: "3-5 tons/hr",
    power: "22 kW",
    speed: "30 m/min",
    price: "₹20-28 Lakhs",
    description:
      "Heavy-duty C-Purlin roll forming machine for structural applications",
    tags: ["Heavy Duty", "PLC Control", "Auto Change"],
  },
  {
    id: "4",
    name: "Trapezoidal Sheet Machine",
    model: "TR-6000",
    category: "Roofing & Cladding",
    capacity: "4-6 tons/hr",
    power: "18 kW",
    speed: "35 m/min",
    price: "₹15-22 Lakhs",
    description:
      "Trapezoidal roofing sheet forming machine with auto cutter",
    tags: ["High Speed", "Auto Cut"],
  },
  {
    id: "5",
    name: "Door Frame Machine",
    model: "DF-4000",
    category: "Door & Window",
    capacity: "1-2 tons/hr",
    power: "9 kW",
    speed: "15 m/min",
    price: "₹6-10 Lakhs",
    description:
      "Steel door frame roll forming machine with punch holes",
    tags: ["Compact", "Energy Saver"],
  },
  {
    id: "6",
    name: "Solar Channel Machine",
    model: "SC-2000",
    category: "Solar & Infrastructure",
    capacity: "2-3 tons/hr",
    power: "13 kW",
    speed: "22 m/min",
    price: "₹10-16 Lakhs",
    description:
      "Solar mounting structure channel forming machine for renewable energy",
    tags: ["Solar Ready", "PLC"],
  },
  {
    id: "7",
    name: "Stud & Track Machine",
    model: "ST-3500",
    category: "Drywall & Partition",
    capacity: "1.5-2.5 tons/hr",
    power: "10 kW",
    speed: "18 m/min",
    price: "₹7-11 Lakhs",
    description:
      "Light gauge steel stud and track forming machine for drywall partitions",
    tags: ["Lightweight", "Fast Setup"],
  },
  {
    id: "8",
    name: "Z-Purlin Machine",
    model: "ZP-7000",
    category: "Structural",
    capacity: "3-4 tons/hr",
    power: "20 kW",
    speed: "28 m/min",
    price: "₹18-25 Lakhs",
    description:
      "Heavy-duty Z-Purlin roll forming machine with adjustable size",
    tags: ["Adjustable", "Heavy Duty"],
  },
];

export const MACHINE_DETAILS: Record<string, MachineDetail> = {
  "1": {
    ...MACHINES[0],
    weight: "3.5 tons",
    dimensions: "12m x 1.2m x 1.5m",
    rollers: "18 stages",
    color: "#1A56DB",
    specs: [
      { label: "Production Capacity", value: "2-4 tons/hr" },
      { label: "Machine Speed", value: "25 m/min" },
      { label: "Motor Power", value: "15 kW" },
      { label: "Total Weight", value: "3.5 tons" },
      { label: "Dimensions", value: "12m x 1.2m x 1.5m" },
      { label: "Roller Stages", value: "18 stages" },
      { label: "Material Thickness", value: "0.3-0.8 mm" },
      { label: "Material Width", value: "90 mm" },
    ],
    features: [
      "PLC control system with touchscreen HMI",
      "Automatic stacking & counting system",
      "Hydraulic decoiler with auto feeder",
      "Flying shear cutting with servo motor",
      "Remote diagnostics capability",
      "CE certified design",
    ],
  },
  "2": {
    ...MACHINES[1],
    color: "#10B981",
    specs: [
      { label: "Production Capacity", value: "1.5-2 tons/hr" },
      { label: "Machine Speed", value: "20 m/min" },
      { label: "Motor Power", value: "11 kW" },
      { label: "Material Thickness", value: "0.25-0.5 mm" },
      { label: "Profile Width", value: "38 mm / 24 mm" },
    ],
    features: [
      "High precision roller dies",
      "Auto cutting to length",
      "Compact design",
      "Low maintenance",
      "Energy efficient motor",
    ],
  },
  "3": {
    ...MACHINES[2],
    color: "#8B5CF6",
    specs: [
      { label: "Production Capacity", value: "3-5 tons/hr" },
      { label: "Machine Speed", value: "30 m/min" },
      { label: "Motor Power", value: "22 kW" },
      { label: "Profile Range", value: "C100 to C300" },
      { label: "Material Thickness", value: "1.5-3.0 mm" },
    ],
    features: [
      "PLC + servo motor control",
      "Automatic size changeover",
      "Hydraulic post-cut system",
      "Heavy-duty construction",
      "Built-in straightener",
    ],
  },
  "4": {
    ...MACHINES[3],
    color: "#64748B",
    specs: [
      { label: "Production Capacity", value: "4-6 tons/hr" },
      { label: "Machine Speed", value: "35 m/min" },
      { label: "Motor Power", value: "18 kW" },
      { label: "Sheet Width", value: "1000-1250 mm" },
      { label: "Material Thickness", value: "0.3-0.8 mm" },
    ],
    features: [
      "Fully automatic operation",
      "Servo driven flying cut",
      "Touch screen HMI",
      "Auto stacker system",
    ],
  },
  "5": {
    ...MACHINES[4],
    color: "#F59E0B",
    specs: [
      { label: "Production Capacity", value: "1-2 tons/hr" },
      { label: "Machine Speed", value: "15 m/min" },
      { label: "Motor Power", value: "9 kW" },
      { label: "Frame Width", value: "75-100 mm" },
      { label: "Material Thickness", value: "0.8-1.5 mm" },
    ],
    features: [
      "Automatic punch & notch",
      "Compact footprint",
      "Quick changeover",
      "Energy efficient drive",
    ],
  },
  "6": {
    ...MACHINES[5],
    color: "#0EA5E9",
    specs: [
      { label: "Production Capacity", value: "2-3 tons/hr" },
      { label: "Machine Speed", value: "22 m/min" },
      { label: "Motor Power", value: "13 kW" },
      { label: "Channel Size", value: "41x41 / 41x21 mm" },
      { label: "Material Thickness", value: "1.0-2.5 mm" },
    ],
    features: [
      "Solar panel mounting ready",
      "PLC controlled production",
      "Multi-profile capability",
      "Corrosion resistant rollers",
    ],
  },
  "7": {
    ...MACHINES[6],
    color: "#EF4444",
    specs: [
      { label: "Production Capacity", value: "1.5-2.5 tons/hr" },
      { label: "Machine Speed", value: "18 m/min" },
      { label: "Motor Power", value: "10 kW" },
      { label: "Stud Width", value: "50-150 mm" },
      { label: "Material Thickness", value: "0.45-1.2 mm" },
    ],
    features: [
      "Dual profile (stud + track)",
      "Quick profile changeover",
      "Light gauge optimized",
      "Low noise operation",
    ],
  },
  "8": {
    ...MACHINES[7],
    color: "#8B5CF6",
    specs: [
      { label: "Production Capacity", value: "3-4 tons/hr" },
      { label: "Machine Speed", value: "28 m/min" },
      { label: "Motor Power", value: "20 kW" },
      { label: "Profile Range", value: "Z100 to Z250" },
      { label: "Material Thickness", value: "1.5-3.0 mm" },
    ],
    features: [
      "Adjustable profile width",
      "Heavy-duty roller design",
      "Hydraulic cut system",
      "PLC with memory storage",
    ],
  },
};

export const MACHINE_TYPES = [
  "Rolling Shutter Machine",
  "T-Grid Ceiling Machine",
  "C-Purlin Machine",
  "Trapezoidal Sheet Machine",
  "Door Frame Machine",
  "Solar Channel Machine",
  "Stud & Track Machine",
  "Z-Purlin Machine",
  "Other",
];
