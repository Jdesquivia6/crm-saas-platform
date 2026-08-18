-- CreateTable
CREATE TABLE "segments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(500),
    "type" VARCHAR(20) NOT NULL DEFAULT 'STATIC',
    "member_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segment_rules" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "segment_id" UUID NOT NULL,
    "field" VARCHAR(100) NOT NULL,
    "operator" VARCHAR(30) NOT NULL,
    "value" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "segment_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segment_members" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "segment_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "added_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "segment_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "segment_id" UUID,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(30) NOT NULL DEFAULT 'EMAIL',
    "status" VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    "subject" VARCHAR(500),
    "content" JSONB,
    "scheduled_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "cancelled_at" TIMESTAMPTZ,
    "total_recipients" INTEGER NOT NULL DEFAULT 0,
    "total_sent" INTEGER NOT NULL DEFAULT 0,
    "total_opened" INTEGER NOT NULL DEFAULT 0,
    "total_clicked" INTEGER NOT NULL DEFAULT 0,
    "total_bounced" INTEGER NOT NULL DEFAULT 0,
    "total_unsubscribed" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_channels" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "channel" VARCHAR(30) NOT NULL,
    "config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_recipients" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "sent_at" TIMESTAMPTZ,
    "opened_at" TIMESTAMPTZ,
    "clicked_at" TIMESTAMPTZ,
    "bounced_at" TIMESTAMPTZ,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_events" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "contact_id" UUID,
    "type" VARCHAR(30) NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_conversions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "value" DECIMAL(14,2),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_conversions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "segments_tenant_id_idx" ON "segments"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "segments_tenant_id_name_key" ON "segments"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "segment_rules_segment_id_idx" ON "segment_rules"("segment_id");

-- CreateIndex
CREATE INDEX "segment_members_tenant_id_idx" ON "segment_members"("tenant_id");

-- CreateIndex
CREATE INDEX "segment_members_segment_id_idx" ON "segment_members"("segment_id");

-- CreateIndex
CREATE INDEX "segment_members_contact_id_idx" ON "segment_members"("contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "segment_members_segment_id_contact_id_key" ON "segment_members"("segment_id", "contact_id");

-- CreateIndex
CREATE INDEX "campaigns_tenant_id_idx" ON "campaigns"("tenant_id");

-- CreateIndex
CREATE INDEX "campaigns_segment_id_idx" ON "campaigns"("segment_id");

-- CreateIndex
CREATE INDEX "campaigns_status_idx" ON "campaigns"("status");

-- CreateIndex
CREATE INDEX "campaigns_created_at_idx" ON "campaigns"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_tenant_id_name_key" ON "campaigns"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "campaign_channels_tenant_id_idx" ON "campaign_channels"("tenant_id");

-- CreateIndex
CREATE INDEX "campaign_channels_campaign_id_idx" ON "campaign_channels"("campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_channels_campaign_id_channel_key" ON "campaign_channels"("campaign_id", "channel");

-- CreateIndex
CREATE INDEX "campaign_recipients_tenant_id_idx" ON "campaign_recipients"("tenant_id");

-- CreateIndex
CREATE INDEX "campaign_recipients_campaign_id_idx" ON "campaign_recipients"("campaign_id");

-- CreateIndex
CREATE INDEX "campaign_recipients_contact_id_idx" ON "campaign_recipients"("contact_id");

-- CreateIndex
CREATE INDEX "campaign_recipients_status_idx" ON "campaign_recipients"("status");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_recipients_campaign_id_contact_id_key" ON "campaign_recipients"("campaign_id", "contact_id");

-- CreateIndex
CREATE INDEX "campaign_events_tenant_id_idx" ON "campaign_events"("tenant_id");

-- CreateIndex
CREATE INDEX "campaign_events_campaign_id_idx" ON "campaign_events"("campaign_id");

-- CreateIndex
CREATE INDEX "campaign_events_contact_id_idx" ON "campaign_events"("contact_id");

-- CreateIndex
CREATE INDEX "campaign_events_type_idx" ON "campaign_events"("type");

-- CreateIndex
CREATE INDEX "campaign_events_created_at_idx" ON "campaign_events"("created_at");

-- CreateIndex
CREATE INDEX "campaign_conversions_tenant_id_idx" ON "campaign_conversions"("tenant_id");

-- CreateIndex
CREATE INDEX "campaign_conversions_campaign_id_idx" ON "campaign_conversions"("campaign_id");

-- CreateIndex
CREATE INDEX "campaign_conversions_contact_id_idx" ON "campaign_conversions"("contact_id");

-- CreateIndex
CREATE INDEX "campaign_conversions_type_idx" ON "campaign_conversions"("type");

-- AddForeignKey
ALTER TABLE "segments" ADD CONSTRAINT "segments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment_rules" ADD CONSTRAINT "segment_rules_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment_rules" ADD CONSTRAINT "segment_rules_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment_members" ADD CONSTRAINT "segment_members_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment_members" ADD CONSTRAINT "segment_members_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment_members" ADD CONSTRAINT "segment_members_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_channels" ADD CONSTRAINT "campaign_channels_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_channels" ADD CONSTRAINT "campaign_channels_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_events" ADD CONSTRAINT "campaign_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_events" ADD CONSTRAINT "campaign_events_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_conversions" ADD CONSTRAINT "campaign_conversions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_conversions" ADD CONSTRAINT "campaign_conversions_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_conversions" ADD CONSTRAINT "campaign_conversions_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
