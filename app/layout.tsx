import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { validateSession } from "@/lib/session-cleanup"
import { initializeServer } from "@/lib/init-server"
import ClientLayout from "@/components/client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Quiz",
  description: "AI-powered quiz application with continuous learning",
  generator: 'v0.dev'
}

// Initialize server on startup - only during runtime, not build time
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  initializeServer().catch(console.error);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Validate session and clear any stale data - only during runtime
  let session = null;
  let sessionError = null;
  
  if (process.env.NODE_ENV !== 'production') {
    try {
      session = await validateSession();
    } catch (error: unknown) {
      console.error("Session validation error:", error);
      session = null;
      
      // Check if it's a JWT decryption error
      if (error && typeof error === 'object' && 'message' in error && 
          (typeof error.message === 'string' && error.message.includes('decryption operation failed') || 
          'name' in error && error.name === 'JWEDecryptionFailed')) {
        sessionError = 'JWT_DECRYPTION_FAILED';
      }
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ClientLayout session={session} sessionError={sessionError}>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
