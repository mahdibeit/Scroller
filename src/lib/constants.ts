export interface Influencer {
  id: string;
  name: string;
  followers: string;
  productCount: number;
  bio?: string;
  imageUrl: string;
}

export const categoryNames = {
  tech: "TECH",
  fitness: "FITNESS",
  beauty: "BEAUTY",
  home: "HOME",
  fashion: "FASHION",
} as const;

// Mock data for influencers by category
export const influencersByCategory: Record<string, Influencer[]> = {
  tech: [
    {
      id: "linustechtips",
      name: "Linus Tech Tips",
      followers: "13.8M",
      productCount: 42,
      imageUrl: "/influencers/linustechtips/profile.jpg",
      bio: "Tech reviews, guides, and unboxings from the LTT team",
    },
    {
      id: "ijustine",
      name: "iJustine",
      followers: "7.2M",
      productCount: 36,
      imageUrl: "/influencers/ijustine/profile.jpg",
      bio: "Tech enthusiast covering Apple products, gadgets, and gaming",
    },
    {
      id: "mkbhd",
      name: "MKBHD",
      followers: "16.5M",
      productCount: 28,
      imageUrl: "/influencers/mkbhd/profile.jpg",
      bio: "Quality tech videos and in-depth product reviews",
    },
    {
      id: "unboxtherapy",
      name: "Unbox Therapy",
      followers: "18.2M",
      productCount: 45,
      imageUrl: "/influencers/unboxtherapy/profile.jpg",
      bio: "Unboxing and reviewing the latest tech gadgets",
    },
    {
      id: "theverge",
      name: "The Verge",
      followers: "3.4M",
      productCount: 32,
      imageUrl: "/influencers/theverge/profile.jpg",
      bio: "The latest in tech news, reviews, and features",
    },
    {
      id: "techlinked",
      name: "TechLinked",
      followers: "1.8M",
      productCount: 24,
      imageUrl: "/influencers/techlinked/profile.jpg",
      bio: "Fast-paced tech news and product coverage",
    },
  ],
  fitness: [
    {
      id: "fitnesswithpamela",
      name: "Fitness with Pamela",
      followers: "2.4M",
      productCount: 38,
      imageUrl: "/influencers/fitnesswithpamela/profile.jpg",
      bio: "Home workouts, fitness tips, and healthy lifestyle recommendations",
    },
    {
      id: "athleanx",
      name: "AthleanX",
      followers: "12.7M",
      productCount: 42,
      imageUrl: "/influencers/athleanx/profile.jpg",
      bio: "Science-based fitness and workout techniques",
    },
    {
      id: "blogilates",
      name: "Blogilates",
      followers: "5.8M",
      productCount: 35,
      imageUrl: "/influencers/blogilates/profile.jpg",
      bio: "Pilates workouts and fitness motivation",
    },
    {
      id: "jeffnippard",
      name: "Jeff Nippard",
      followers: "3.2M",
      productCount: 28,
      imageUrl: "/influencers/jeffnippard/profile.jpg",
      bio: "Science-based bodybuilding and strength training",
    },
  ],
  beauty: [],
  home: [],
  fashion: [],
};
