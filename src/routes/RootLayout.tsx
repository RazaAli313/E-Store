import type { JSX } from 'react';

import { Outlet } from 'react-router-dom';

import { StoreFooter } from '#/components/layout';
import RouteFocus from './RouteFocus';

const RootLayout = (): JSX.Element => (
  <div className='flex min-h-screen flex-col bg-[#f5f6fb]'>
    <RouteFocus />
    <div className='flex flex-1 flex-col'>
      <Outlet />
    </div>
    <StoreFooter />
  </div>
);

export default RootLayout;
