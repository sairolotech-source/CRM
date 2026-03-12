export type LeadSource = "IndiaMART" | "JustDial" | "TradeIndia" | "DirectCall" | "App" | "WhatsApp" | "Website" | "Referral";

export type LeadStatus = "New" | "Contacted" | "Interested" | "QuotationSent" | "FollowUp" | "Converted" | "Lost";

export type LeadQuality = "Hot" | "Warm" | "Cold";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  source: LeadSource;
  machineInterest: string;
  budget?: string;
  urgency?: "Immediate" | "1-3 Months" | "3-6 Months" | "Just Exploring";
  status: LeadStatus;
  quality: LeadQuality;
  notes?: string;
  createdAt: string;
  lastFollowUp?: string;
  nextFollowUp?: string;
}

export const LEAD_SOURCES: { key: LeadSource; label: string; icon: string; color: string; bg: string }[] = [
  { key: "IndiaMART", label: "IndiaMART", icon: "shopping-bag", color: "#1E40AF", bg: "#EFF6FF" },
  { key: "JustDial", label: "JustDial", icon: "search", color: "#0369A1", bg: "#E0F2FE" },
  { key: "TradeIndia", label: "TradeIndia", icon: "globe", color: "#059669", bg: "#F0FDF4" },
  { key: "DirectCall", label: "Direct Call", icon: "phone", color: "#D97706", bg: "#FEF3C7" },
  { key: "App", label: "App", icon: "smartphone", color: "#7C3AED", bg: "#F5F3FF" },
  { key: "WhatsApp", label: "WhatsApp", icon: "message-circle", color: "#059669", bg: "#F0FDF4" },
  { key: "Website", label: "Website", icon: "monitor", color: "#0EA5E9", bg: "#E0F2FE" },
  { key: "Referral", label: "Referral", icon: "users", color: "#EC4899", bg: "#FDF2F8" },
];

export const LEAD_STATUSES: { key: LeadStatus; label: string; color: string; bg: string }[] = [
  { key: "New", label: "New", color: "#1A56DB", bg: "#EFF6FF" },
  { key: "Contacted", label: "Contacted", color: "#0EA5E9", bg: "#E0F2FE" },
  { key: "Interested", label: "Interested", color: "#D97706", bg: "#FEF3C7" },
  { key: "QuotationSent", label: "Quote Sent", color: "#7C3AED", bg: "#F5F3FF" },
  { key: "FollowUp", label: "Follow Up", color: "#F59E0B", bg: "#FFFBEB" },
  { key: "Converted", label: "Converted", color: "#059669", bg: "#F0FDF4" },
  { key: "Lost", label: "Lost", color: "#EF4444", bg: "#FEF2F2" },
];

export const LEAD_QUALITIES: { key: LeadQuality; label: string; color: string; bg: string; icon: string }[] = [
  { key: "Hot", label: "Hot 🔥", color: "#EF4444", bg: "#FEF2F2", icon: "trending-up" },
  { key: "Warm", label: "Warm", color: "#F59E0B", bg: "#FFFBEB", icon: "sun" },
  { key: "Cold", label: "Cold", color: "#6B7280", bg: "#F3F4F6", icon: "cloud" },
];

export const URGENCY_OPTIONS = [
  { key: "Immediate", label: "Immediate", color: "#EF4444" },
  { key: "1-3 Months", label: "1-3 Months", color: "#F59E0B" },
  { key: "3-6 Months", label: "3-6 Months", color: "#0EA5E9" },
  { key: "Just Exploring", label: "Just Exploring", color: "#6B7280" },
] as const;

export function qualifyLead(budget?: string, urgency?: string, source?: LeadSource): LeadQuality {
  let score = 0;
  if (urgency === "Immediate") score += 3;
  else if (urgency === "1-3 Months") score += 2;
  else if (urgency === "3-6 Months") score += 1;

  if (source === "DirectCall" || source === "WhatsApp") score += 2;
  else if (source === "IndiaMART" || source === "JustDial") score += 1;

  if (budget) {
    const b = parseInt(budget.replace(/[^\d]/g, ""));
    if (b >= 500000) score += 2;
    else if (b >= 200000) score += 1;
  }

  if (score >= 5) return "Hot";
  if (score >= 3) return "Warm";
  return "Cold";
}

export const SAMPLE_LEADS: Lead[] = [
  {
    id: "L001",
    name: "Ramesh Patel",
    phone: "+91 98765 43210",
    city: "Ahmedabad",
    source: "IndiaMART",
    machineInterest: "Roofing Sheet Machine",
    budget: "₹8,00,000",
    urgency: "Immediate",
    status: "QuotationSent",
    quality: "Hot",
    notes: "Wants RS-5000, needs finance option",
    createdAt: "Today, 10:30 AM",
    lastFollowUp: "Today, 2:00 PM",
    nextFollowUp: "Tomorrow, 11:00 AM",
  },
  {
    id: "L002",
    name: "Suresh Shah",
    phone: "+91 87654 32109",
    city: "Rajkot",
    source: "JustDial",
    machineInterest: "Purlin Machine",
    budget: "₹12,00,000",
    urgency: "1-3 Months",
    status: "Interested",
    quality: "Warm",
    notes: "Comparing with competitors",
    createdAt: "Yesterday, 3:15 PM",
    lastFollowUp: "Today, 9:00 AM",
  },
  {
    id: "L003",
    name: "Amit Kumar",
    phone: "+91 76543 21098",
    city: "Delhi",
    source: "DirectCall",
    machineInterest: "False Ceiling Machine",
    budget: "₹5,00,000",
    urgency: "Immediate",
    status: "New",
    quality: "Hot",
    createdAt: "Today, 8:45 AM",
  },
  {
    id: "L004",
    name: "Vikram Singh",
    phone: "+91 65432 10987",
    city: "Jaipur",
    source: "TradeIndia",
    machineInterest: "Deck Sheet Machine",
    urgency: "3-6 Months",
    status: "Contacted",
    quality: "Warm",
    notes: "New factory, planning purchases",
    createdAt: "2 days ago",
    lastFollowUp: "Yesterday, 4:00 PM",
  },
  {
    id: "L005",
    name: "Prakash Mehta",
    phone: "+91 54321 09876",
    city: "Surat",
    source: "App",
    machineInterest: "Shutter Slat Machine",
    urgency: "Just Exploring",
    status: "New",
    quality: "Cold",
    createdAt: "3 days ago",
  },
  {
    id: "L006",
    name: "Dinesh Joshi",
    phone: "+91 43210 98765",
    city: "Mumbai",
    source: "WhatsApp",
    machineInterest: "Roofing Sheet Machine",
    budget: "₹10,00,000",
    urgency: "Immediate",
    status: "FollowUp",
    quality: "Hot",
    notes: "Ready to visit factory, needs demo",
    createdAt: "1 day ago",
    lastFollowUp: "Today, 11:00 AM",
    nextFollowUp: "Today, 5:00 PM",
  },
  {
    id: "L007",
    name: "Rajendra Patil",
    phone: "+91 32109 87654",
    city: "Pune",
    source: "Referral",
    machineInterest: "Cable Tray Machine",
    budget: "₹7,00,000",
    urgency: "1-3 Months",
    status: "Converted",
    quality: "Hot",
    notes: "Order confirmed, advance received",
    createdAt: "5 days ago",
    lastFollowUp: "2 days ago",
  },
  {
    id: "L008",
    name: "Kiran Desai",
    phone: "+91 21098 76543",
    city: "Vadodara",
    source: "IndiaMART",
    machineInterest: "Door Frame Machine",
    status: "Lost",
    quality: "Cold",
    notes: "Went with competitor",
    createdAt: "1 week ago",
  },
];
