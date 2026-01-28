/**
 * Persistent daily rate limiter using Supabase.
 * Tracks requests per IP hash per day.
 * Works across cold starts (unlike in-memory limiter).
 */

import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

// Hash IP for privacy (don't store raw IPs)
function hashIp(ip: string): string {
  return createHash("sha256").update(ip + (process.env.RATE_LIMIT_SALT || "clarity")).digest("hex").slice(0, 32);
}

export async function checkDailyLimit(
  ip: string,
  maxPerDay = 100
): Promise<{ allowed: boolean; count: number; limit: number }> {
  const ipHash = hashIp(ip);
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    // Try to increment existing record
    const { data: existing, error: selectError } = await supabase
      .from("daily_rate_limits")
      .select("request_count")
      .eq("ip_hash", ipHash)
      .eq("request_date", today)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = no rows found (that's OK, means first request today)
      console.error("Daily limit check error:", selectError);
      // Fail open — allow request if DB error (don't block legitimate users)
      return { allowed: true, count: 0, limit: maxPerDay };
    }

    if (existing) {
      // Record exists — check limit before incrementing
      if (existing.request_count >= maxPerDay) {
        return { allowed: false, count: existing.request_count, limit: maxPerDay };
      }

      // Increment count
      const { error: updateError } = await supabase
        .from("daily_rate_limits")
        .update({
          request_count: existing.request_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq("ip_hash", ipHash)
        .eq("request_date", today);

      if (updateError) {
        console.error("Daily limit update error:", updateError);
      }

      return { allowed: true, count: existing.request_count + 1, limit: maxPerDay };
    } else {
      // First request today — insert new record
      const { error: insertError } = await supabase
        .from("daily_rate_limits")
        .insert({ ip_hash: ipHash, request_date: today, request_count: 1 });

      if (insertError) {
        console.error("Daily limit insert error:", insertError);
      }

      return { allowed: true, count: 1, limit: maxPerDay };
    }
  } catch (err) {
    console.error("Daily limit exception:", err);
    // Fail open
    return { allowed: true, count: 0, limit: maxPerDay };
  }
}
