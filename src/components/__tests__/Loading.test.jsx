import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingSpinner, LoadingWithText } from '../Loading'

describe('Loading Components', () => {
  describe('LoadingSpinner', () => {
    it('renders spinner', () => {
      render(<LoadingSpinner />)
      expect(document.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('LoadingWithText', () => {
    it('renders with default text', () => {
      render(<LoadingWithText />)
      expect(screen.getByText('Carregando...')).toBeInTheDocument()
    })

    it('renders with custom text', () => {
      const customText = 'Custom Loading...'
      render(<LoadingWithText text={customText} />)
      expect(screen.getByText(customText)).toBeInTheDocument()
    })
  })
})
