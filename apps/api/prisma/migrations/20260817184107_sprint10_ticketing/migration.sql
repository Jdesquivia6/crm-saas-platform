-- CreateTable
CREATE TABLE "ticket_categories" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "color" VARCHAR(7),
    "icon" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ticket_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sla_policies" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "priority" VARCHAR(10) NOT NULL,
    "response_time" INTEGER NOT NULL,
    "resolution_time" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "sla_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contact_id" UUID,
    "company_id" UUID,
    "category_id" UUID,
    "sla_policy_id" UUID,
    "subject" VARCHAR(250) NOT NULL,
    "description" TEXT,
    "priority" VARCHAR(10) NOT NULL DEFAULT 'NORMAL',
    "status" VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    "channel" VARCHAR(30),
    "source" VARCHAR(50),
    "sla_response_at" TIMESTAMPTZ,
    "sla_resolve_at" TIMESTAMPTZ,
    "sla_breached" BOOLEAN NOT NULL DEFAULT false,
    "first_response_at" TIMESTAMPTZ,
    "resolved_at" TIMESTAMPTZ,
    "closed_at" TIMESTAMPTZ,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_comments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "user_id" UUID,
    "content" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ticket_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_assignments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "assigned_by" UUID,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_status_history" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "from_status" VARCHAR(20),
    "to_status" VARCHAR(20) NOT NULL,
    "changed_by" UUID,
    "reason" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_sla_events" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "event_type" VARCHAR(30) NOT NULL,
    "due_at" TIMESTAMPTZ NOT NULL,
    "occurred_at" TIMESTAMPTZ,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_sla_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "satisfaction_surveys" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "nps" INTEGER,
    "sent_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "satisfaction_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticket_categories_tenant_id_idx" ON "ticket_categories"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_categories_tenant_id_name_key" ON "ticket_categories"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "sla_policies_tenant_id_idx" ON "sla_policies"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "sla_policies_tenant_id_priority_key" ON "sla_policies"("tenant_id", "priority");

-- CreateIndex
CREATE INDEX "tickets_tenant_id_idx" ON "tickets"("tenant_id");

-- CreateIndex
CREATE INDEX "tickets_contact_id_idx" ON "tickets"("contact_id");

-- CreateIndex
CREATE INDEX "tickets_company_id_idx" ON "tickets"("company_id");

-- CreateIndex
CREATE INDEX "tickets_tenant_id_status_idx" ON "tickets"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "tickets_tenant_id_priority_idx" ON "tickets"("tenant_id", "priority");

-- CreateIndex
CREATE INDEX "tickets_created_at_idx" ON "tickets"("created_at");

-- CreateIndex
CREATE INDEX "ticket_comments_ticket_id_idx" ON "ticket_comments"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_comments_tenant_id_idx" ON "ticket_comments"("tenant_id");

-- CreateIndex
CREATE INDEX "ticket_assignments_ticket_id_idx" ON "ticket_assignments"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_assignments_user_id_idx" ON "ticket_assignments"("user_id");

-- CreateIndex
CREATE INDEX "ticket_assignments_tenant_id_idx" ON "ticket_assignments"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_assignments_ticket_id_user_id_key" ON "ticket_assignments"("ticket_id", "user_id");

-- CreateIndex
CREATE INDEX "ticket_status_history_ticket_id_idx" ON "ticket_status_history"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_status_history_ticket_id_created_at_idx" ON "ticket_status_history"("ticket_id", "created_at");

-- CreateIndex
CREATE INDEX "ticket_sla_events_ticket_id_idx" ON "ticket_sla_events"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_sla_events_tenant_id_event_type_idx" ON "ticket_sla_events"("tenant_id", "event_type");

-- CreateIndex
CREATE INDEX "ticket_sla_events_due_at_idx" ON "ticket_sla_events"("due_at");

-- CreateIndex
CREATE UNIQUE INDEX "satisfaction_surveys_ticket_id_key" ON "satisfaction_surveys"("ticket_id");

-- CreateIndex
CREATE INDEX "satisfaction_surveys_tenant_id_idx" ON "satisfaction_surveys"("tenant_id");

-- CreateIndex
CREATE INDEX "satisfaction_surveys_contact_id_idx" ON "satisfaction_surveys"("contact_id");

-- AddForeignKey
ALTER TABLE "ticket_categories" ADD CONSTRAINT "ticket_categories_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sla_policies" ADD CONSTRAINT "sla_policies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ticket_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_sla_policy_id_fkey" FOREIGN KEY ("sla_policy_id") REFERENCES "sla_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_comments" ADD CONSTRAINT "ticket_comments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_assignments" ADD CONSTRAINT "ticket_assignments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_assignments" ADD CONSTRAINT "ticket_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_status_history" ADD CONSTRAINT "ticket_status_history_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_sla_events" ADD CONSTRAINT "ticket_sla_events_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "satisfaction_surveys" ADD CONSTRAINT "satisfaction_surveys_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "satisfaction_surveys" ADD CONSTRAINT "satisfaction_surveys_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
