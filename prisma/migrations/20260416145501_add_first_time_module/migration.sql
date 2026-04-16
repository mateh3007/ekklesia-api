-- CreateEnum
CREATE TYPE "VisitorStatus" AS ENUM ('NEW', 'RETURNING', 'MEMBER');

-- CreateTable
CREATE TABLE "visitors" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "birthDate" TIMESTAMP(3),
    "firstVisitDate" TIMESTAMP(3) NOT NULL,
    "status" "VisitorStatus" NOT NULL DEFAULT 'NEW',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_attendances" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "worshipId" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "attendedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "visitor_attendances_visitorId_attendedAt_key" ON "visitor_attendances"("visitorId", "attendedAt");

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_attendances" ADD CONSTRAINT "visitor_attendances_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_attendances" ADD CONSTRAINT "visitor_attendances_worshipId_fkey" FOREIGN KEY ("worshipId") REFERENCES "church_worships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_attendances" ADD CONSTRAINT "visitor_attendances_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
