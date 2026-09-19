export const logs = [
  {
    timestamp: "2026-09-18T10:00:00Z",
    service: "checkout",
    level: "ERROR",
    message: "Database timeout after 3000ms",
  },
  {
    timestamp: "2026-09-18T10:01:00Z",
    service: "checkout",
    level: "ERROR",
    message: "Database timeout after 3000ms",
  },
  {
    timestamp: "2026-09-18T10:02:00Z",
    service: "checkout",
    level: "WARN",
    message: "Connection pool usage reached 95%",
  }
];

export const metrics = [
  {
    service: "checkout",
    metric: "latency",
    p95: 2400,
    unit: "ms"
  },
  {
    service: "checkout",
    metric: "error_rate",
    value: 8.4,
    unit: "%"
  }
];

export const serviceStatuses = [
  {
    service: "checkout",
    status: "degraded"
  }
];