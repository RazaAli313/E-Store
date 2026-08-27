export interface ProductListItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  category: string;
  stock: number;
  brand?: string;
  description?: string;
  discountPercentage?: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDetailData extends ProductListItem {
  description: string;
  sku: string;
  shippingInformation: string;
  images: string[];
  reviews: ProductReview[];
}

export interface ProductsResponse {
  products: ProductListItem[];
  total: number;
  skip: number;
  limit: number;
}

export type CategoryList = string[];
