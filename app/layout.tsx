import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomSessionProvider } from "@/components/session-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navbar from "@/components/navbar";

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
  console.log("LAYOUT SERVER SESSION:", session);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CustomSessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Navbar />
            {children}
          </ThemeProvider>
        </CustomSessionProvider>
      </body>
    </html>
  )
}
