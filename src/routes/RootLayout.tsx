import type { JSX } from 'react';

import { Outlet } from 'react-router-dom';

import RouteFocus from './RouteFocus';

const RootLayout = (): JSX.Element => (
  <>
    <RouteFocus />
    <Outlet />
  </>
);

export default RootLayout;
