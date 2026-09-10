import type { BigNumberTrendLineReturn } from "../../types/charts";

export const getBigNumberTrendline = (current: number | undefined, previous: number | undefined): BigNumberTrendLineReturn => {
    if (!previous || !current) {
        return {
            value: 0,
            trend: 0,
        };
    }

    const percentageChange = previous !== 0 ? ((current - previous) / previous) * 100 : 0;

    return {
        value: current,
        trend: percentageChange,
    };
};