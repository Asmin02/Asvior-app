import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Permanently deletes the authenticated user's account.
 * All user data (profile, settings, trips, favorites, history) is removed
 * automatically via ON DELETE CASCADE foreign keys.
 */
export const deleteAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    // Clean up avatar files in storage (not covered by FK cascade)
    try {
      const { data: files } = await supabaseAdmin.storage.from("avatars").list(userId);
      if (files && files.length > 0) {
        await supabaseAdmin.storage
          .from("avatars")
          .remove(files.map((f) => `${userId}/${f.name}`));
      }
    } catch (e) {
      console.error("Avatar cleanup failed", e);
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw new Error(`Account deletion failed: ${error.message}`);
    return { success: true };
  });
