/**
 * Supabase Keep-Alive Function
 *
 * Prevents Supabase free-tier projects from pausing due to inactivity.
 * Hit /agent/keepalive to trigger manually.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

export const handler = async () => {
  console.log("[keepalive] Starting Supabase keep-alive ping...");

  if (!supabaseUrl || !supabaseKey) {
    console.error("[keepalive] Missing Supabase credentials");
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing Supabase credentials" }),
    };
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
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: error.message,
          timestamp: new Date().toISOString(),
        }),
      };
    }

    console.log(`[keepalive] Success! Sessions count: ${count}`);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Supabase pinged successfully",
        sessions_count: count,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (err) {
    console.error("[keepalive] Exception:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: String(err),
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
