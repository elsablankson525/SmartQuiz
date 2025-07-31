-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "earned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "earnedAt" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "relatedConcepts" TEXT[];

-- AlterTable
ALTER TABLE "QuizResult" ADD COLUMN     "category" TEXT,
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "questionsAnswered" TEXT;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
