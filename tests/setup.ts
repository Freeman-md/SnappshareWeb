import { vi } from 'vitest'

vi.stubGlobal('console', {
  ...console,
  warn: vi.fn(),
})