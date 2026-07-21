-- Create function to cleanup old served orders based on TTL setting
CREATE OR REPLACE FUNCTION cleanup_old_served_orders()
RETURNS void AS $$
DECLARE
  ttl_hours INTEGER;
BEGIN
  SELECT COALESCE(
    (SELECT CAST(value AS INTEGER) FROM "SystemSetting" WHERE key = 'order_history_ttl_hours'),
    24
  ) INTO ttl_hours;

  DELETE FROM "Order"
  WHERE status = 'served'
    AND "servedAt" < NOW() - (ttl_hours || ' hours')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Schedule the job to run every hour
SELECT cron.schedule(
  'cleanup-old-served-orders',
  '0 * * * *',
  'SELECT cleanup_old_served_orders()'
);
