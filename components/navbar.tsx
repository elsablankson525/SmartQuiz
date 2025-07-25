"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GraduationCap, Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignIn = () => router.push("/login");
  const handleGetStarted = () => router.push("/signup");

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/subjects", label: "Subjects" },
    { href: "/learning-paths", label: "Learning Paths" },
    { href: "/analytics", label: "Analytics" },
    { href: "/leaderboard", label: "Community" },
  ];

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">SmartQuiz</h1>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Desktop Auth/Profile */}
        <div className="hidden md:flex gap-2 items-center">
          {status === "authenticated" && session?.user ? (
            <Link href="/profile" className="flex items-center">
              <Avatar>
                <AvatarImage src={session.user.image || "/placeholder-user.jpg"} alt={session.user.name || "User"} />
                <AvatarFallback>{session.user.name ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <>
              <Button variant="outline" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button onClick={handleGetStarted}>Get Started</Button>
            </>
          )}
        </div>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 border-t">
              {status === "authenticated" && session?.user ? (
                <Link href="/profile" className="flex-1 flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <Avatar>
                    <AvatarImage src={session.user.image || "/placeholder-user.jpg"} alt={session.user.name || "User"} />
                    <AvatarFallback>{session.user.name ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U"}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2">Profile</span>
                </Link>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignIn();
                    }}
                    className="flex-1 bg-transparent"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleGetStarted();
                    }}
                    className="flex-1"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
} 