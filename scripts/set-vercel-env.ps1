$vars = @{
  "NEXT_PUBLIC_SITE_URL" = $env:NEXT_PUBLIC_SITE_URL
  "NEXT_PUBLIC_SUPABASE_URL" = $env:NEXT_PUBLIC_SUPABASE_URL
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" = $env:NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  "NEXT_PUBLIC_SUPABASE_ANON_KEY" = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY
  "SUPABASE_SERVICE_ROLE_KEY" = $env:SUPABASE_SERVICE_ROLE_KEY
  "DATABASE_URL" = $env:DATABASE_URL
  "DIRECT_URL" = $env:DIRECT_URL
}

foreach ($key in $vars.Keys) {
  $val = $vars[$key]
  Write-Host "Setting $key ..."
  $val | vercel env add $key production --force 2>&1 | Out-Null
}

Write-Host "Done. Verifying..."
vercel env ls production
