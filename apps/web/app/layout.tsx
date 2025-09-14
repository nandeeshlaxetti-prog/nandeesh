import type { Metadata } from 'next'
import './globals.css'
import Navigation from './components/Navigation'
import FirebaseAuthProvider from './components/FirebaseAuthProvider'

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
        <FirebaseAuthProvider>
          <Navigation />
          {children}
        </FirebaseAuthProvider>
      </body>
    </html>
  )
}