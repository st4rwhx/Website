/*
  Warnings:

  - You are about to drop the column `trialEndsAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Story" ADD COLUMN "audioPath" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'free',
    "currentPeriodEnd" DATETIME
);
INSERT INTO "new_User" ("createdAt", "currentPeriodEnd", "email", "id", "name", "passwordHash", "stripeCustomerId", "stripeSubscriptionId", "subscriptionStatus") SELECT "createdAt", "currentPeriodEnd", "email", "id", "name", "passwordHash", "stripeCustomerId", "stripeSubscriptionId", "subscriptionStatus" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
