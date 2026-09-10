import type { TrendData } from "../../api/types";

export const getFormattedMonths = (trendData: TrendData[]): string[] => {
    return trendData.map((row) => {
        const date = new Date(Number(row.report_month));

        const month = new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(date).replace(".", "");

        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

        return `${capitalizedMonth} ${date.getFullYear()}`;
    })
};