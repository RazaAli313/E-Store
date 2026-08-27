export const apiEndpoints = {
  POSTS: '/posts',
  PRODUCTS: '/products',
  PRODUCTS_SEARCH: '/products/search',
  PRODUCTS_CATEGORY_LIST: '/products/category-list',
  productsByCategory: (slug: string) => `/products/category/${slug}`,
  productDetail: (id: number) => `/products/${id}`,
};
