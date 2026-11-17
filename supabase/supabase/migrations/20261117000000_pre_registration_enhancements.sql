-- Add email column to PATIENT (cloud already has this)
ALTER TABLE "public"."PATIENT" ADD COLUMN IF NOT EXISTS "email" "text";

-- Change FAMILY_MEDICAL_HISTORY condition to conditions jsonb
ALTER TABLE "public"."FAMILY_MEDICAL_HISTORY" 
    ADD COLUMN IF NOT EXISTS "conditions" jsonb DEFAULT '[]'::jsonb;

-- Backfill existing condition text into conditions jsonb array
UPDATE "public"."FAMILY_MEDICAL_HISTORY"
SET "conditions" = jsonb_build_array("condition")
WHERE "conditions" = '[]'::jsonb AND "condition" IS NOT NULL AND "condition" != '';

-- Ensure VITAL_SIGNS has all needed columns (matches cloud schema)
ALTER TABLE "public"."VITAL_SIGNS" 
    ADD COLUMN IF NOT EXISTS "height" real,
    ADD COLUMN IF NOT EXISTS "weight" real,
    ADD COLUMN IF NOT EXISTS "spo2" real;
