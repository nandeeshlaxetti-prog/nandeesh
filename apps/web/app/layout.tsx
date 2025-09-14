import type { Metadata } from 'next'
import './globals.css'
import Navigation from './components/Navigation'
import { AuthProvider } from './contexts/AuthContext'

export const metadata: Metadata = {
  title: 'LNN Legal Desktop',
  description: 'Legal Practice Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}