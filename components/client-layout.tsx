'use client'

import { ReactNode } from "react"
import type { Session } from "next-auth"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomSessionProvider } from "@/components/session-provider"
import Navbar from "@/components/navbar"
import ErrorBoundary from "@/components/error-boundary"
import AuthGuard from "@/components/auth-guard"
import SessionReset from "@/components/session-reset"

interface ClientLayoutProps {
  children: ReactNode
  session?: Session | null
  sessionError?: string | null
}

export default function ClientLayout({ children, session, sessionError }: ClientLayoutProps) {
  // If there's a session error, show the reset component
  if (sessionError === 'JWT_DECRYPTION_FAILED') {
    return (
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
      >
        <div className="min-h-screen bg-background flex items-center justify-center">
          <SessionReset error="Your authentication session has expired due to a system update. Please log in again." />
        </div>
      </ThemeProvider>
    )
  }

  return (
    <CustomSessionProvider session={session}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
      >
        <ErrorBoundary>
          <AuthGuard>
            <Navbar />
            {children}
          </AuthGuard>
        </ErrorBoundary>
      </ThemeProvider>
    </CustomSessionProvider>
  )
} 