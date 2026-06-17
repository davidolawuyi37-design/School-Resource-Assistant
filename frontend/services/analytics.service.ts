import { api } from "@/services/api";
import type { AnalyticsSummary } from "@/types";

export async function getAnalyticsSummary() {
  const { data } = await api.get<AnalyticsSummary>("/analytics/summary");
  return data;
}
