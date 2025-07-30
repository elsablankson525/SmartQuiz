"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Users, Crown, Star, Zap, Target } from "lucide-react"
import { useSession } from "next-auth/react"

const timeframes = ["weekly", "monthly", "all-time"]

// Add this type for leaderboard entries
interface LeaderboardPlayer {
  id: string
  userId?: string | null
  name: string
  avatar?: string | null
  score: number
  quizzes: number
  streak: number
  badge?: string | null
  subjects: string[]
  timeframe: string
  rank: number
}

// Add this function outside the component
function getCategoryChampions(players: LeaderboardPlayer[]): { category: string; champion: string; score: number; icon: string }[] {
  const categoryIcons: Record<string, string> = {
    "Computer Science": "💻",
    Mathematics: "📊",
    Business: "💼",
    Health: "🏥",
    Psychology: "🧠",
    Law: "⚖️",
  };
  const champions: Record<string, { champion: string; score: number }> = {};
  players.forEach((player) => {
    player.subjects.forEach((subject) => {
      if (!champions[subject] || player.score > champions[subject].score) {
        champions[subject] = { champion: player.name, score: player.score };
      }
    });
  });
  return Object.entries(champions).map(([category, { champion, score }]) => ({
    category,
    champion,
    score,
    icon: categoryIcons[category] || "🏆",
  }));
}

interface LeaderboardData {
  [timeframe: string]: LeaderboardPlayer[];
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const router = useRouter()
  const [selectedTimeframe, setSelectedTimeframe] = useState("all-time")
  const [isLoading, setIsLoading] = useState(false)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 5;

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setLeaderboardData({});
  }, [selectedTimeframe]);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("timeframe", selectedTimeframe);
        params.append("offset", offset.toString());
        params.append("limit", PAGE_SIZE.toString());
        const res = await fetch(`/api/leaderboard?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();
        if (offset === 0) {
          setLeaderboardData({ [selectedTimeframe]: data.leaderboard || [] });
        } else {
          setLeaderboardData((prev: LeaderboardData) => ({
            ...prev,
            [selectedTimeframe]: [...(prev[selectedTimeframe] || []), ...(data.leaderboard || [])],
          }));
        }
        setHasMore((data.leaderboard || []).length === PAGE_SIZE);
      } catch {
        setError("Could not load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [selectedTimeframe, offset]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading leaderboard...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  const currentLeaderboard = leaderboardData[selectedTimeframe] || [];
  const displayedPlayers = currentLeaderboard;

  const handlePlayerClick = (playerName: string) => {
    console.log(`Viewing SmartQuiz profile for ${playerName}`)
    alert(`${playerName}'s SmartQuiz profile - Feature coming soon!`)
  }

  const handleLoadMore = async () => {
    setIsLoading(true);
    setOffset((prev) => prev + PAGE_SIZE);
    setIsLoading(false);
  };

  const handleTakeQuiz = () => {
    router.push("/quiz/new")
  }

  const handleCategoryClick = (category: string) => {
    const categoryMap: Record<string, string> = {
      "Computer Science": "computer-science",
      Mathematics: "mathematics",
      Business: "business",
      Health: "health",
      Psychology: "psychology",
      Law: "law",
    }
    router.push(`/quiz/new?category=${categoryMap[category] || category.toLowerCase()}`)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800"
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800"
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800"
      default:
        return "bg-card hover:bg-muted/50"
    }
  }

  const categoryChampions = getCategoryChampions(displayedPlayers);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">SmartQuiz</span> Community Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compete with learners worldwide across all subjects and climb the ranks through consistent learning
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className="capitalize"
              >
                {timeframe.replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Leaderboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top SmartQuiz Learners - {selectedTimeframe.replace("-", " ").toUpperCase()}
            </CardTitle>
            <CardDescription>
              Rankings based on quiz scores across all subjects, consistency, and learning streaks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayedPlayers.map((player: LeaderboardPlayer) => {
                const isCurrentUser = session?.user?.email && player.userId && session.user.email === player.userId;
                return (
                  <div
                    key={player.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${getRankBg(player.rank)} ${isCurrentUser ? "border-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}`}
                    onClick={() => handlePlayerClick(player.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10">{getRankIcon(player.rank)}</div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                          <AvatarFallback>
                            {player.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {player.name}
                            <span className="text-lg">{player.badge}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {player.quizzes} quizzes • {player.streak} day streak
                          </div>
                          <div className="text-xs text-muted-foreground">Subjects: {player.subjects.join(", ")}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{player.score.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">SmartQuiz points</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="gap-2 bg-transparent"
                >
                  {isLoading ? "Loading..." : "Load More"}
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Champions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Subject Champions
            </CardTitle>
            <CardDescription>Top performers in each SmartQuiz subject category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryChampions.map((champion) => (
                <div
                  key={champion.category}
                  className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleCategoryClick(champion.category)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{champion.icon}</span>
                    <div>
                      <div className="font-medium">{champion.category}</div>
                      <div className="text-sm text-muted-foreground">Champion</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{champion.champion}</div>
                    <div className="text-primary font-bold">{champion.score.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="learning-card cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Join the SmartQuiz Competition
              </CardTitle>
              <CardDescription>
                Start taking quizzes across all subjects to earn points and climb the leaderboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={handleTakeQuiz}>
                Take SmartQuiz Quiz Now
              </Button>
            </CardContent>
          </Card>

          <Card className="learning-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                How SmartQuiz Rankings Work
              </CardTitle>
              <CardDescription>
                Points are awarded based on quiz performance across all subjects and consistency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Quiz completion:</span>
                <span className="font-medium">10-100 points</span>
              </div>
              <div className="flex justify-between">
                <span>Daily streak bonus:</span>
                <span className="font-medium">+5 points/day</span>
              </div>
              <div className="flex justify-between">
                <span>Perfect score bonus:</span>
                <span className="font-medium">+50 points</span>
              </div>
              <div className="flex justify-between">
                <span>Subject mastery:</span>
                <span className="font-medium">+200 points</span>
              </div>
              <div className="flex justify-between">
                <span>Multi-subject bonus:</span>
                <span className="font-medium">+100 points</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
