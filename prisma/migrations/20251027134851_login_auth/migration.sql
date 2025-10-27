/*
  Warnings:

  - You are about to drop the column `isLoggedIn` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auth"."Account" DROP COLUMN "isLoggedIn";
