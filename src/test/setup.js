import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Estende o método expect do Vitest com os matchers do testing-library
expect.extend(matchers)

// Mock do ResizeObserver que pode causar problemas em alguns testes
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

// Limpa após cada teste
afterEach(() => {
  cleanup()
})
