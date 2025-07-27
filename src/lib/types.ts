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
  embedding_index: number;
}
