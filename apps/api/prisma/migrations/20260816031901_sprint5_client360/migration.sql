-- CreateTable
CREATE TABLE "contact_consents" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "channel" VARCHAR(30) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'GRANTED',
    "granted_at" TIMESTAMPTZ,
    "denied_at" TIMESTAMPTZ,
    "withdrawn_at" TIMESTAMPTZ,
    "source" VARCHAR(50),
    "ip_address" VARCHAR(45),
    "legal_basis" VARCHAR(50),
    "purpose" VARCHAR(200),
    "expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "contact_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_fields" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "entity_type" VARCHAR(30) NOT NULL,
    "field_name" VARCHAR(100) NOT NULL,
    "field_type" VARCHAR(30) NOT NULL,
    "label" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "default_value" JSONB,
    "validation" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "custom_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_field_options" (
    "id" UUID NOT NULL,
    "custom_field_id" UUID NOT NULL,
    "value" VARCHAR(200) NOT NULL,
    "label" VARCHAR(200) NOT NULL,
    "color" VARCHAR(7),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custom_field_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_custom_values" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "custom_field_id" UUID NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "contact_custom_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contact_id" UUID,
    "company_id" UUID,
    "user_id" UUID,
    "activity_type" VARCHAR(30) NOT NULL,
    "direction" VARCHAR(10),
    "subject" VARCHAR(250),
    "description" TEXT,
    "outcome" VARCHAR(50),
    "scheduled_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "duration" INTEGER,
    "priority" VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',
    "status" VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contact_consents_tenant_id_idx" ON "contact_consents"("tenant_id");

-- CreateIndex
CREATE INDEX "contact_consents_contact_id_idx" ON "contact_consents"("contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_consents_tenant_id_contact_id_channel_key" ON "contact_consents"("tenant_id", "contact_id", "channel");

-- CreateIndex
CREATE INDEX "custom_fields_tenant_id_idx" ON "custom_fields"("tenant_id");

-- CreateIndex
CREATE INDEX "custom_fields_tenant_id_entity_type_idx" ON "custom_fields"("tenant_id", "entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "custom_fields_tenant_id_entity_type_field_name_key" ON "custom_fields"("tenant_id", "entity_type", "field_name");

-- CreateIndex
CREATE INDEX "custom_field_options_custom_field_id_idx" ON "custom_field_options"("custom_field_id");

-- CreateIndex
CREATE INDEX "contact_custom_values_tenant_id_idx" ON "contact_custom_values"("tenant_id");

-- CreateIndex
CREATE INDEX "contact_custom_values_contact_id_idx" ON "contact_custom_values"("contact_id");

-- CreateIndex
CREATE INDEX "contact_custom_values_custom_field_id_idx" ON "contact_custom_values"("custom_field_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_custom_values_contact_id_custom_field_id_key" ON "contact_custom_values"("contact_id", "custom_field_id");

-- CreateIndex
CREATE INDEX "activities_tenant_id_idx" ON "activities"("tenant_id");

-- CreateIndex
CREATE INDEX "activities_contact_id_idx" ON "activities"("contact_id");

-- CreateIndex
CREATE INDEX "activities_company_id_idx" ON "activities"("company_id");

-- CreateIndex
CREATE INDEX "activities_tenant_id_activity_type_idx" ON "activities"("tenant_id", "activity_type");

-- CreateIndex
CREATE INDEX "activities_tenant_id_status_idx" ON "activities"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "activities_scheduled_at_idx" ON "activities"("scheduled_at");

-- AddForeignKey
ALTER TABLE "contact_consents" ADD CONSTRAINT "contact_consents_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_fields" ADD CONSTRAINT "custom_fields_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_options" ADD CONSTRAINT "custom_field_options_custom_field_id_fkey" FOREIGN KEY ("custom_field_id") REFERENCES "custom_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_custom_values" ADD CONSTRAINT "contact_custom_values_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_custom_values" ADD CONSTRAINT "contact_custom_values_custom_field_id_fkey" FOREIGN KEY ("custom_field_id") REFERENCES "custom_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
