-- AlterTable
ALTER TABLE "StudyPlan" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalScore" INTEGER NOT NULL DEFAULT 0;
