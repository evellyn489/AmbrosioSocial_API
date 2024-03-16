/*
  Warnings:

  - You are about to drop the column `isPrivate` on the `User` table. All the data in the column will be lost.
  - Added the required column `visibility` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "visibility" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("birthDate", "createdAt", "email", "gender", "id", "name", "password", "updatedAt") SELECT "birthDate", "createdAt", "email", "gender", "id", "name", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
