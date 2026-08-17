-- CreateTable
CREATE TABLE "provider_accounts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "provider_user_id" VARCHAR(200),
    "account_name" VARCHAR(150) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "provider_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_intents" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "provider_account_id" UUID,
    "invoice_id" UUID,
    "contact_id" UUID,
    "number" VARCHAR(30) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "currency_code" VARCHAR(3) NOT NULL DEFAULT 'COP',
    "amount" DECIMAL(14,2) NOT NULL,
    "amount_received" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "amount_refunded" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "provider_ref" VARCHAR(200),
    "payment_method" VARCHAR(50),
    "description" VARCHAR(500),
    "failure_reason" VARCHAR(500),
    "metadata" JSONB,
    "expires_at" TIMESTAMPTZ,
    "succeeded_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "payment_intents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_links" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "provider_account_id" UUID,
    "number" VARCHAR(30) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "currency_code" VARCHAR(3) NOT NULL DEFAULT 'COP',
    "amount" DECIMAL(14,2) NOT NULL,
    "description" VARCHAR(500),
    "url" VARCHAR(500),
    "payment_count" INTEGER NOT NULL DEFAULT 0,
    "max_payments" INTEGER,
    "expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "payment_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "intent_id" UUID NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(14,2) NOT NULL,
    "currency_code" VARCHAR(3) NOT NULL DEFAULT 'COP',
    "provider_ref" VARCHAR(200),
    "fee_amount" DECIMAL(14,2),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "intent_id" UUID NOT NULL,
    "number" VARCHAR(30) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(14,2) NOT NULL,
    "currency_code" VARCHAR(3) NOT NULL DEFAULT 'COP',
    "reason" VARCHAR(500),
    "provider_ref" VARCHAR(200),
    "metadata" JSONB,
    "processed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "key" VARCHAR(200) NOT NULL,
    "endpoint" VARCHAR(200) NOT NULL,
    "status_code" INTEGER NOT NULL,
    "response" JSONB NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "provider_accounts_tenant_id_idx" ON "provider_accounts"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "provider_accounts_tenant_id_provider_provider_user_id_key" ON "provider_accounts"("tenant_id", "provider", "provider_user_id");

-- CreateIndex
CREATE INDEX "payment_intents_tenant_id_idx" ON "payment_intents"("tenant_id");

-- CreateIndex
CREATE INDEX "payment_intents_provider_account_id_idx" ON "payment_intents"("provider_account_id");

-- CreateIndex
CREATE INDEX "payment_intents_invoice_id_idx" ON "payment_intents"("invoice_id");

-- CreateIndex
CREATE INDEX "payment_intents_contact_id_idx" ON "payment_intents"("contact_id");

-- CreateIndex
CREATE INDEX "payment_intents_status_idx" ON "payment_intents"("status");

-- CreateIndex
CREATE INDEX "payment_intents_created_at_idx" ON "payment_intents"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_tenant_id_number_key" ON "payment_intents"("tenant_id", "number");

-- CreateIndex
CREATE INDEX "payment_links_tenant_id_idx" ON "payment_links"("tenant_id");

-- CreateIndex
CREATE INDEX "payment_links_provider_account_id_idx" ON "payment_links"("provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_links_tenant_id_number_key" ON "payment_links"("tenant_id", "number");

-- CreateIndex
CREATE INDEX "payment_transactions_tenant_id_idx" ON "payment_transactions"("tenant_id");

-- CreateIndex
CREATE INDEX "payment_transactions_intent_id_idx" ON "payment_transactions"("intent_id");

-- CreateIndex
CREATE INDEX "refunds_tenant_id_idx" ON "refunds"("tenant_id");

-- CreateIndex
CREATE INDEX "refunds_intent_id_idx" ON "refunds"("intent_id");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_tenant_id_number_key" ON "refunds"("tenant_id", "number");

-- CreateIndex
CREATE INDEX "idempotency_keys_tenant_id_idx" ON "idempotency_keys"("tenant_id");

-- CreateIndex
CREATE INDEX "idempotency_keys_key_endpoint_idx" ON "idempotency_keys"("key", "endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_tenant_id_key_endpoint_key" ON "idempotency_keys"("tenant_id", "key", "endpoint");

-- AddForeignKey
ALTER TABLE "provider_accounts" ADD CONSTRAINT "provider_accounts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_provider_account_id_fkey" FOREIGN KEY ("provider_account_id") REFERENCES "provider_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_links" ADD CONSTRAINT "payment_links_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_links" ADD CONSTRAINT "payment_links_provider_account_id_fkey" FOREIGN KEY ("provider_account_id") REFERENCES "provider_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_intent_id_fkey" FOREIGN KEY ("intent_id") REFERENCES "payment_intents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_intent_id_fkey" FOREIGN KEY ("intent_id") REFERENCES "payment_intents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
