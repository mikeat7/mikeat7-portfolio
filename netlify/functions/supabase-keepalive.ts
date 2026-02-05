/**
 * Supabase Keep-Alive Function
 *
 * Runs on a schedule to prevent Supabase free-tier projects from pausing
 * due to inactivity. Makes a simple query every 5 days.
 *
 * Netlify Scheduled Functions: https://docs.netlify.com/functions/scheduled-functions/
 */

import { createClient } from "@supabase/supabase-js";
import type { Config, Context } from "@netlify/functions";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

export default async function handler(req: Request, context: Context) {
  console.log("[keepalive] Starting Supabase keep-alive ping...");

  if (!supabaseUrl || !supabaseKey) {
    console.error("[keepalive] Missing Supabase credentials");
    return new Response(JSON.stringify({ error: "Missing Supabase credentials" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Simple query to keep the database active
    // Count sessions - lightweight and confirms DB is responsive
    const { count, error } = await supabase
      .from("web_sessions")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("[keepalive] Supabase query error:", error.message);
      return new Response(JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`[keepalive] Success! Sessions count: ${count}`);

    return new Response(JSON.stringify({
      success: true,
      message: "Supabase pinged successfully",
      sessions_count: count,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("[keepalive] Exception:", err);
    return new Response(JSON.stringify({
      error: String(err),
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Schedule: Run every 5 days at 3:00 AM UTC
// Cron format: minute hour day-of-month month day-of-week
// "0 3 */5 * *" = At 03:00 on every 5th day
export const config: Config = {
  schedule: "0 3 */5 * *"
};
