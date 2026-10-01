-- CreateEnum
CREATE TYPE "AvatarStatus" AS ENUM ('queued', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "AvatarPhotoType" AS ENUM ('front', 'left', 'right', 'back');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "LengthUnit" AS ENUM ('CM', 'IN');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('KG', 'LB');

-- CreateEnum
CREATE TYPE "ClothingFit" AS ENUM ('SLIM', 'REGULAR', 'RELAXED', 'OVERSIZED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AvatarStatus" NOT NULL DEFAULT 'queued',
    "thumbnailUrl" TEXT,
    "modelUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvatarPhoto" (
    "id" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "type" "AvatarPhotoType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvatarPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "gender" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "images" JSONB NOT NULL,
    "sizes" JSONB NOT NULL,
    "colors" JSONB NOT NULL,
    "price" DOUBLE PRECISION,
    "priceCents" INTEGER,
    "currency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalTwinProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "preferredLength" "LengthUnit" NOT NULL,
    "preferredWeight" "WeightUnit" NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DigitalTwinProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalTwinMeasurements" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "chest" DOUBLE PRECISION NOT NULL,
    "waist" DOUBLE PRECISION NOT NULL,
    "hip" DOUBLE PRECISION NOT NULL,
    "shoulderWidth" DOUBLE PRECISION NOT NULL,
    "neck" DOUBLE PRECISION NOT NULL,
    "armLength" DOUBLE PRECISION NOT NULL,
    "forearm" DOUBLE PRECISION NOT NULL,
    "wrist" DOUBLE PRECISION NOT NULL,
    "thigh" DOUBLE PRECISION NOT NULL,
    "calf" DOUBLE PRECISION NOT NULL,
    "inseam" DOUBLE PRECISION NOT NULL,
    "footLength" DOUBLE PRECISION NOT NULL,
    "lengthUnit" "LengthUnit" NOT NULL,
    "weightUnit" "WeightUnit" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DigitalTwinMeasurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalTwinAppearance" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "skinTone" TEXT NOT NULL,
    "hairColor" TEXT NOT NULL,
    "hairStyle" TEXT NOT NULL,
    "eyeColor" TEXT NOT NULL,
    "facialHair" TEXT NOT NULL,
    "bodyType" TEXT NOT NULL,
    "preferredClothingFit" "ClothingFit" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DigitalTwinAppearance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "Avatar_userId_idx" ON "Avatar"("userId");

-- CreateIndex
CREATE INDEX "AvatarPhoto_avatarId_idx" ON "AvatarPhoto"("avatarId");

-- CreateIndex
CREATE UNIQUE INDEX "AvatarPhoto_avatarId_type_key" ON "AvatarPhoto"("avatarId", "type");

-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "Product"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalTwinProfile_userId_key" ON "DigitalTwinProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalTwinMeasurements_profileId_key" ON "DigitalTwinMeasurements"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalTwinAppearance_profileId_key" ON "DigitalTwinAppearance"("profileId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarPhoto" ADD CONSTRAINT "AvatarPhoto_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalTwinProfile" ADD CONSTRAINT "DigitalTwinProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalTwinMeasurements" ADD CONSTRAINT "DigitalTwinMeasurements_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "DigitalTwinProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalTwinAppearance" ADD CONSTRAINT "DigitalTwinAppearance_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "DigitalTwinProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
