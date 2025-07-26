import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomSessionProvider } from "@/components/session-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navbar from "@/components/navbar";
import ErrorBoundary from "@/components/error-boundary";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmartQuiz - Smart Learning Platform",
  description: "Personalized learning through intelligent quizzes and adaptive recommendations with SmartQuiz.",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CustomSessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ErrorBoundary>
              <Navbar />
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </CustomSessionProvider>
      </body>
    </html>
  )
}
