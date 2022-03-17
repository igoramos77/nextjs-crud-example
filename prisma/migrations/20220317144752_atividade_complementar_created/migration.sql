-- CreateEnum
CREATE TYPE "EStatus" AS ENUM ('approved', 'in_validation', 'recused');

-- CreateTable
CREATE TABLE "AtividadeComplementar" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "carga_horaria_informada" INTEGER NOT NULL,
    "carga_horaria_integralizada" INTEGER NOT NULL,
    "justificativa" TEXT NOT NULL,
    "certificado" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "status" "EStatus" NOT NULL DEFAULT E'in_validation',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AtividadeComplementar_pkey" PRIMARY KEY ("id")
);
