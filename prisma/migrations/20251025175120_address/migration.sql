/*
  Warnings:

  - You are about to drop the column `address` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Client" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT;

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" TEXT NOT NULL,
    "street" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_addressId_key" ON "public"."Client"("addressId");

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
