import type { TrendData } from "../../api/types";
import { getStartDate } from "./getStartDate";

export const getFilteredTrend = (trend: TrendData[]) => {
    return trend.filter((row) => Number(row.report_month) >= getStartDate()).sort((a, b) => Number(a.report_month) - Number(b.report_month));
}