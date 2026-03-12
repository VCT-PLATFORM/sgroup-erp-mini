-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'employee',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanScenarioLog" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL DEFAULT 'EXEC',
    "scenario" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL DEFAULT '1',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "rawJson" TEXT,
    "note" TEXT,

    CONSTRAINT "PlanScenarioLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanBundleLog" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL DEFAULT 'EXEC',
    "scenario" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "tabKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL DEFAULT '1',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "rawJson" TEXT,
    "note" TEXT,

    CONSTRAINT "PlanBundleLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecPlanLatest" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "tabKey" TEXT NOT NULL,
    "latestPlanId" TEXT,
    "latestBundleId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "schemaVersion" TEXT NOT NULL DEFAULT '1',
    "rawJson" TEXT,
    "note" TEXT,

    CONSTRAINT "ExecPlanLatest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecKpiLatest" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "tabKey" TEXT NOT NULL,
    "kpiKey" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT,
    "sourcePlanId" TEXT,
    "calcVersion" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "note" TEXT,

    CONSTRAINT "ExecKpiLatest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecKpiLog" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "tabKey" TEXT NOT NULL,
    "kpiKey" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT,
    "sourcePlanId" TEXT,
    "calcVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "rawJson" TEXT,
    "note" TEXT,

    CONSTRAINT "ExecKpiLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalePlanLatest" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "version" TEXT,
    "rawJson" TEXT,
    "note" TEXT,

    CONSTRAINT "SalePlanLatest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalePlanHeader" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "ownerEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "targetGMV" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgDealValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "headcount" INTEGER NOT NULL DEFAULT 0,
    "marketingRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rateDeal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rateBooking" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rateMeeting" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalePlanHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalePlanMonth" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gmv" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deals" INTEGER NOT NULL DEFAULT 0,
    "bookings" INTEGER NOT NULL DEFAULT 0,
    "meetings" INTEGER NOT NULL DEFAULT 0,
    "leadsSale" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalePlanMonth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalePlanTeam" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "teamId" TEXT,
    "name" TEXT NOT NULL,
    "leaderId" TEXT,
    "leaderName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "activeFrom" INTEGER NOT NULL DEFAULT 1,
    "activeTo" INTEGER NOT NULL DEFAULT 12,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalePlanTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalePlanStaff" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "staffId" TEXT,
    "hoTen" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Sales',
    "team" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "activeFrom" INTEGER NOT NULL DEFAULT 1,
    "activeTo" INTEGER NOT NULL DEFAULT 12,
    "leadsCapacity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rateMeeting" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rateBooking" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rateDeal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalePlanStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MktPlanHeader" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "ownerEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "totalBudgetVnd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MktPlanHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MktPlanChannelBudget" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "channelKey" TEXT NOT NULL,
    "channelLabel" TEXT,
    "budgetVnd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "kpiLeadTarget" DOUBLE PRECISION,
    "kpiCplTargetVnd" DOUBLE PRECISION,
    "note" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MktPlanChannelBudget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MktPlanKpiTarget" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "kpiKey" TEXT NOT NULL,
    "kpiLabel" TEXT,
    "targetValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT,
    "note" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MktPlanKpiTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MktPlanAssumption" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT,
    "note" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MktPlanAssumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactPlanSnapshotLog" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "ownerEmail" TEXT,
    "json" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FactPlanSnapshotLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "actorEmail" TEXT,
    "meta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ExecPlanLatest_year_scenarioKey_tabKey_key" ON "ExecPlanLatest"("year", "scenarioKey", "tabKey");

-- CreateIndex
CREATE UNIQUE INDEX "ExecKpiLatest_year_scenarioKey_tabKey_kpiKey_key" ON "ExecKpiLatest"("year", "scenarioKey", "tabKey", "kpiKey");

-- CreateIndex
CREATE UNIQUE INDEX "SalePlanLatest_year_scenarioKey_key" ON "SalePlanLatest"("year", "scenarioKey");

-- CreateIndex
CREATE UNIQUE INDEX "MktPlanHeader_planId_key" ON "MktPlanHeader"("planId");
