/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AtividadeComplementar` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AtividadeComplementar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AtividadeComplementar" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
