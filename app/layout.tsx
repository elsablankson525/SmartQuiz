import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import ClientLayout from "@/components/client-layout"
import { continuousLearningSystem } from "@/lib/continuous-learning-system"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ByteBattle Quiz App",
  description: "AI-powered quiz application with continuous learning",
  generator: 'v0.dev'
}

// Initialize continuous learning system
if (typeof window === 'undefined') {
  // Only run on server side
  continuousLearningSystem.initialize().catch(console.error)
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
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
