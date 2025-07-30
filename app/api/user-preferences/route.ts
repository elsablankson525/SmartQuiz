import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET user preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ 
        error: "Missing required parameter: userId" 
      }, { status: 400 });
    }

    // Look up the user
    const user = await prisma.user.findUnique({
      where: { email: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user preferences
    let userPreferences = await prisma.userPreferences.findUnique({
      where: { userId: user.id }
    });

    // Create default preferences if none exist
    if (!userPreferences) {
      userPreferences = await prisma.userPreferences.create({
        data: {
          userId: user.id,
          learningStyle: "mixed",
          studySessionDuration: 30,
          weeklyStudyHours: 10,
          preferredDifficulty: "beginner",
          preferredSubjects: [],
          showExplanations: true,
          enableSmartRecommendations: true,
          enableStudyPlans: true,
          enableProgressTracking: true,
          enableAdaptiveLearning: true,
          emailNotifications: true,
          pushNotifications: true,
          weeklyProgressReport: true,
          achievementAlerts: true,
          targetSubjects: [],
          learningGoals: []
        }
      });
    }

    return NextResponse.json({
      success: true,
      preferences: userPreferences
    });

  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json({ 
      error: "Failed to fetch user preferences" 
    }, { status: 500 });
  }
}

// POST/UPDATE user preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      learningStyle,
      preferredTimeOfDay,
      studySessionDuration,
      weeklyStudyHours,
      preferredDifficulty,
      preferredSubjects,
      quizTimeLimit,
      showExplanations,
      enableSmartRecommendations,
      enableStudyPlans,
      enableProgressTracking,
      enableAdaptiveLearning,
      emailNotifications,
      pushNotifications,
      weeklyProgressReport,
      achievementAlerts,
      targetScore,
      targetSubjects,
      learningGoals,
      quizSetPreferences
    } = body;

    if (!userId) {
      return NextResponse.json({ 
        error: "Missing required field: userId" 
      }, { status: 400 });
    }

    // Look up the user
    const user = await prisma.user.findUnique({
      where: { email: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update or create user preferences
    const userPreferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        learningStyle,
        preferredTimeOfDay,
        studySessionDuration,
        weeklyStudyHours,
        preferredDifficulty,
        preferredSubjects,
        quizTimeLimit,
        showExplanations,
        enableSmartRecommendations,
        enableStudyPlans,
        enableProgressTracking,
        enableAdaptiveLearning,
        emailNotifications,
        pushNotifications,
        weeklyProgressReport,
        achievementAlerts,
        targetScore,
        targetSubjects,
        learningGoals,
        quizSetPreferences
      },
      create: {
        userId: user.id,
        learningStyle: learningStyle || "mixed",
        preferredTimeOfDay,
        studySessionDuration: studySessionDuration || 30,
        weeklyStudyHours: weeklyStudyHours || 10,
        preferredDifficulty: preferredDifficulty || "beginner",
        preferredSubjects: preferredSubjects || [],
        quizTimeLimit,
        showExplanations: showExplanations ?? true,
        enableSmartRecommendations: enableSmartRecommendations ?? true,
        enableStudyPlans: enableStudyPlans ?? true,
        enableProgressTracking: enableProgressTracking ?? true,
        enableAdaptiveLearning: enableAdaptiveLearning ?? true,
        emailNotifications: emailNotifications ?? true,
        pushNotifications: pushNotifications ?? true,
        weeklyProgressReport: weeklyProgressReport ?? true,
        achievementAlerts: achievementAlerts ?? true,
        targetScore,
        targetSubjects: targetSubjects || [],
        learningGoals: learningGoals || [],
        quizSetPreferences
      }
    });

    return NextResponse.json({
      success: true,
      preferences: userPreferences,
      message: "User preferences updated successfully"
    });

  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json({ 
      error: "Failed to update user preferences" 
    }, { status: 500 });
  }
} 