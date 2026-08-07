import { createFileRoute } from "@tanstack/react-router";
import { applyCapacitorCors } from "@/lib/api-base";
import { getVisaNewsUpdates } from "@/lib/visa-news.server";

export const Route = createFileRoute("/api/visa-news")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const force = url.searchParams.get("refresh") === "1";
          const payload = await getVisaNewsUpdates(force);
          return applyCapacitorCors(
            request,
            Response.json(payload, {
              headers: {
                "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
              },
            }),
          );
        } catch (err) {
          console.error("[visa-news]", err);
          return applyCapacitorCors(
            request,
            Response.json(
              {
                items: [],
                fetchedAt: new Date().toISOString(),
                stale: true,
                source: "empty",
              },
              { status: 500 },
            ),
          );
        }
      },
    },
  },
});
