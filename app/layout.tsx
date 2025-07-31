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

// Initialize server on startup
if (typeof window === 'undefined') {
  initializeServer().catch(console.error);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Validate session and clear any stale data
  const session = await validateSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ClientLayout session={session}>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
