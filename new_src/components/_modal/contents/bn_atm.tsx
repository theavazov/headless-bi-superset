import styles from "../modal.module.css";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { getChartResults } from "../../../api/superset";
import type { BigNumberTrendlineRow, BigNumberTrendsObject, TrendData } from "../../../api/types";
import BigNumberLoader from "../../_loaders/big_number";
import { formatAmount } from "../../../utils/functions/formatNumber";
import SupersetLoader from "../../_loaders/superset";
import type { ModalPropsType } from "../../../types/charts";
import { KPICard } from "../../_card/kpi_card";
import { ModalHeader } from "../header";
import { getFilteredTrend } from "../../../utils/functions/getFilteredTrend";
import { getFormattedMonths } from "../../../utils/functions/getFormattedMonths";
import { getTrendText } from "../../../utils/functions/getTrendText";
import { getTrendColor } from "../../../utils/functions/getTrendColor";
import { getActivePercentData } from "../../../utils/functions/getActivePercentData";
import { getBigNumberTrendline } from "../../../utils/functions/getBigNumberTrendline";

const CHART_IDS = {
    connected: 389,
    active: 393,
    newPerMonth: 390,
    inactive90Days: 395,
    trend: 399,
};

type TooltipParam = {
    axisValue: string;
    marker: string;
    seriesName: string;
    value: number | string;
};

export function BN_ATM_Modal(props: ModalPropsType) {
    const [isLoading, setIsLoading] = useState(true);
    const [connected, setConnected] = useState(0);
    const [active, setActive] = useState(0);
    const [newPerMonth, setNewPerMonth] = useState(0);
    const [inactive90Days, setInactive90Days] = useState(0);
    const [trendData, setTrendData] = useState<TrendData[]>([]);
    const [trends, setTrends] = useState<BigNumberTrendsObject | null>(null);

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            try {
                const [
                    connectedResponse,
                    activeResponse,
                    newPerMonthResponse,
                    inactiveResponse,
                    trendResponse,
                ] = await Promise.all([
                    getChartResults<BigNumberTrendlineRow>(CHART_IDS.connected),
                    getChartResults<BigNumberTrendlineRow>(CHART_IDS.active),
                    getChartResults<BigNumberTrendlineRow>(CHART_IDS.newPerMonth),
                    getChartResults<BigNumberTrendlineRow>(CHART_IDS.inactive90Days),
                    getChartResults<TrendData>(CHART_IDS.trend)
                ]);

                const getSortedData = (response: typeof connectedResponse): BigNumberTrendlineRow[] => {
                    const data = (response.result.at(0)?.data as BigNumberTrendlineRow[]) ?? [];

                    return [...data].sort((a, b) => Number(a.report_month) - Number(b.report_month));
                };

                setConnected(Number(getSortedData(connectedResponse).at(-1)?.count ?? 0));
                setActive(Number(getSortedData(activeResponse).at(-1)?.count ?? 0));
                setNewPerMonth(Number(getSortedData(newPerMonthResponse).at(-1)?.count ?? 0));
                setInactive90Days(Number(getSortedData(inactiveResponse).at(-1)?.count ?? 0));
                setTrendData(getFilteredTrend((trendResponse.result.at(0)?.data as TrendData[]) ?? []));
                setTrends({
                    'connected': connectedResponse.result[0].data,
                    'active': activeResponse.result[0].data,
                    'newPerMonth': newPerMonthResponse.result[0].data,
                    'inactive': inactiveResponse.result[0].data
                });
            } catch (error) {
                console.error("Failed to load ATM modal data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const connectedTrend = getBigNumberTrendline(trends?.connected.at(-1)?.count, trends?.connected.at(-2)?.count);
    const activeTrend = getBigNumberTrendline(trends?.active.at(-1)?.count, trends?.active.at(-2)?.count);
    const newPerMonthTrend = getBigNumberTrendline(trends?.newPerMonth.at(-1)?.count, trends?.newPerMonth.at(-2)?.count);
    const inactiveTrend = getBigNumberTrendline(trends?.inactive.at(-1)?.count, trends?.inactive.at(-2)?.count);

    const months = getFormattedMonths(trendData);

    const option = {
        backgroundColor: "transparent",

        textStyle: {
            fontFamily:
                "Montserrat, sans-serif",
        },

        tooltip: {
            trigger: "axis",

            axisPointer: {
                type: "none",
            },

            backgroundColor: "#24211B",
            borderColor: "#6B5B3D",
            borderWidth: 1,
            borderRadius: 10,

            padding: [10, 14],

            textStyle: {
                color: "#E6DCC5",
                fontSize: 10,
                fontWeight: 600,
            },

            formatter: (
                params: TooltipParam[]
            ) => {
                const title =
                    params[0]?.axisValue ?? "";

                return `
                    <div>
                        <div style="
                            margin-bottom: 8px;
                            color: #E6DCC5;
                        ">
                            ${title}
                        </div>

                        ${params
                        .map((item) => {
                            const value =
                                Number(item.value);

                            const formatted =
                                item.seriesName ===
                                    "Доля активных, %"
                                    ? `${value.toFixed(1)}%`
                                    : `${formatAmount(
                                        value * 1000
                                    )}`;

                            return `
                                    <div style="
                                        display: flex;
                                        justify-content: space-between;
                                        gap: 20px;
                                        margin-bottom: 3px;
                                    ">
                                        <span>
                                            ${item.marker}
                                            ${item.seriesName}
                                        </span>

                                        <strong>
                                            ${formatted}
                                        </strong>
                                    </div>
                                `;
                        })
                        .join("")}
                    </div>
                `;
            },

            extraCssText:
                "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);",
        },

        /*
         * --------------------------------------------------------
         * LEGEND
         * --------------------------------------------------------
         */

        legend: {
            bottom: 0,

            orient: "horizontal",

            itemWidth: 8,
            itemHeight: 8,
            itemGap: 16,

            icon: "roundRect",

            textStyle: {
                color: "#AA9E87",
                fontWeight: 600,
                fontSize: 10,
            },

            data: [
                "Подключено, тыс.",
                "Активных, тыс.",
                "Доля активных, %",
            ],
        },

        /*
         * --------------------------------------------------------
         * GRID
         * --------------------------------------------------------
         */

        grid: {
            left: 30,
            right: 35,
            top: 15,
            bottom: 45,
        },

        /*
         * --------------------------------------------------------
         * X AXIS
         * --------------------------------------------------------
         */

        xAxis: {
            type: "category",

            data: months,

            axisLine: {
                show: false,
            },

            axisTick: {
                show: false,
            },

            axisLabel: {
                color: "#716B5E",
                fontSize: 10,
            },
        },

        /*
         * --------------------------------------------------------
         * Y AXES
         * --------------------------------------------------------
         */

        yAxis: [
            {
                type: "value",

                min: 0,

                axisLine: {
                    show: false,
                },

                axisTick: {
                    show: false,
                },

                axisLabel: {
                    color: "#716B5E",
                    fontSize: 10,

                    formatter: (value: number) =>
                        `${value} тыс.`,
                },

                splitLine: {
                    lineStyle: {
                        color: "#2B2822",
                    },
                },
            },

            {
                type: "value",

                min: 0,
                max: 100,

                axisLine: {
                    show: false,
                },

                axisTick: {
                    show: false,
                },

                axisLabel: {
                    color: "#716B5E",
                    fontSize: 10,

                    formatter: (
                        value: number
                    ) => `${value}%`,
                },

                splitLine: {
                    show: false,
                },
            },
        ],

        /*
         * --------------------------------------------------------
         * SERIES
         * --------------------------------------------------------
         */

        series: [
            {
                name: "Подключено, тыс.",

                type: "bar",

                data: trendData.map((row) => Number(row.issued_count) / 1000),

                barWidth: 22,

                itemStyle: {
                    color: "#4B463B",

                    borderRadius: [
                        4,
                        4,
                        0,
                        0,
                    ],
                },

                z: 1,
            },

            {
                name: "Активных, тыс.",

                type: "bar",

                data: trendData.map((row) => Number(row.activated_count) / 1000),

                barWidth: 22,

                itemStyle: {
                    color: "#D9A13D",

                    borderRadius: [
                        4,
                        4,
                        0,
                        0,
                    ],
                },

                z: 2,
            },

            {
                name: "Доля активных, %",

                type: "line",

                yAxisIndex: 1,

                data: getActivePercentData(trendData),

                smooth: true,

                showSymbol: false,

                lineStyle: {
                    color: "#E6DCC5",
                    width: 2,
                },

                itemStyle: {
                    color: "#E6DCC5",
                },

                z: 3,
            },
        ],
    };

    return (
        <div>
            <ModalHeader title={props.title} description={props.description} icon={props.icon} />
            <div className={styles.kpis_grid}>
                {isLoading ? (
                    <>
                        <BigNumberLoader size="md" />
                        <BigNumberLoader size="md" />
                        <BigNumberLoader size="md" />
                        <BigNumberLoader size="md" />
                    </>
                ) : (
                    <>
                        <KPICard
                            a="Подключено"
                            b={formatAmount(connected)}
                            c={getTrendText(connectedTrend.trend)}
                            trendColor={getTrendColor(connectedTrend.trend, "normal")}
                        />
                        <KPICard
                            a="Активных"
                            b={formatAmount(active)}
                            c={getTrendText(activeTrend.trend)}
                            trendColor={getTrendColor(activeTrend.trend, "normal")}
                        />
                        <KPICard
                            a="Новых за месяц"
                            b={formatAmount(newPerMonth)}
                            c={getTrendText(newPerMonthTrend.trend)}
                            trendColor={getTrendColor(newPerMonthTrend.trend, "normal")}
                        />
                        <KPICard
                            a="Без операций 90 дней"
                            b={formatAmount(inactive90Days)}
                            c={getTrendText(inactiveTrend.trend)}
                            trendColor={getTrendColor(inactiveTrend.trend, "reversal")}
                        />
                    </>
                )}
            </div>
            <div className={styles.chart}>
                {isLoading ? (
                    <SupersetLoader />
                ) : (
                    <ReactECharts option={option} />
                )}
            </div>
            <p className={styles.bottom_text}>{props.note}</p>
        </div>
    );
}