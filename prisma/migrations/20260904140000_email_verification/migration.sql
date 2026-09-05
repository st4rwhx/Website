-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailVerificationExpires" DATETIME;
ALTER TABLE "User" ADD COLUMN "emailVerificationTokenHash" TEXT;
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerificationTokenHash_key" ON "User"("emailVerificationTokenHash");

