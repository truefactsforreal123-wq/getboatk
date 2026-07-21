-- Drop QRSession table
DROP TABLE IF EXISTS "QRSession";

-- Drop timer columns from RestaurantTable
ALTER TABLE "RestaurantTable" DROP COLUMN IF EXISTS "qrActivatedAt";
ALTER TABLE "RestaurantTable" DROP COLUMN IF EXISTS "qrExpiresAt";
