-- ============================================================================
-- RLS Policies for remaining unprotected tables
-- ============================================================================

-- 1. Admin: authenticated only (protects password hashes)
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_only_admin" ON "Admin";
CREATE POLICY "admin_only_admin" ON "Admin"
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 2. Branch: public read, admin write
ALTER TABLE "Branch" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_branch" ON "Branch";
CREATE POLICY "public_read_branch" ON "Branch"
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "admin_all_branch" ON "Branch";
CREATE POLICY "admin_all_branch" ON "Branch"
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 3. Category: public read, admin write
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_category" ON "Category";
CREATE POLICY "public_read_category" ON "Category"
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "admin_all_category" ON "Category";
CREATE POLICY "admin_all_category" ON "Category"
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 4. MenuItem: public read, admin write
ALTER TABLE "MenuItem" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_menuitem" ON "MenuItem";
CREATE POLICY "public_read_menuitem" ON "MenuItem"
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "admin_all_menuitem" ON "MenuItem";
CREATE POLICY "admin_all_menuitem" ON "MenuItem"
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 5. Review: public read approved, public insert, admin full
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_review" ON "Review";
CREATE POLICY "public_read_review" ON "Review"
  FOR SELECT TO anon
  USING ("approved" = true);

DROP POLICY IF EXISTS "public_insert_review" ON "Review";
CREATE POLICY "public_insert_review" ON "Review"
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_all_review" ON "Review";
CREATE POLICY "admin_all_review" ON "Review"
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
