-- CreateTable
CREATE TABLE "integration_connections" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "provider" VARCHAR(30) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "config" JSONB NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "last_sync_at" TIMESTAMPTZ,
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "integration_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_webhook_inbox" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "provider" VARCHAR(30) NOT NULL,
    "external_id" VARCHAR(250),
    "payload" JSONB NOT NULL,
    "headers" JSONB,
    "status" VARCHAR(20) NOT NULL DEFAULT 'RECEIVED',
    "processed_at" TIMESTAMPTZ,
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integration_webhook_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_webhook_outbox" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "provider" VARCHAR(30) NOT NULL,
    "external_id" VARCHAR(250),
    "payload" JSONB NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 3,
    "last_attempt_at" TIMESTAMPTZ,
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "integration_webhook_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_delivery_events" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "external_id" VARCHAR(250),
    "status" VARCHAR(20) NOT NULL,
    "error_code" VARCHAR(50),
    "error_message" VARCHAR(500),
    "metadata" JSONB,
    "event_timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_delivery_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_templates" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "language" VARCHAR(10) NOT NULL DEFAULT 'es',
    "body" TEXT NOT NULL,
    "variables" JSONB,
    "status" VARCHAR(20) NOT NULL DEFAULT 'APPROVED',
    "external_id" VARCHAR(250),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "message_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "integration_connections_tenant_id_idx" ON "integration_connections"("tenant_id");

-- CreateIndex
CREATE INDEX "integration_connections_tenant_id_provider_idx" ON "integration_connections"("tenant_id", "provider");

-- CreateIndex
CREATE INDEX "integration_webhook_inbox_tenant_id_idx" ON "integration_webhook_inbox"("tenant_id");

-- CreateIndex
CREATE INDEX "integration_webhook_inbox_provider_external_id_idx" ON "integration_webhook_inbox"("provider", "external_id");

-- CreateIndex
CREATE INDEX "integration_webhook_inbox_status_idx" ON "integration_webhook_inbox"("status");

-- CreateIndex
CREATE INDEX "integration_webhook_outbox_tenant_id_idx" ON "integration_webhook_outbox"("tenant_id");

-- CreateIndex
CREATE INDEX "integration_webhook_outbox_status_idx" ON "integration_webhook_outbox"("status");

-- CreateIndex
CREATE INDEX "integration_webhook_outbox_tenant_id_provider_idx" ON "integration_webhook_outbox"("tenant_id", "provider");

-- CreateIndex
CREATE INDEX "message_delivery_events_message_id_idx" ON "message_delivery_events"("message_id");

-- CreateIndex
CREATE INDEX "message_delivery_events_tenant_id_idx" ON "message_delivery_events"("tenant_id");

-- CreateIndex
CREATE INDEX "message_delivery_events_external_id_idx" ON "message_delivery_events"("external_id");

-- CreateIndex
CREATE INDEX "message_templates_tenant_id_idx" ON "message_templates"("tenant_id");

-- CreateIndex
CREATE INDEX "message_templates_tenant_id_category_idx" ON "message_templates"("tenant_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "message_templates_tenant_id_name_key" ON "message_templates"("tenant_id", "name");

-- AddForeignKey
ALTER TABLE "integration_connections" ADD CONSTRAINT "integration_connections_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_webhook_inbox" ADD CONSTRAINT "integration_webhook_inbox_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_webhook_outbox" ADD CONSTRAINT "integration_webhook_outbox_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_templates" ADD CONSTRAINT "message_templates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
