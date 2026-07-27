import { createFileRoute } from "@tanstack/react-router";
import { getRuntimeHealth } from "@/lib/runtime-health";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const health = getRuntimeHealth(process.env as Record<string, string | undefined>);
        return Response.json(health, { status: health.ok ? 200 : 503 });
      },
    },
  },
});
