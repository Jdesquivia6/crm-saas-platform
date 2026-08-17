-- CreateTable
CREATE TABLE "integration_sync_jobs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "channel_type" VARCHAR(30) NOT NULL,
    "connection_id" UUID,
    "sync_type" VARCHAR(30) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "processed_count" INTEGER NOT NULL DEFAULT 0,
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "integration_sync_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "integration_sync_jobs_tenant_id_idx" ON "integration_sync_jobs"("tenant_id");

-- CreateIndex
CREATE INDEX "integration_sync_jobs_tenant_id_channel_type_idx" ON "integration_sync_jobs"("tenant_id", "channel_type");

-- CreateIndex
CREATE INDEX "integration_sync_jobs_status_idx" ON "integration_sync_jobs"("status");

-- AddForeignKey
ALTER TABLE "integration_sync_jobs" ADD CONSTRAINT "integration_sync_jobs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
