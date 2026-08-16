-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "trade_name" VARCHAR(200),
    "tax_id" VARCHAR(50),
    "industry" VARCHAR(100),
    "website" VARCHAR(250),
    "email" VARCHAR(150),
    "phone" VARCHAR(50),
    "address" VARCHAR(250),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country_code" VARCHAR(3),
    "postal_code" VARCHAR(20),
    "notes" TEXT,
    "size" VARCHAR(30),
    "annual_revenue" DECIMAL(18,2),
    "employees" INTEGER,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "email" VARCHAR(150),
    "phone" VARCHAR(50),
    "mobile" VARCHAR(50),
    "avatar_url" VARCHAR(500),
    "job_title" VARCHAR(100),
    "department" VARCHAR(100),
    "address" VARCHAR(250),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country_code" VARCHAR(3),
    "postal_code" VARCHAR(20),
    "lead_source" VARCHAR(50),
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "lifecycle_stage" VARCHAR(30),
    "owner_user_id" UUID,
    "score" INTEGER DEFAULT 0,
    "tags" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_company_relations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "role" VARCHAR(100),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_company_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_identifiers" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "identifier_type" VARCHAR(30) NOT NULL,
    "value" VARCHAR(250) NOT NULL,
    "normalized_value" VARCHAR(250) NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_identifiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_addresses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "address_type" VARCHAR(30) NOT NULL,
    "street" VARCHAR(250),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country_code" VARCHAR(3),
    "postal_code" VARCHAR(20),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "contact_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "color" VARCHAR(7),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_tags" (
    "id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_notes" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "user_id" UUID,
    "content" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "contact_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_assignments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "assigned_by" UUID,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companies_tenant_id_idx" ON "companies"("tenant_id");

-- CreateIndex
CREATE INDEX "companies_tenant_id_name_idx" ON "companies"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "companies_tenant_id_status_idx" ON "companies"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "contacts_tenant_id_idx" ON "contacts"("tenant_id");

-- CreateIndex
CREATE INDEX "contacts_tenant_id_email_idx" ON "contacts"("tenant_id", "email");

-- CreateIndex
CREATE INDEX "contacts_tenant_id_phone_idx" ON "contacts"("tenant_id", "phone");

-- CreateIndex
CREATE INDEX "contacts_tenant_id_status_idx" ON "contacts"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "contacts_tenant_id_owner_user_id_idx" ON "contacts"("tenant_id", "owner_user_id");

-- CreateIndex
CREATE INDEX "contacts_tenant_id_created_at_idx" ON "contacts"("tenant_id", "created_at");

-- CreateIndex
CREATE INDEX "contact_company_relations_tenant_id_idx" ON "contact_company_relations"("tenant_id");

-- CreateIndex
CREATE INDEX "contact_company_relations_contact_id_idx" ON "contact_company_relations"("contact_id");

-- CreateIndex
CREATE INDEX "contact_company_relations_company_id_idx" ON "contact_company_relations"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_company_relations_contact_id_company_id_key" ON "contact_company_relations"("contact_id", "company_id");

-- CreateIndex
CREATE INDEX "contact_identifiers_tenant_id_idx" ON "contact_identifiers"("tenant_id");

-- CreateIndex
CREATE INDEX "contact_identifiers_contact_id_idx" ON "contact_identifiers"("contact_id");

-- CreateIndex
CREATE INDEX "contact_identifiers_normalized_value_idx" ON "contact_identifiers"("normalized_value");

-- CreateIndex
CREATE UNIQUE INDEX "contact_identifiers_tenant_id_identifier_type_normalized_va_key" ON "contact_identifiers"("tenant_id", "identifier_type", "normalized_value");

-- CreateIndex
CREATE INDEX "contact_addresses_tenant_id_idx" ON "contact_addresses"("tenant_id");

-- CreateIndex
CREATE INDEX "contact_addresses_contact_id_idx" ON "contact_addresses"("contact_id");

-- CreateIndex
CREATE INDEX "tags_tenant_id_idx" ON "tags"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_tenant_id_name_key" ON "tags"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "contact_tags_contact_id_idx" ON "contact_tags"("contact_id");

-- CreateIndex
CREATE INDEX "contact_tags_tag_id_idx" ON "contact_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_tags_contact_id_tag_id_key" ON "contact_tags"("contact_id", "tag_id");

-- CreateIndex
CREATE INDEX "contact_notes_tenant_id_idx" ON "contact_notes"("tenant_id");

-- CreateIndex
CREATE INDEX "contact_notes_contact_id_idx" ON "contact_notes"("contact_id");

-- CreateIndex
CREATE INDEX "contact_notes_contact_id_created_at_idx" ON "contact_notes"("contact_id", "created_at");

-- CreateIndex
CREATE INDEX "contact_assignments_tenant_id_idx" ON "contact_assignments"("tenant_id");

-- CreateIndex
CREATE INDEX "contact_assignments_contact_id_idx" ON "contact_assignments"("contact_id");

-- CreateIndex
CREATE INDEX "contact_assignments_user_id_idx" ON "contact_assignments"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_assignments_contact_id_user_id_key" ON "contact_assignments"("contact_id", "user_id");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_company_relations" ADD CONSTRAINT "contact_company_relations_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_company_relations" ADD CONSTRAINT "contact_company_relations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_identifiers" ADD CONSTRAINT "contact_identifiers_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_addresses" ADD CONSTRAINT "contact_addresses_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_tags" ADD CONSTRAINT "contact_tags_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_tags" ADD CONSTRAINT "contact_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_notes" ADD CONSTRAINT "contact_notes_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_assignments" ADD CONSTRAINT "contact_assignments_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
