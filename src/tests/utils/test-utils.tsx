import type { JSX, ReactElement, ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { CommerceProvider } from '#/context';

const makeTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });

export const createWrapper = () => {
  const queryClient = makeTestQueryClient();

  return function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
}

const AllProviders = ({
  children,
  initialRoute = '/',
}: {
  children: ReactNode;
  initialRoute?: string;
}): JSX.Element => {
  const queryClient = makeTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CommerceProvider>
        <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
      </CommerceProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const { initialRoute, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => <AllProviders initialRoute={initialRoute}>{children}</AllProviders>,
    ...renderOptions,
  });
};

export * from '@testing-library/react';
export { customRender as render };
