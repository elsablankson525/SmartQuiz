import { prisma } from "@/lib/prisma";

export interface LeaderboardUpdateData {
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  quizzes: number;
  streak: number;
  subjects: string[];
}

export class LeaderboardUpdater {
  /**
   * Update leaderboard entries for a user after quiz completion
   */
  static async updateUserLeaderboard(userId: string, _quizScore: number, _category: string) {
    try {
      // Get user data with quiz results
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          quizResults: true
        }
      });

      if (!user) return;

      // Calculate user stats
      const totalQuizzes = user.quizResults.length;
      const totalScore = user.totalScore;
      const subjects = [...new Set(user.quizResults.map((q) => q.category || 'Unknown'))].filter(Boolean) as string[];
      const streak = this.calculateStreak(user.quizResults);

      // Update or create leaderboard entries for all timeframes
      await this.updateTimeframeEntry('weekly', {
        userId: user.id,
        name: user.name || 'Anonymous',
        avatar: user.image || undefined,
        score: totalScore,
        quizzes: totalQuizzes,
        streak,
        subjects
      });

      await this.updateTimeframeEntry('monthly', {
        userId: user.id,
        name: user.name || 'Anonymous',
        avatar: user.image || undefined,
        score: totalScore,
        quizzes: totalQuizzes,
        streak,
        subjects
      });

      await this.updateTimeframeEntry('all-time', {
        userId: user.id,
        name: user.name || 'Anonymous',
        avatar: user.image || undefined,
        score: totalScore,
        quizzes: totalQuizzes,
        streak,
        subjects
      });

    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }

  /**
   * Update leaderboard entry for a specific timeframe
   */
  private static async updateTimeframeEntry(timeframe: string, data: LeaderboardUpdateData) {
    // Check if user already has an entry for this timeframe
    const existingEntry = await prisma.leaderboardEntry.findFirst({
      where: {
        userId: data.userId,
        timeframe
      }
    });

    if (existingEntry) {
      // Update existing entry
      await prisma.leaderboardEntry.update({
        where: { id: existingEntry.id },
        data: {
          score: data.score,
          quizzes: data.quizzes,
          streak: data.streak,
          subjects: data.subjects,
          badge: this.calculateBadge(data.score, data.quizzes, data.streak)
        }
      });
    } else {
      // Create new entry
      await prisma.leaderboardEntry.create({
        data: {
          userId: data.userId,
          score: data.score,
          quizzes: data.quizzes,
          streak: data.streak,
          subjects: data.subjects,
          timeframe,
          rank: 0, // Will be updated by recalculateRanks
          badge: this.calculateBadge(data.score, data.quizzes, data.streak)
        }
      });
    }

    // Recalculate ranks for this timeframe
    await this.recalculateRanks(timeframe);
  }

  /**
   * Recalculate ranks for a specific timeframe
   */
  private static async recalculateRanks(timeframe: string) {
    const entries = await prisma.leaderboardEntry.findMany({
      where: { timeframe },
      orderBy: [
        { score: 'desc' },
        { quizzes: 'desc' },
        { streak: 'desc' }
      ]
    });

    // Update ranks
    for (let i = 0; i < entries.length; i++) {
      await prisma.leaderboardEntry.update({
        where: { id: entries[i].id },
        data: { rank: i + 1 }
      });
    }
  }

  /**
   * Calculate user streak based on quiz history
   */
  private static calculateStreak(quizResults: Array<{ date: Date }>): number {
    if (quizResults.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if user has taken a quiz today or yesterday
    const recentQuizzes = quizResults.filter(q => {
      const dateValue = q.date;
      if (typeof dateValue !== 'string' && typeof dateValue !== 'number' && !(dateValue instanceof Date)) {
        return false;
      }
      const quizDate = new Date(dateValue);
      return quizDate.toDateString() === today.toDateString() ||
             quizDate.toDateString() === yesterday.toDateString();
    });

    if (recentQuizzes.length === 0) return 0;
    // Calculate consecutive days
    const dates = [...new Set(quizResults.map(q => {
      const dateValue = q.date;
      if (typeof dateValue !== 'string' && typeof dateValue !== 'number' && !(dateValue instanceof Date)) {
        return null;
      }
      return new Date(dateValue).toDateString();
    }).filter(Boolean))].sort().reverse();
    
    for (let i = 0; i < dates.length; i++) {
      const currentDate = new Date(dates[i]!);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (currentDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Calculate badge based on user performance
   */
  private static calculateBadge(score: number, quizzes: number, streak: number): string {
    if (score >= 10000 && quizzes >= 100) return '👑'; // Crown for high achievers
    if (streak >= 30) return '🔥'; // Fire for long streaks
    if (quizzes >= 50) return '⭐'; // Star for quiz masters
    if (score >= 5000) return '🏆'; // Trophy for good scores
    if (quizzes >= 10) return '🎯'; // Target for active users
    return '🌟'; // Default badge
  }

  /**
   * Get leaderboard for a specific timeframe with proper ranking
   */
  static async getLeaderboard(timeframe: string, limit?: number, offset?: number) {
    const entries = await prisma.leaderboardEntry.findMany({
      where: { timeframe },
      orderBy: [
        { rank: 'asc' }
      ],
      take: limit,
      skip: offset
    });

    return entries;
  }

  /**
   * Get user's current rank in a timeframe
   */
  static async getUserRank(userId: string, timeframe: string): Promise<number | null> {
    const entry = await prisma.leaderboardEntry.findFirst({
      where: {
        userId,
        timeframe
      },
      select: { rank: true }
    });

    return entry?.rank || null;
  }
} 