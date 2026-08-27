import '@testing-library/jest-dom';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

import { server } from './mocks/server';

expect.extend(axeMatchers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  document.body.style.overflow = '';
});
afterAll(() => server.close());
