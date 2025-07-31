'use client'

import { ReactNode } from "react"
import type { Session } from "next-auth"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomSessionProvider } from "@/components/session-provider"
import Navbar from "@/components/navbar"
import ErrorBoundary from "@/components/error-boundary"
import AuthGuard from "@/components/auth-guard"

interface ClientLayoutProps {
  children: ReactNode
  session?: Session | null
}

export default function ClientLayout({ children, session }: ClientLayoutProps) {
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