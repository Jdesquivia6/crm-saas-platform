-- CreateTable
CREATE TABLE "channel_accounts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "channel_type" VARCHAR(30) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "config" JSONB NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "last_sync_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "channel_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_channel_identities" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "channel_type" VARCHAR(30) NOT NULL,
    "channel_identifier" VARCHAR(250) NOT NULL,
    "display_name" VARCHAR(200),
    "avatar_url" VARCHAR(500),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "contact_channel_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contact_id" UUID,
    "channel_type" VARCHAR(30) NOT NULL,
    "channel_account_id" UUID,
    "external_id" VARCHAR(250),
    "subject" VARCHAR(250),
    "status" VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    "priority" VARCHAR(10) NOT NULL DEFAULT 'NORMAL',
    "last_message_at" TIMESTAMPTZ,
    "last_message_preview" VARCHAR(500),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "closed_at" TIMESTAMPTZ,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participants" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "contact_id" UUID,
    "user_id" UUID,
    "role" VARCHAR(20) NOT NULL DEFAULT 'PARTICIPANT',
    "joined_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMPTZ,

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "sender_type" VARCHAR(20) NOT NULL,
    "sender_id" UUID,
    "direction" VARCHAR(10) NOT NULL,
    "content" TEXT NOT NULL,
    "content_type" VARCHAR(20) NOT NULL DEFAULT 'TEXT',
    "external_id" VARCHAR(250),
    "status" VARCHAR(20) NOT NULL DEFAULT 'SENT',
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_attachments" (
    "id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "file_name" VARCHAR(250) NOT NULL,
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_assignments" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "assigned_by" UUID,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_status_history" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "from_status" VARCHAR(20),
    "to_status" VARCHAR(20) NOT NULL,
    "changed_by" UUID,
    "reason" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canned_responses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "shortcut" VARCHAR(50) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "category" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "canned_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "channel_accounts_tenant_id_idx" ON "channel_accounts"("tenant_id");

-- CreateIndex
CREATE INDEX "channel_accounts_tenant_id_channel_type_idx" ON "channel_accounts"("tenant_id", "channel_type");

-- CreateIndex
CREATE INDEX "contact_channel_identities_tenant_id_idx" ON "contact_channel_identities"("tenant_id");

-- CreateIndex
CREATE INDEX "contact_channel_identities_contact_id_idx" ON "contact_channel_identities"("contact_id");

-- CreateIndex
CREATE INDEX "contact_channel_identities_channel_type_channel_identifier_idx" ON "contact_channel_identities"("channel_type", "channel_identifier");

-- CreateIndex
CREATE UNIQUE INDEX "contact_channel_identities_tenant_id_channel_type_channel_i_key" ON "contact_channel_identities"("tenant_id", "channel_type", "channel_identifier");

-- CreateIndex
CREATE INDEX "conversations_tenant_id_idx" ON "conversations"("tenant_id");

-- CreateIndex
CREATE INDEX "conversations_contact_id_idx" ON "conversations"("contact_id");

-- CreateIndex
CREATE INDEX "conversations_tenant_id_status_idx" ON "conversations"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "conversations_tenant_id_channel_type_idx" ON "conversations"("tenant_id", "channel_type");

-- CreateIndex
CREATE INDEX "conversations_external_id_idx" ON "conversations"("external_id");

-- CreateIndex
CREATE INDEX "conversation_participants_conversation_id_idx" ON "conversation_participants"("conversation_id");

-- CreateIndex
CREATE INDEX "conversation_participants_contact_id_idx" ON "conversation_participants"("contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_participants_conversation_id_contact_id_key" ON "conversation_participants"("conversation_id", "contact_id");

-- CreateIndex
CREATE INDEX "messages_tenant_id_idx" ON "messages"("tenant_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_idx" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_created_at_idx" ON "messages"("conversation_id", "created_at");

-- CreateIndex
CREATE INDEX "messages_external_id_idx" ON "messages"("external_id");

-- CreateIndex
CREATE INDEX "message_attachments_message_id_idx" ON "message_attachments"("message_id");

-- CreateIndex
CREATE INDEX "conversation_assignments_conversation_id_idx" ON "conversation_assignments"("conversation_id");

-- CreateIndex
CREATE INDEX "conversation_assignments_user_id_idx" ON "conversation_assignments"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_assignments_conversation_id_user_id_key" ON "conversation_assignments"("conversation_id", "user_id");

-- CreateIndex
CREATE INDEX "conversation_status_history_conversation_id_idx" ON "conversation_status_history"("conversation_id");

-- CreateIndex
CREATE INDEX "conversation_status_history_conversation_id_created_at_idx" ON "conversation_status_history"("conversation_id", "created_at");

-- CreateIndex
CREATE INDEX "canned_responses_tenant_id_idx" ON "canned_responses"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "canned_responses_tenant_id_shortcut_key" ON "canned_responses"("tenant_id", "shortcut");

-- AddForeignKey
ALTER TABLE "channel_accounts" ADD CONSTRAINT "channel_accounts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_channel_identities" ADD CONSTRAINT "contact_channel_identities_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_assignments" ADD CONSTRAINT "conversation_assignments_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_status_history" ADD CONSTRAINT "conversation_status_history_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canned_responses" ADD CONSTRAINT "canned_responses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
