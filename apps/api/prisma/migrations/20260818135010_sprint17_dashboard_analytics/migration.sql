-- CreateTable
CREATE TABLE "analytics_events" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "entity_type" VARCHAR(50),
    "entity_id" UUID,
    "user_id" UUID,
    "metadata" JSONB,
    "ip_address" VARCHAR(50),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_metrics_daily" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "new_contacts" INTEGER NOT NULL DEFAULT 0,
    "active_contacts" INTEGER NOT NULL DEFAULT 0,
    "converted_to_lead" INTEGER NOT NULL DEFAULT 0,
    "converted_to_opportunity" INTEGER NOT NULL DEFAULT 0,
    "churned" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_metrics_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_metrics_daily" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "product_id" UUID,
    "views" INTEGER NOT NULL DEFAULT 0,
    "added_to_cart" INTEGER NOT NULL DEFAULT 0,
    "added_to_quote" INTEGER NOT NULL DEFAULT 0,
    "sold_quantity" INTEGER NOT NULL DEFAULT 0,
    "sold_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_metrics_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_metrics_daily" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "tickets_assigned" INTEGER NOT NULL DEFAULT 0,
    "tickets_resolved" INTEGER NOT NULL DEFAULT 0,
    "avg_response_time" INTEGER NOT NULL DEFAULT 0,
    "avg_resolution_time" INTEGER NOT NULL DEFAULT 0,
    "satisfaction_score" DECIMAL(3,2),
    "conversations_handled" INTEGER NOT NULL DEFAULT 0,
    "messages_sent" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_metrics_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_metrics_daily" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "channel" VARCHAR(30) NOT NULL,
    "date" DATE NOT NULL,
    "messages_sent" INTEGER NOT NULL DEFAULT 0,
    "messages_received" INTEGER NOT NULL DEFAULT 0,
    "conversations_started" INTEGER NOT NULL DEFAULT 0,
    "avg_response_time" INTEGER NOT NULL DEFAULT 0,
    "satisfaction_score" DECIMAL(3,2),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_metrics_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_metrics_daily" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "sent" INTEGER NOT NULL DEFAULT 0,
    "delivered" INTEGER NOT NULL DEFAULT 0,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "clicked" INTEGER NOT NULL DEFAULT 0,
    "bounced" INTEGER NOT NULL DEFAULT 0,
    "unsubscribed" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "conversion_value" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_metrics_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_metrics_daily" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "mrr" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "arr" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_contacts" INTEGER NOT NULL DEFAULT 0,
    "new_contacts" INTEGER NOT NULL DEFAULT 0,
    "total_leads" INTEGER NOT NULL DEFAULT 0,
    "new_leads" INTEGER NOT NULL DEFAULT 0,
    "total_opportunities" INTEGER NOT NULL DEFAULT 0,
    "won_opportunities" INTEGER NOT NULL DEFAULT 0,
    "lost_opportunities" INTEGER NOT NULL DEFAULT 0,
    "total_revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "new_revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "active_tickets" INTEGER NOT NULL DEFAULT 0,
    "resolved_tickets" INTEGER NOT NULL DEFAULT 0,
    "avg_satisfaction" DECIMAL(3,2),
    "active_users" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_metrics_daily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_events_tenant_id_idx" ON "analytics_events"("tenant_id");

-- CreateIndex
CREATE INDEX "analytics_events_event_type_idx" ON "analytics_events"("event_type");

-- CreateIndex
CREATE INDEX "analytics_events_entity_type_entity_id_idx" ON "analytics_events"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "analytics_events_user_id_idx" ON "analytics_events"("user_id");

-- CreateIndex
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events"("created_at");

-- CreateIndex
CREATE INDEX "contact_metrics_daily_tenant_id_idx" ON "contact_metrics_daily"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_metrics_daily_tenant_id_date_key" ON "contact_metrics_daily"("tenant_id", "date");

-- CreateIndex
CREATE INDEX "product_metrics_daily_tenant_id_idx" ON "product_metrics_daily"("tenant_id");

-- CreateIndex
CREATE INDEX "product_metrics_daily_product_id_idx" ON "product_metrics_daily"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_metrics_daily_tenant_id_date_product_id_key" ON "product_metrics_daily"("tenant_id", "date", "product_id");

-- CreateIndex
CREATE INDEX "agent_metrics_daily_tenant_id_idx" ON "agent_metrics_daily"("tenant_id");

-- CreateIndex
CREATE INDEX "agent_metrics_daily_user_id_idx" ON "agent_metrics_daily"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "agent_metrics_daily_tenant_id_user_id_date_key" ON "agent_metrics_daily"("tenant_id", "user_id", "date");

-- CreateIndex
CREATE INDEX "channel_metrics_daily_tenant_id_idx" ON "channel_metrics_daily"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "channel_metrics_daily_tenant_id_channel_date_key" ON "channel_metrics_daily"("tenant_id", "channel", "date");

-- CreateIndex
CREATE INDEX "campaign_metrics_daily_tenant_id_idx" ON "campaign_metrics_daily"("tenant_id");

-- CreateIndex
CREATE INDEX "campaign_metrics_daily_campaign_id_idx" ON "campaign_metrics_daily"("campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_metrics_daily_tenant_id_campaign_id_date_key" ON "campaign_metrics_daily"("tenant_id", "campaign_id", "date");

-- CreateIndex
CREATE INDEX "tenant_metrics_daily_tenant_id_idx" ON "tenant_metrics_daily"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_metrics_daily_tenant_id_date_key" ON "tenant_metrics_daily"("tenant_id", "date");

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_metrics_daily" ADD CONSTRAINT "contact_metrics_daily_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_metrics_daily" ADD CONSTRAINT "product_metrics_daily_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_metrics_daily" ADD CONSTRAINT "agent_metrics_daily_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_metrics_daily" ADD CONSTRAINT "channel_metrics_daily_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_metrics_daily" ADD CONSTRAINT "campaign_metrics_daily_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_metrics_daily" ADD CONSTRAINT "tenant_metrics_daily_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
