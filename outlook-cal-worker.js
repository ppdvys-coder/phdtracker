/* =====================================================================
   Outlook calendar proxy (Cloudflare Worker) — for PhD Journey Tracker
   ---------------------------------------------------------------------
   Fetches your PRIVATE Outlook .ics link server-side (so the link never
   appears in the public web page) and returns it to the app with CORS
   headers. The app parses the events and adds them to your Activity Log.

   Deploy free at https://workers.cloudflare.com:
     1. Create application → Create Worker → name it e.g. "outlook-cal" → Deploy
     2. Edit code → delete the sample → paste this whole file → Deploy
     3. Paste your Outlook ICS link into ICS_URL below (keep the quotes)
     4. Copy the Worker URL (…workers.dev) into window.OUTLOOK_ENDPOINT in index.html
   The Worker only READS your calendar and returns it — no write access, no keys.
   ===================================================================== */

const ICS_URL = "PASTE_YOUR_OUTLOOK_ICS_LINK_HERE";

export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cache-Control": "public, max-age=300", // refresh ~every 5 min
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (/PASTE_YOUR_OUTLOOK/.test(ICS_URL)) {
      return new Response(JSON.stringify({ error: "Set ICS_URL in the Worker first." }), {
        status: 500, headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    try {
      const res = await fetch(ICS_URL, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; PhDTrackerCal/1.0)" },
        cf: { cacheTtl: 300, cacheEverything: true },
      });
      if (!res.ok) throw new Error("calendar fetch " + res.status);
      const ics = await res.text();
      return new Response(ics, { headers: { ...cors, "Content-Type": "text/calendar; charset=utf-8" } });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 502, headers: { ...cors, "Content-Type": "application/json" },
      });
    }
  },
};
