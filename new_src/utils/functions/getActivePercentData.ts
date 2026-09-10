import type { TrendData } from "../../api/types";

export const getActivePercentData = (trendData: TrendData[]): number[] => {
    return trendData.map((row) => {
        const issued = Number(row.issued_count);

        const activated = Number(row.activated_count);

        if (!issued) return 0;

        return ((activated / issued) * 100);
    });
}