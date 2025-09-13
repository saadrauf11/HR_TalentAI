CREATE EXTENSION IF NOT EXISTS vector;

-- Add pgvector columns (1536 dims for OpenAI)
ALTER TABLE "Vector" ALTER COLUMN "embedding" TYPE vector(1536) USING "embedding"::vector;
ALTER TABLE "JobVector" ALTER COLUMN "embedding" TYPE vector(1536) USING "embedding"::vector;

-- Index for fast vector search
CREATE INDEX IF NOT EXISTS vector_embedding_idx ON "Vector" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Enable RLS and add policies for tenant isolation
ALTER TABLE "Candidate" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_candidate ON "Candidate"
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
CREATE POLICY tenant_insert_candidate ON "Candidate"
  FOR INSERT WITH CHECK (tenant_id = current_setting('app.current_tenant')::uuid);

ALTER TABLE "Job" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_job ON "Job"
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
CREATE POLICY tenant_insert_job ON "Job"
  FOR INSERT WITH CHECK (tenant_id = current_setting('app.current_tenant')::uuid);

ALTER TABLE "CvFile" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_cvfile ON "CvFile"
  USING (
    candidate_id IN (
      SELECT id FROM "Candidate"
      WHERE tenant_id = current_setting('app.current_tenant')::uuid
    )
  );
CREATE POLICY tenant_insert_cvfile ON "CvFile"
  FOR INSERT WITH CHECK (
    candidate_id IN (
      SELECT id FROM "Candidate"
      WHERE tenant_id = current_setting('app.current_tenant')::uuid
    )
  );

-- Repeat for other tables as needed (Match, GeneratedSummary, etc.)
