/*
  Warnings:

  - You are about to drop the column `avatar` on the `LeaderboardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `LeaderboardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `LeaderboardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `LearningPath` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `LearningPath` table. All the data in the column will be lost.
  - You are about to drop the column `enrolled` on the `LearningPath` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `LearningPath` table. All the data in the column will be lost.
  - You are about to drop the column `instructor` on the `LearningPath` table. All the data in the column will be lost.
  - You are about to drop the column `isPopular` on the `LearningPath` table. All the data in the column will be lost.
  - You are about to drop the column `modules` on the `LearningPath` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `LearningPath` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `LearningPath` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `QuizResult` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `QuizResult` table. All the data in the column will be lost.
  - You are about to drop the column `questionsAnswered` on the `QuizResult` table. All the data in the column will be lost.
  - You are about to drop the column `avgTime` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `borderColor` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `learners` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `quizzes` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `topics` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `totalScore` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Milestone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizSetRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudyPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCertificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLessonProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPreferences` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `questionCount` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `LeaderboardEntry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `progress` on table `LearningPath` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `quizId` to the `QuizResult` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_userId_fkey";

-- DropForeignKey
ALTER TABLE "LeaderboardEntry" DROP CONSTRAINT "LeaderboardEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_learningPathId_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestion" DROP CONSTRAINT "QuizQuestion_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_userId_fkey";

-- DropForeignKey
ALTER TABLE "QuizSetRecommendation" DROP CONSTRAINT "QuizSetRecommendation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "StudyPlan" DROP CONSTRAINT "StudyPlan_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "UserCertificate" DROP CONSTRAINT "UserCertificate_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "UserCertificate" DROP CONSTRAINT "UserCertificate_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserLessonProgress" DROP CONSTRAINT "UserLessonProgress_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "UserLessonProgress" DROP CONSTRAINT "UserLessonProgress_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "UserLessonProgress" DROP CONSTRAINT "UserLessonProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPreferences" DROP CONSTRAINT "UserPreferences_userId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "questionCount" SET NOT NULL,
ALTER COLUMN "questionCount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "LeaderboardEntry" DROP COLUMN "avatar",
DROP COLUMN "name",
DROP COLUMN "rank",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "LearningPath" DROP COLUMN "color",
DROP COLUMN "duration",
DROP COLUMN "enrolled",
DROP COLUMN "icon",
DROP COLUMN "instructor",
DROP COLUMN "isPopular",
DROP COLUMN "modules",
DROP COLUMN "rating",
DROP COLUMN "skills",
ADD COLUMN     "estimatedDuration" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prerequisites" TEXT[],
ALTER COLUMN "progress" SET NOT NULL,
ALTER COLUMN "progress" SET DEFAULT 0,
ALTER COLUMN "progress" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "LearningResource" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "QuizResult" DROP COLUMN "category",
DROP COLUMN "difficulty",
DROP COLUMN "questionsAnswered",
ADD COLUMN     "quizId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "timeSpent" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "avgTime",
DROP COLUMN "borderColor",
DROP COLUMN "categoryId",
DROP COLUMN "difficulty",
DROP COLUMN "learners",
DROP COLUMN "quizzes",
DROP COLUMN "rating",
DROP COLUMN "topics",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hashedPassword",
DROP COLUMN "totalScore",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "password" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "Achievement";

-- DropTable
DROP TABLE "Lesson";

-- DropTable
DROP TABLE "Milestone";

-- DropTable
DROP TABLE "QuizQuestion";

-- DropTable
DROP TABLE "QuizSetRecommendation";

-- DropTable
DROP TABLE "Resource";

-- DropTable
DROP TABLE "StudyPlan";

-- DropTable
DROP TABLE "UserCertificate";

-- DropTable
DROP TABLE "UserLessonProgress";

-- DropTable
DROP TABLE "UserPreferences";

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "topic" TEXT,
    "relatedConcepts" TEXT[],
    "quizId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_category_fkey" FOREIGN KEY ("category") REFERENCES "Subject"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_category_fkey" FOREIGN KEY ("category") REFERENCES "Subject"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
