/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Page from '../app/driver/home/page'
import { useRouter } from 'next/navigation'

 
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

jest.mock("aws-amplify/auth", () => ({
    fetchUserAttributes: jest.fn(() => Promise.resolve({
      "custom:role": "driver",
    })),
    getCurrentUser: jest.fn(() => Promise.resolve({
        username: "test-user",
        attributes: {
          email: "test@example.com",
        },
      })),
  }));

  const mockFetch = jest.fn()

  describe('Page', () => {
  
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('renders loading state initially', () => {
        render(<Page />)
        expect(screen.getByText(/Loading sponsor information.../i)).toBeInTheDocument()
      })
    
      it('displays error message when sponsor data fetch fails', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Failed to fetch sponsor data'))
        render(<Page />)
    
        await waitFor(() => {
          expect(screen.getByText(/Could not load sponsor info./i)).toBeInTheDocument()
        })
      })
    
      it('renders sponsor information when data is fetched successfully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            {
              sponsorCompanyName: 'Truckers Inc.',
              points: 150,
            },
          ]),
        })
    
        render(<Page />)
    
        await waitFor(() => {
          expect(screen.getByText('Truckers Inc.')).toBeInTheDocument()
          expect(screen.getByText('150')).toBeInTheDocument()
        })
      })
    
      it('renders message when no sponsor data is available', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        })
    
        render(<Page />)
    
        await waitFor(() => {
          expect(screen.getByText(/You are not currently connected to a sponsor company./i)).toBeInTheDocument()
        })
      })
    
      it('handles profile dropdown opening and closing', async () => {
        render(<Page />)
    
        // Click to open the profile dropdown
        fireEvent.click(screen.getByRole('button', { name: /profile/i }))
        expect(screen.getByText(/My Profile/i)).toBeInTheDocument()
        expect(screen.getByText(/Sign Out/i)).toBeInTheDocument()
    
        // Click to close the profile dropdown
        fireEvent.click(document.body)
        await waitFor(() => {
          expect(screen.queryByText(/My Profile/i)).toBeNull()
          expect(screen.queryByText(/Sign Out/i)).toBeNull()
        })
      })
    
      it('navigates to the profile page when "My Profile" is clicked', async () => {
        const pushMock = useRouter().push
        render(<Page />)
    
        fireEvent.click(screen.getByRole('button', { name: /profile/i }))
        fireEvent.click(screen.getByText(/My Profile/i))
    
        await waitFor(() => {
          expect(pushMock).toHaveBeenCalledWith('/profile')
        })
      })
    
      it('calls signOut and redirects to the home page when the sign out button is clicked', async () => {
        const signOutMock = jest.fn()
        const replaceMock = useRouter().replace
        render(<Page />)
    
        fireEvent.click(screen.getByRole('button', { name: /profile/i }))
        fireEvent.click(screen.getByText(/Sign Out/i))
    
        await waitFor(() => {
          expect(signOutMock).toHaveBeenCalled()
          expect(replaceMock).toHaveBeenCalledWith('/')
        })
    })
})
  
    
  
  
