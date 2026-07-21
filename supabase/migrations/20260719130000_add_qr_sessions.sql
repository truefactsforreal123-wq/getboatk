-- ============================================================================
-- QR Session System: Shared timer + Device limiting + Countdown support
-- ============================================================================

-- 1. Add activation/expiry columns to RestaurantTable
ALTER TABLE "RestaurantTable"
  ADD COLUMN IF NOT EXISTS "qrActivatedAt" timestamptz(6),
  ADD COLUMN IF NOT EXISTS "qrExpiresAt" timestamptz(6);

-- 2. Create QRSession table
CREATE TABLE IF NOT EXISTS "QRSession" (
  "id"                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tableId"           uuid NOT NULL REFERENCES "RestaurantTable"("id") ON DELETE CASCADE,
  "deviceFingerprint" text NOT NULL,
  "lastActiveAt"      timestamptz(6) NOT NULL DEFAULT now(),
  "expiresAt"         timestamptz(6) NOT NULL,
  "createdAt"         timestamptz(6) NOT NULL DEFAULT now(),
  UNIQUE ("tableId", "deviceFingerprint")
);

CREATE INDEX IF NOT EXISTS "QRSession_tableId_idx" ON "QRSession"("tableId");
CREATE INDEX IF NOT EXISTS "QRSession_expiresAt_idx" ON "QRSession"("expiresAt");

-- 3. RLS: QRSession is server-side only (Prisma API routes)
ALTER TABLE "QRSession" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_all_qr_sessions" ON "QRSession";
CREATE POLICY "authenticated_all_qr_sessions" ON "QRSession"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
