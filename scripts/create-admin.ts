import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://llczpwuromcwiovpkdxf.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!serviceRoleKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const adminEmail = process.argv[2] ?? "admin@getboatkeg.com";
  const newPassword = process.argv[3] ?? "GetBoatkeg2026!";

  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users?.users.find((u) => u.email === adminEmail);

  if (!user) {
    console.log(`User not found: ${adminEmail}`);
    return;
  }

  console.log("Found user:", user.email, user.id);

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
    email_confirm: true,
  });

  if (error) {
    console.error("Password reset failed:", error.message);
  } else {
    console.log(`Password updated for ${adminEmail}`);
  }
}

main();
