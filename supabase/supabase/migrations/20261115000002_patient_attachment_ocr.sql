-- Add OCR extracted content column to PATIENT_ATTACHMENTS
ALTER TABLE public."PATIENT_ATTACHMENTS"
    ADD COLUMN IF NOT EXISTS ocr_extracted_content jsonb;
