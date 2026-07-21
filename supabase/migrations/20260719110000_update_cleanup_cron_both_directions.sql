-- Update cleanup function to handle both directions:
-- 1. Clear DB images where storage file is missing
-- 2. Delete storage files not referenced by any DB row

CREATE OR REPLACE FUNCTION cleanup_orphaned_menu_images()
RETURNS void AS $$
BEGIN
  -- Direction 1: Clear DB images where storage file is missing
  UPDATE "Category"
  SET "image" = ''
  WHERE "image" LIKE '%menu-images%'
    AND regexp_replace("image", '.*menu-images/', '') NOT IN (
      SELECT name FROM storage.objects WHERE bucket_id = 'menu-images'
    );

  UPDATE "MenuItem"
  SET "image" = ''
  WHERE "image" LIKE '%menu-images%'
    AND regexp_replace("image", '.*menu-images/', '') NOT IN (
      SELECT name FROM storage.objects WHERE bucket_id = 'menu-images'
    );

  -- Direction 2: Delete storage files not referenced by any DB row
  DELETE FROM storage.objects
  WHERE bucket_id = 'menu-images'
    AND name NOT IN (
      SELECT regexp_replace("image", '.*menu-images/', '')
      FROM "Category"
      WHERE "image" LIKE '%menu-images%' AND "image" != ''
    )
    AND name NOT IN (
      SELECT regexp_replace("image", '.*menu-images/', '')
      FROM "MenuItem"
      WHERE "image" LIKE '%menu-images%' AND "image" != ''
    )
    AND name != 'category.jpg';
END;
$$ LANGUAGE plpgsql;
