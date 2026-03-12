export interface SparePart {
  id: string;
  name: string;
  category: string;
  machineCompatibility: string[];
  priceRange: string;
  availability: "In Stock" | "Made to Order" | "2-3 Days";
  image?: string;
  description: string;
}

export const SPARE_PART_CATEGORIES = [
  "All",
  "Rollers",
  "Bearings",
  "Cutting Blades",
  "Hydraulic Parts",
  "Electrical",
  "Fasteners",
  "Chains & Sprockets",
  "Shafts",
] as const;

export const SPARE_PARTS: SparePart[] = [
  {
    id: "SP001",
    name: "Forming Roller Set (16 Station)",
    category: "Rollers",
    machineCompatibility: ["RS-5000", "RF-2000"],
    priceRange: "₹25,000 – ₹45,000",
    availability: "Made to Order",
    description: "Precision ground D2 steel rollers, hardened to 58-62 HRC. Custom profile available.",
  },
  {
    id: "SP002",
    name: "Hydraulic Cutting Blade",
    category: "Cutting Blades",
    machineCompatibility: ["RS-5000", "RF-2000", "DW-1500"],
    priceRange: "₹8,000 – ₹15,000",
    availability: "In Stock",
    description: "High carbon steel blade, precision ground edges. Life: 50,000+ cuts.",
  },
  {
    id: "SP003",
    name: "SKF 6205 Deep Groove Bearing",
    category: "Bearings",
    machineCompatibility: ["RS-5000", "TG-3000", "RF-2000", "DW-1500"],
    priceRange: "₹350 – ₹800",
    availability: "In Stock",
    description: "Original SKF bearing, sealed type. Suitable for all standard forming stations.",
  },
  {
    id: "SP004",
    name: "Hydraulic Power Pack (5 HP)",
    category: "Hydraulic Parts",
    machineCompatibility: ["RS-5000", "RF-2000"],
    priceRange: "₹35,000 – ₹55,000",
    availability: "2-3 Days",
    description: "Complete hydraulic unit with pump, motor, tank, valves. Pressure: 200 bar.",
  },
  {
    id: "SP005",
    name: "PLC Controller (Siemens S7-1200)",
    category: "Electrical",
    machineCompatibility: ["RS-5000", "SAI-6.0"],
    priceRange: "₹18,000 – ₹25,000",
    availability: "2-3 Days",
    description: "Programmable logic controller with HMI touch panel. Pre-loaded with machine program.",
  },
  {
    id: "SP006",
    name: "Drive Chain (08B-1)",
    category: "Chains & Sprockets",
    machineCompatibility: ["RS-5000", "TG-3000", "RF-2000", "DW-1500"],
    priceRange: "₹1,200 – ₹2,500",
    availability: "In Stock",
    description: "Industrial roller chain, 5-meter length. Pitch: 12.7mm.",
  },
  {
    id: "SP007",
    name: "Main Drive Shaft (Hardened)",
    category: "Shafts",
    machineCompatibility: ["RS-5000", "RF-2000"],
    priceRange: "₹12,000 – ₹22,000",
    availability: "Made to Order",
    description: "EN31 alloy steel, induction hardened, precision ground. Length as per machine model.",
  },
  {
    id: "SP008",
    name: "Hex Bolt Set (M12 Grade 8.8)",
    category: "Fasteners",
    machineCompatibility: ["RS-5000", "TG-3000", "RF-2000", "DW-1500", "SAI-6.0"],
    priceRange: "₹500 – ₹1,200",
    availability: "In Stock",
    description: "High tensile bolts, pack of 50. Used for roller station assembly.",
  },
  {
    id: "SP009",
    name: "Sprocket (20 Teeth, 08B)",
    category: "Chains & Sprockets",
    machineCompatibility: ["RS-5000", "TG-3000", "RF-2000"],
    priceRange: "₹800 – ₹1,500",
    availability: "In Stock",
    description: "C45 steel sprocket, bore as per shaft size. Induction hardened teeth.",
  },
  {
    id: "SP010",
    name: "Hydraulic Cylinder (100mm Bore)",
    category: "Hydraulic Parts",
    machineCompatibility: ["RS-5000", "RF-2000", "DW-1500"],
    priceRange: "₹15,000 – ₹28,000",
    availability: "2-3 Days",
    description: "Double acting cylinder with chrome plated rod. Stroke: 200mm.",
  },
  {
    id: "SP011",
    name: "Encoder (Rotary, 1024 PPR)",
    category: "Electrical",
    machineCompatibility: ["RS-5000", "SAI-6.0"],
    priceRange: "₹3,500 – ₹6,000",
    availability: "In Stock",
    description: "Incremental rotary encoder for precise length measurement.",
  },
  {
    id: "SP012",
    name: "Decoiler Mandrel Expansion Kit",
    category: "Rollers",
    machineCompatibility: ["RS-5000", "RF-2000"],
    priceRange: "₹8,000 – ₹14,000",
    availability: "Made to Order",
    description: "Hydraulic mandrel expansion segments for coil holding. ID range: 450-530mm.",
  },
];
