-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "heightCm" DOUBLE PRECISION,
    "currentWeightKg" DOUBLE PRECISION,
    "bodyFatPct" DOUBLE PRECISION,
    "tdeeBase" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_clerkUserId_key" ON "Profile"("clerkUserId");
