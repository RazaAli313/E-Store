import type { JSX } from 'react';
import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

const RouteFocus = (): JSX.Element | null => {
  const { pathname } = useLocation();

  useEffect(() => {
    const focusHeading = (): boolean => {
      const heading = document.querySelector<HTMLElement>('main h1');
      if (!heading) return false;
      heading.tabIndex = -1;
      heading.focus();
      return true;
    };

    if (focusHeading()) return undefined;
    const observer = new MutationObserver(() => {
      if (focusHeading()) observer.disconnect();
    });
    observer.observe(document.getElementById('root') ?? document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
};

export default RouteFocus;
