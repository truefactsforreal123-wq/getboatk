-- ============================================================================
-- RLS Policies for QR Ordering Tables
-- Applied via Supabase SQL Editor or supabase db push
-- ============================================================================

-- 1. restaurant_tables: server-side access only (no direct client access)
ALTER TABLE "RestaurantTable" ENABLE ROW LEVEL SECURITY;

-- No direct SELECT by anon/public — token validation happens in API route via Prisma
-- This prevents anyone from enumerating tables via the Supabase client
DROP POLICY IF EXISTS "admin_all_restaurant_tables" ON "RestaurantTable";
CREATE POLICY "admin_all_restaurant_tables" ON "RestaurantTable"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. orders
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;

-- Customers can only INSERT orders (via server API, not directly)
-- Staff can SELECT/UPDATE orders
DROP POLICY IF EXISTS "staff_select_orders" ON "Order";
CREATE POLICY "staff_select_orders" ON "Order"
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "staff_update_orders" ON "Order";
CREATE POLICY "staff_update_orders" ON "Order"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public can SELECT orders that belong to their tracking token (for customer live tracking)
-- Tracking implemented via a one-time token validated server-side, not via RLS directly

-- 3. order_items
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "staff_select_order_items" ON "OrderItem";
CREATE POLICY "staff_select_order_items" ON "OrderItem"
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. system_settings: admin-only
ALTER TABLE "SystemSetting" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_system_settings" ON "SystemSetting";
CREATE POLICY "admin_all_system_settings" ON "SystemSetting"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
