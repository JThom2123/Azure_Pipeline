/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'
 
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    pathname: '/',
    query: {},
  })),
}));

describe('Page', () => {
  it('renders a image', () => {
    render(<Page />)
 
    const image = screen.getByRole('img', { name:'Trucks' })
 
    expect(image).toBeInTheDocument()
  })
})