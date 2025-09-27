import type { Metadata } from 'next'
import './globals.css'
import Navigation from './components/Navigation'
import FirebaseAuthProvider from './components/FirebaseAuthProvider'
import AuthGuard from './components/AuthGuard'
import ClientMotionWrapper from '../components/anim/ClientMotionWrapper'
import { ThemeProvider } from '../components/theme-provider'
import { RouteProgress } from '../components/anim/RouteProgress'
import { ToastProvider } from '../components/ui/toast-provider'

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <ThemeProvider
          defaultTheme="system"
          storageKey="theme"
        >
          <ClientMotionWrapper>
            <RouteProgress />
            <ToastProvider>
              <FirebaseAuthProvider>
                <AuthGuard>
                  <Navigation />
                  {children}
                </AuthGuard>
              </FirebaseAuthProvider>
            </ToastProvider>
          </ClientMotionWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}