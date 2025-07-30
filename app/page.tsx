"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { 
  GraduationCap, 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  ArrowRight
} from "lucide-react";

export default function HomePage() {
  const { status } = useSession();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized recommendations based on your learning patterns and performance"
    },
    {
      icon: Target,
      title: "Adaptive Quizzes",
      description: "Dynamic difficulty adjustment to match your skill level and learning pace"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Comprehensive analytics and insights to monitor your learning journey"
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with fellow learners and compete on leaderboards"
    }
  ];

  const subjects = [
    { name: "Computer Science", color: "bg-blue-500", icon: "💻" },
    { name: "Mathematics", color: "bg-green-500", icon: "📐" },
    { name: "Science", color: "bg-purple-500", icon: "🔬" },
    { name: "History", color: "bg-yellow-500", icon: "📚" },
    { name: "Literature", color: "bg-red-500", icon: "📖" },
    { name: "Art", color: "bg-pink-500", icon: "🎨" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <GraduationCap className="h-8 w-8 text-primary" />
              <Badge variant="secondary" className="text-sm">
                Smart Learning Platform
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Master Any Subject with{" "}
              <span className="text-primary">SmartQuiz</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience personalized learning through intelligent quizzes, adaptive recommendations, 
              and comprehensive analytics designed to accelerate your knowledge acquisition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {status === "authenticated" ? (
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="text-lg px-8">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="text-lg px-8">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SmartQuiz?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven learning methodologies 
              to create an unparalleled educational experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore Diverse Subjects</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From computer science to art history, we offer comprehensive coverage 
              across multiple disciplines to satisfy your curiosity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {subject.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{subject.name}</h3>
                      <p className="text-muted-foreground">Comprehensive coverage</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/subjects">
              <Button variant="outline" size="lg">
                View All Subjects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Quiz Sets</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Subjects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of learners who have already accelerated their knowledge 
              acquisition with SmartQuiz&apos;s intelligent learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {status === "authenticated" ? (
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8">
                    Continue Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="text-lg px-8">
                      Start Learning Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="text-lg px-8">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
