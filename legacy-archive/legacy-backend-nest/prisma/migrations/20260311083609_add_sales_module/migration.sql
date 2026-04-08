-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT,
ADD COLUMN     "salesRole" TEXT,
ADD COLUMN     "teamId" TEXT;

-- CreateTable
CREATE TABLE "DimProject" (
    "id" TEXT NOT NULL,
    "projectCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "developer" TEXT,
    "location" TEXT,
    "type" TEXT,
    "feeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalUnits" INTEGER NOT NULL DEFAULT 0,
    "soldUnits" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DimProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesTeam" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leaderId" TEXT,
    "leaderName" TEXT,
    "region" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesStaff" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "employeeCode" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "teamId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'sales',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "joinDate" TIMESTAMP(3),
    "leaveDate" TIMESTAMP(3),
    "leadsCapacity" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "personalTarget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactDeal" (
    "id" TEXT NOT NULL,
    "dealCode" TEXT,
    "bizflyCrmId" TEXT,
    "projectId" TEXT,
    "projectName" TEXT,
    "staffId" TEXT,
    "staffName" TEXT,
    "teamId" TEXT,
    "teamName" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "productCode" TEXT,
    "productType" TEXT,
    "dealValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "feeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stage" TEXT NOT NULL DEFAULT 'LEAD',
    "dealDate" TIMESTAMP(3),
    "bookingDate" TIMESTAMP(3),
    "contractDate" TIMESTAMP(3),
    "source" TEXT,
    "note" TEXT,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactDeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactSalesDaily" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "teamId" TEXT,
    "staffId" TEXT,
    "newLeads" INTEGER NOT NULL DEFAULT 0,
    "meetings" INTEGER NOT NULL DEFAULT 0,
    "bookings" INTEGER NOT NULL DEFAULT 0,
    "deposits" INTEGER NOT NULL DEFAULT 0,
    "contracts" INTEGER NOT NULL DEFAULT 0,
    "completedDeals" INTEGER NOT NULL DEFAULT 0,
    "cancelledDeals" INTEGER NOT NULL DEFAULT 0,
    "gmv" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "syncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FactSalesDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactPipelineSnapshot" (
    "id" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "teamId" TEXT,
    "leadCount" INTEGER NOT NULL DEFAULT 0,
    "contactedCount" INTEGER NOT NULL DEFAULT 0,
    "meetingCount" INTEGER NOT NULL DEFAULT 0,
    "bookingCount" INTEGER NOT NULL DEFAULT 0,
    "depositCount" INTEGER NOT NULL DEFAULT 0,
    "contractCount" INTEGER NOT NULL DEFAULT 0,
    "completedCount" INTEGER NOT NULL DEFAULT 0,
    "totalPipelineValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FactPipelineSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionRecord" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "staffName" TEXT,
    "teamId" TEXT,
    "role" TEXT NOT NULL,
    "dealValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commissionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "period" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommissionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesTargetMonthly" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "teamId" TEXT,
    "staffId" TEXT,
    "targetGMV" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetDeals" INTEGER NOT NULL DEFAULT 0,
    "targetLeads" INTEGER NOT NULL DEFAULT 0,
    "targetMeetings" INTEGER NOT NULL DEFAULT 0,
    "targetBookings" INTEGER NOT NULL DEFAULT 0,
    "scenarioKey" TEXT NOT NULL DEFAULT 'base',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesTargetMonthly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BizflySyncLog" (
    "id" TEXT NOT NULL,
    "syncType" TEXT NOT NULL,
    "syncDirection" TEXT NOT NULL DEFAULT 'PULL',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "recordsTotal" INTEGER NOT NULL DEFAULT 0,
    "recordsSynced" INTEGER NOT NULL DEFAULT 0,
    "recordsFailed" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "initiatedBy" TEXT,
    "metadata" TEXT,

    CONSTRAINT "BizflySyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DimProject_projectCode_key" ON "DimProject"("projectCode");

-- CreateIndex
CREATE UNIQUE INDEX "SalesTeam_code_key" ON "SalesTeam"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SalesStaff_employeeCode_key" ON "SalesStaff"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "FactDeal_dealCode_key" ON "FactDeal"("dealCode");

-- CreateIndex
CREATE UNIQUE INDEX "FactSalesDaily_date_teamId_staffId_key" ON "FactSalesDaily"("date", "teamId", "staffId");

-- CreateIndex
CREATE UNIQUE INDEX "FactPipelineSnapshot_snapshotDate_teamId_key" ON "FactPipelineSnapshot"("snapshotDate", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "SalesTargetMonthly_year_month_teamId_staffId_scenarioKey_key" ON "SalesTargetMonthly"("year", "month", "teamId", "staffId", "scenarioKey");
