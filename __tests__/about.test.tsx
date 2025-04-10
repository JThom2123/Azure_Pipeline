/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AboutPage from '../app/aboutpage/page'
import { useRouter } from 'next/navigation'
import { fetchUserAttributes } from 'aws-amplify/auth'

// Mock the Next.js useRouter and AWS Amplify's fetchUserAttributes
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('aws-amplify/auth', () => ({
  fetchUserAttributes: jest.fn(() => Promise.resolve({
    'custom:role': 'Admin',
  })),
  getCurrentUser: jest.fn(() => Promise.resolve({
    username: "test-user",
    attributes: {
      email: "test@example.com",
    },
  })),
}))

// Mock fetch function
const mockFetch = jest.fn()

describe('AboutPage', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the AboutPage with loading state', () => {
    render(<AboutPage />)
    expect(screen.getByText(/loading.../i)).toBeInTheDocument()
  })

  it('displays an error message if there is an error fetching the data', async () => {
    // Mock an error in the fetch call
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch data'))
    render(<AboutPage />)

    await waitFor(() => {
      expect(screen.getByText(/error: failed to fetch data/i)).toBeInTheDocument()
    })
  })

  it('renders the page content when data is fetched', async () => {
    // Mock successful API call
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        {
          section_name: 'About Us',
          content: 'This is some about us content',
          last_updated: '2025-04-10',
        },
      ]),
    })

    render(<AboutPage />)

    await waitFor(() => {
      expect(screen.getByText('This is some about us content')).toBeInTheDocument()
    })
  })

  it('allows the user to enter edit mode and change content', async () => {
    // Mock successful API call
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        {
          section_name: 'About Us',
          content: 'This is some about us content',
          last_updated: '2025-04-10',
        },
      ]),
    })

    render(<AboutPage />)

    await waitFor(() => {
      expect(screen.getByText('This is some about us content')).toBeInTheDocument()
    })

    // Click the "Edit Page" button
    fireEvent.click(screen.getByRole('button', { name: /edit page/i }))
    
    // Change content in textarea
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Updated content!' } })

    expect(textarea.ariaValueText).toBe('Updated content!')
  })

  it('calls the save changes function when the save button is clicked', async () => {
    // Mock successful API call
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        {
          section_name: 'About Us',
          content: 'This is some about us content',
          last_updated: '2025-04-10',
        },
      ]),
    })

    render(<AboutPage />)

    await waitFor(() => {
      expect(screen.getByText('This is some about us content')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /edit page/i }))

    // Change content and click Save
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Updated content!' } })
    
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/about',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify([{ section_name: 'About Us', content: 'Updated content!', last_updated: '2025-04-10' }]),
        })
      )
    })
  })

  it('navigates to the correct page based on user role', () => {
    render(<AboutPage />)

    // Click the Home button
    fireEvent.click(screen.getByRole('button', { name: /home/i }))

    expect(useRouter().push).toHaveBeenCalledWith('/admin/home')
  })

  it('calls signOut and redirects to the home page when the sign out button is clicked', () => {
    render(<AboutPage />)

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    expect(screen.getByText(/loading.../i)).toBeInTheDocument() // Loading state due to router replace
    expect(useRouter().replace).toHaveBeenCalledWith('/')
  })
})
