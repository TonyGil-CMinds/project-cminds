-- Drop Subscription table (consolidated into Contact)
DROP TABLE IF EXISTS "Subscription";

-- Add active status to Contact
ALTER TABLE "Contact" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;
