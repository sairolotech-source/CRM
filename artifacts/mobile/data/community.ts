export interface CommunityPost {
  id: string;
  author: {
    name: string;
    company?: string;
    avatar: string;
    isVerified: boolean;
    isPremium: boolean;
    trustScore: number;
  };
  content: string;
  images?: string[];
  machineTags?: string[];
  supplierTag?: string;
  type: "question" | "photo" | "problem" | "promotion" | "discussion";
  isSponsored: boolean;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  createdAt: string;
  isFlagged?: boolean;
}

export interface BannerAd {
  id: string;
  supplierName: string;
  supplierLogo: string;
  productImage: string;
  productName: string;
  tagline: string;
  gradient: [string, string];
  isPremium: boolean;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export const BANNER_ADS: BannerAd[] = [
  {
    id: "ad1",
    supplierName: "Gujarat Steel Suppliers",
    supplierLogo: "GS",
    productImage: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600",
    productName: "Premium HR Steel Coils",
    tagline: "Best quality steel for roll forming",
    gradient: ["#059669", "#10B981"],
    isPremium: true,
  },
  {
    id: "ad2",
    supplierName: "Rajkot Industrial Parts",
    supplierLogo: "RI",
    productImage: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600",
    productName: "CNC Precision Rollers",
    tagline: "Custom rollers for any machine",
    gradient: ["#1E40AF", "#3B82F6"],
    isPremium: true,
  },
  {
    id: "ad3",
    supplierName: "Patel Hydraulics",
    supplierLogo: "PH",
    productImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
    productName: "Hydraulic Decoilers",
    tagline: "5 Ton capacity, auto-centering",
    gradient: ["#D97706", "#F59E0B"],
    isPremium: true,
  },
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "1",
    author: { name: "Rajesh Patel", company: "Rajesh Steel Works", avatar: "RP", isVerified: true, isPremium: false, trustScore: 4.5 },
    content: "Our RS-5000 machine has been running for 3 months straight without any issues. Sai Rolotech quality is unmatched! Production speed is consistently at 25 m/min. 💪",
    images: ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400"],
    machineTags: ["RS-5000", "Rolling Shutter"],
    type: "photo",
    isSponsored: false,
    likes: 47,
    comments: 12,
    shares: 5,
    isLiked: false,
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    author: { name: "Gujarat Steel Suppliers", company: "Premium Supplier", avatar: "GS", isVerified: true, isPremium: true, trustScore: 4.8 },
    content: "🔥 SPECIAL OFFER: Premium HR Steel Coils at 15% discount for Sai Rolotech machine owners! Limited stock available. Contact us for bulk pricing.\n\n✅ 2mm thickness\n✅ 1250mm width\n✅ IS 2062 Grade",
    images: ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400"],
    supplierTag: "Gujarat Steel Suppliers",
    type: "promotion",
    isSponsored: true,
    likes: 23,
    comments: 8,
    shares: 15,
    isLiked: true,
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    author: { name: "Amit Shah", company: "Shah Fabrication", avatar: "AS", isVerified: false, isPremium: false, trustScore: 3.8 },
    content: "Need help! My T-Grid machine roller is making unusual noise during operation. Any suggestions from experienced operators? Already checked the lubrication.",
    machineTags: ["TG-3000", "T-Grid Ceiling"],
    type: "problem",
    isSponsored: false,
    likes: 8,
    comments: 15,
    shares: 2,
    isLiked: false,
    createdAt: "8 hours ago",
  },
  {
    id: "4",
    author: { name: "Vikram Singh", company: "Singh Roofing", avatar: "VS", isVerified: true, isPremium: false, trustScore: 4.2 },
    content: "Just completed a 50,000 sqft roofing project using Sai Rolotech RF-2000 sheets. The precision and consistency of the profiles are excellent. Sharing some production photos.",
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400",
    ],
    machineTags: ["RF-2000", "Roofing"],
    type: "photo",
    isSponsored: false,
    likes: 62,
    comments: 19,
    shares: 8,
    isLiked: true,
    createdAt: "1 day ago",
  },
  {
    id: "5",
    author: { name: "Sai Rolotech Official", company: "Sai Rolotech", avatar: "SR", isVerified: true, isPremium: true, trustScore: 5.0 },
    content: "📢 Announcing our new SAI-6.0 Solar Panel Mounting Structure Machine! Features include automatic punching, 40 m/min speed, and IoT-enabled remote monitoring. Visit our catalog for details.",
    images: ["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400"],
    machineTags: ["SAI-6.0", "Solar"],
    type: "discussion",
    isSponsored: false,
    likes: 156,
    comments: 43,
    shares: 67,
    isLiked: false,
    createdAt: "2 days ago",
  },
  {
    id: "6",
    author: { name: "Prakash Kumar", company: "Kumar Industries", avatar: "PK", isVerified: false, isPremium: false, trustScore: 3.5 },
    content: "What's the recommended maintenance schedule for RS-5000? We've been running it for 6 months. Should we change the hydraulic oil or just top it up?",
    machineTags: ["RS-5000"],
    type: "question",
    isSponsored: false,
    likes: 12,
    comments: 22,
    shares: 1,
    isLiked: false,
    createdAt: "3 days ago",
  },
];

export const SAMPLE_COMMENTS: Comment[] = [
  { id: "c1", author: "Sai Rolotech Support", avatar: "SR", text: "Great to hear! Feel free to reach out if you need any spare parts.", time: "1h ago", likes: 5 },
  { id: "c2", author: "Mahesh Joshi", avatar: "MJ", text: "Which model exactly? I had similar experience with mine.", time: "2h ago", likes: 2 },
  { id: "c3", author: "Ravi Desai", avatar: "RD", text: "Amazing production quality! What coil thickness are you using?", time: "3h ago", likes: 3 },
];

export const POST_TYPES = ["All", "Questions", "Photos", "Problems", "Promotions", "Discussions"] as const;
export type PostTypeFilter = typeof POST_TYPES[number];

export const SPAM_RULES = {
  maxPostsPerDay: 3,
  maxCommentsPerMinute: 3,
  warningsBeforeFreeze: 3,
  freezeDurationHours: 24,
};
