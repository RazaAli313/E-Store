export const ROUTES = {
  HOME: '/',
  PRODUCT_DETAIL: '/products/:id',
  AUTH: '/auth',
  UN_AUTHORIZED: '/un-authorized',
};

export const productDetailPath = (id: number) => `/products/${id}`;
