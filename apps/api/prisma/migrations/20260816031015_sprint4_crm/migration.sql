-- AddForeignKey
ALTER TABLE "contact_assignments" ADD CONSTRAINT "contact_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
