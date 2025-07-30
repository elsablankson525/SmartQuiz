-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningStyle" TEXT NOT NULL DEFAULT 'mixed',
    "preferredTimeOfDay" TEXT,
    "studySessionDuration" INTEGER NOT NULL DEFAULT 30,
    "weeklyStudyHours" INTEGER NOT NULL DEFAULT 10,
    "preferredDifficulty" TEXT NOT NULL DEFAULT 'beginner',
    "preferredSubjects" TEXT[],
    "quizTimeLimit" INTEGER,
    "showExplanations" BOOLEAN NOT NULL DEFAULT true,
    "enableSmartRecommendations" BOOLEAN NOT NULL DEFAULT true,
    "enableStudyPlans" BOOLEAN NOT NULL DEFAULT true,
    "enableProgressTracking" BOOLEAN NOT NULL DEFAULT true,
    "enableAdaptiveLearning" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "weeklyProgressReport" BOOLEAN NOT NULL DEFAULT true,
    "achievementAlerts" BOOLEAN NOT NULL DEFAULT true,
    "targetScore" INTEGER,
    "targetSubjects" TEXT[],
    "learningGoals" TEXT[],
    "quizSetPreferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizSetRecommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizSetId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "lastScore" INTEGER,
    "bestScore" INTEGER,
    "averageScore" DOUBLE PRECISION,
    "attemptsCount" INTEGER NOT NULL DEFAULT 0,
    "totalTimeSpent" INTEGER NOT NULL DEFAULT 0,
    "currentLevel" TEXT NOT NULL DEFAULT 'beginner',
    "recommendedNextLevel" TEXT,
    "weakAreas" TEXT[],
    "strongAreas" TEXT[],
    "currentStudyPlan" JSONB,
    "studyPlanProgress" INTEGER NOT NULL DEFAULT 0,
    "lastStudySession" TIMESTAMP(3),
    "recommendedResources" TEXT[],
    "completedResources" TEXT[],
    "learningPace" TEXT NOT NULL DEFAULT 'moderate',
    "confidenceLevel" TEXT NOT NULL DEFAULT 'moderate',
    "readinessForNextLevel" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizSetRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizSetRecommendation_userId_quizSetId_key" ON "QuizSetRecommendation"("userId", "quizSetId");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSetRecommendation" ADD CONSTRAINT "QuizSetRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
