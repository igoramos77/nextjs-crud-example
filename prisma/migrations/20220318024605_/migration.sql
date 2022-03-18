-- CreateEnum
CREATE TYPE "EStatus" AS ENUM ('waiting', 'approved', 'recused');

-- CreateTable
CREATE TABLE "ComplementaryActivity" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "informedTime" INTEGER NOT NULL,
    "integralizedTime" INTEGER NOT NULL,
    "justification" TEXT NOT NULL,
    "certificateUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" "EStatus" NOT NULL DEFAULT E'waiting',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplementaryActivity_pkey" PRIMARY KEY ("id")
);
