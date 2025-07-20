export interface Product {
  merchandise: string;
  country: string;
  id: string;
  asin: string;
  title: string;
  price: string;
  main_image_url: string;
  page_url: string;
  description: string[];
  rating: string;
  scraped_at: string;
  review_count: number;
  tags: string[];
}

export const TAGS = [
  // Core categories
  "electronics",
  "books",
  "fitness",
  "toys",
  "kitchen",
  "fashion",
  "beauty",
  "health",
  "home",
  "garden",
  "office",
  "outdoors",
  "automotive",
  "tools",
  "music",
  "movies",
  "games",
  "pets",
  "baby",
  "grocery",
  "jewelry",
  "watches",
  "shoes",
  "bags",
  "sports",
  "crafts",
  "stationery",
  "cleaning",
  "bedding",
  "lighting",
  "furniture",
  "seasonal",
  "appliances",
  "travel",
  "smart home",
  "personal care",
  "mens clothing",
  "womens clothing",
  "kids clothing",
  "party supplies",
  "school supplies",
  "phones",
  "laptops",
  "gaming consoles",
  "cameras",
  "audio equipment",

  // Quirky / decorative / weird items
  "home decor",
  "novelty",
  "collectibles",
  "figurines",
  "statues",
  "gifts",
  "oddities",
  "retro",
  "vintage decor",
  "miniatures",
  "desk toys",
  "funny",
  "quirky",
  "art",
  "wall art",
  "crystals",
  "incense",
  "mystical",
  "witchy",
  "anime",
  "fandom collectibles",
  "pop culture",
  "sci fi",
  "fantasy",
];
