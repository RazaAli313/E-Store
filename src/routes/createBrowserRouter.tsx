import type { JSX } from 'react';
import React, { lazy, Suspense } from 'react';

import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { ROUTES } from '#/constants';
import { PrivateRoute } from '#/routes/PrivateRoute';
import RootLayout from './RootLayout';

const NotFound = lazy(() => import('#/pages/NotFound'));
const ProductDetail = lazy(() => import('#/pages/ProductDetail'));
const Products = lazy(() => import('#/pages/Products'));
const Unauthorized = lazy(() => import('#/pages/Unauthorized'));

// replace this with your own loading component
const LoadingFallback = (): JSX.Element => (
  <div className='flex items-center justify-center h-screen'>
    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary' />
  </div>
);
export const createPrivateRoute = (Component: React.ComponentType): JSX.Element => {
  return (
    <PrivateRoute>
      <Suspense fallback={<LoadingFallback />}>
        <Component />
      </Suspense>
    </PrivateRoute>
  );
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path={ROUTES.HOME} element={createPrivateRoute(Products)} />
      <Route path={ROUTES.PRODUCT_DETAIL} element={createPrivateRoute(ProductDetail)} />
      <Route
        path={ROUTES.UN_AUTHORIZED}
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Unauthorized />
          </Suspense>
        }
      />
      <Route
        path='*'
        element={
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        }
      />
    </Route>
  ),
  { basename: '/app' }
);
