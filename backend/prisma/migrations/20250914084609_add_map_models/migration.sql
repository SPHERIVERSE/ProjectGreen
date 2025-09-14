-- CreateEnum
CREATE TYPE "public"."FacilityType" AS ENUM ('TOILET', 'BIN', 'WASTE_FACILITY');

-- CreateTable
CREATE TABLE "public"."PublicFacility" (
    "id" TEXT NOT NULL,
    "type" "public"."FacilityType" NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "addedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WasteWorkerLocation" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteWorkerLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WasteWorkerLocation_workerId_key" ON "public"."WasteWorkerLocation"("workerId");

-- AddForeignKey
ALTER TABLE "public"."WasteWorkerLocation" ADD CONSTRAINT "WasteWorkerLocation_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
