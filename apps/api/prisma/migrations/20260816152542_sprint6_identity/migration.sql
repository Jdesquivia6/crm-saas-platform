-- CreateTable
CREATE TABLE "contact_match_candidates" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "source_contact_id" UUID NOT NULL,
    "target_contact_id" UUID NOT NULL,
    "match_type" VARCHAR(20) NOT NULL,
    "confidence_score" DECIMAL(5,4) NOT NULL,
    "matchCriteria" JSONB NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMPTZ,
    "dismiss_reason" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "contact_match_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_merge_history" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "source_contact_id" UUID NOT NULL,
    "target_contact_id" UUID NOT NULL,
    "merged_by" UUID,
    "merge_strategy" VARCHAR(20) NOT NULL,
    "mergedData" JSONB NOT NULL,
    "backupData" JSONB,
    "status" VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    "reverted_at" TIMESTAMPTZ,
    "reverted_by" UUID,
    "revert_reason" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_merge_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contact_match_candidates_tenant_id_idx" ON "contact_match_candidates"("tenant_id");

-- CreateIndex
CREATE INDEX "contact_match_candidates_source_contact_id_idx" ON "contact_match_candidates"("source_contact_id");

-- CreateIndex
CREATE INDEX "contact_match_candidates_target_contact_id_idx" ON "contact_match_candidates"("target_contact_id");

-- CreateIndex
CREATE INDEX "contact_match_candidates_tenant_id_status_idx" ON "contact_match_candidates"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "contact_match_candidates_confidence_score_idx" ON "contact_match_candidates"("confidence_score");

-- CreateIndex
CREATE UNIQUE INDEX "contact_match_candidates_source_contact_id_target_contact_i_key" ON "contact_match_candidates"("source_contact_id", "target_contact_id");

-- CreateIndex
CREATE INDEX "contact_merge_history_tenant_id_idx" ON "contact_merge_history"("tenant_id");

-- CreateIndex
CREATE INDEX "contact_merge_history_source_contact_id_idx" ON "contact_merge_history"("source_contact_id");

-- CreateIndex
CREATE INDEX "contact_merge_history_target_contact_id_idx" ON "contact_merge_history"("target_contact_id");

-- CreateIndex
CREATE INDEX "contact_merge_history_tenant_id_created_at_idx" ON "contact_merge_history"("tenant_id", "created_at");

-- AddForeignKey
ALTER TABLE "contact_match_candidates" ADD CONSTRAINT "contact_match_candidates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_match_candidates" ADD CONSTRAINT "contact_match_candidates_source_contact_id_fkey" FOREIGN KEY ("source_contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_match_candidates" ADD CONSTRAINT "contact_match_candidates_target_contact_id_fkey" FOREIGN KEY ("target_contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_merge_history" ADD CONSTRAINT "contact_merge_history_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_merge_history" ADD CONSTRAINT "contact_merge_history_source_contact_id_fkey" FOREIGN KEY ("source_contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_merge_history" ADD CONSTRAINT "contact_merge_history_target_contact_id_fkey" FOREIGN KEY ("target_contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
