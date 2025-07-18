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
  ],
  fitness: [
    {
      id: "garagegymreviews",
      name: "Garage Gym Reviews",
      followers: "600K",
      productCount: 20,
      imageUrl: "/influencers/garagegymreviews/profile.jpg",
      bio: "Home workouts, fitness tips, and healthy lifestyle recommendations",
    },
    {
      id: "andreajeanco",
      name: "Andrea Jean Co",
      followers: "800K",
      productCount: 15,
      imageUrl: "/influencers/andreajeanco/profile.jpg",
      bio: "Amazon fashion & home finds, fitness tips, and lifestyle content",
    },
  ],
  beauty: [],
  home: [],
  fashion: [],
};
