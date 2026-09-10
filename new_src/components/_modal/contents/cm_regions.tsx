import styles from "../modal.module.css";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { getDatasetResults } from "../../../api/superset";
import type { CountryMapChartType } from "../../../api/types";
import { formatAmount } from "../../../utils/functions/formatNumber";
import SupersetLoader from "../../_loaders/superset";
import BigNumberLoader from "../../_loaders/big_number";
import { KPICard } from "../../_card/kpi_card";

interface componentProps {
    title: string;
    description: string;
    note?: string;
    icon: React.JSX.Element;
}

const regionNames: Record<string, string> = {
    "UZ-TK": "г. Ташкент",
    "UZ-TO": "Ташкентская обл.",
    "UZ-JI": "Джизак",
    "UZ-AN": "Андижан",
    "UZ-NG": "Наманган",
    "UZ-FA": "Фергана",
    "UZ-SI": "Сырдарья",
    "UZ-SA": "Самарканд",
    "UZ-QA": "Кашкадарья",
    "UZ-SU": "Сурхандарья",
    "UZ-BU": "Бухара",
    "UZ-NW": "Навои",
    "UZ-XO": "Хорезм",
    "UZ-QR": "Каракалпакстан",
};

type Region = {
    iso: string;
    name: string;
    value: number;
};

export function BN_CMRegion_Modal(props: componentProps) {
    const [regions, setRegions] = useState<Region[]>([]);
    const [firstRegion, setFirstRegion] = useState<Region | undefined>(undefined)
    const [lastRegion, setLastRegion] = useState<Region | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const chartData =
                    await getDatasetResults<CountryMapChartType>(
                        91,
                        [
                            "region_iso",
                            "volume_per_capita_uzs",
                        ],
                    );

                const data = chartData
                    .map((row) => {
                        const name = regionNames[row.region_iso];

                        if (!name) {
                            console.warn(
                                `Unknown region ISO: ${row.region_iso}`
                            );

                            return null;
                        }

                        return {
                            iso: row.region_iso,
                            name,
                            value: Number(
                                row.volume_per_capita_uzs
                            ),
                        };
                    })
                    .filter(
                        (item): item is Region =>
                            item !== null
                    )
                    .sort((a, b) => b.value - a.value);

                setRegions(data);
                setFirstRegion(data[0]);
                setLastRegion(data.at(-1));
            } catch (error) {
                console.error(
                    "Failed to load region data:",
                    error
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const option = {
        backgroundColor: "transparent",

        grid: {
            top: 5,
            right: 20,
            bottom: 10,
            left: 10,
            containLabel: true,
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

            extraCssText:
                "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);",

            formatter: (
                params: {
                    marker: string;
                    name: string;
                    value: number;
                }[],
            ) => {
                const item = params[0];

                if (!item) {
                    return "";
                }

                return `
                    <div>
                        <div style="
                            margin-bottom: 6px;
                            color: #E6DCC5;
                            font-weight: 600;
                        ">
                            ${item.name}
                        </div>

                        <div style="
                            color: #A9A18D;
                        ">
                            ${formatAmount(Number(item.value))} UZS / чел
                        </div>
                    </div>
                `;
            },
        },

        xAxis: {
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
                fontSize: 9,

                formatter: (value: number) =>
                    formatAmount(value),
            },

            splitLine: {
                show: true,

                lineStyle: {
                    color: "#2B2822",
                },
            },
        },

        yAxis: {
            type: "category",

            data: regions.map(
                (region) => region.name
            ),

            inverse: true,

            axisLine: {
                show: false,
            },

            axisTick: {
                show: false,
            },

            axisLabel: {
                color: "#A9A18D",
                fontSize: 10,
            },
        },

        series: [
            {
                name: "Объём на человека",

                type: "bar",

                data: regions.map((region) => ({
                    name: region.name,
                    value: region.value,
                    id: region.iso,
                })),

                barWidth: 12,

                barCategoryGap: "40%",

                itemStyle: {
                    color: "#D9A13D",
                    borderRadius: [1, 4, 4, 1],
                },

                emphasis: {
                    itemStyle: {
                        color: "#E6B84D",
                    },
                },
            },
        ],
    };

    return (
        <div>
            <div className={styles.modal_header}>
                <span className={styles.modal_header_icon}>
                    {props.icon}
                </span>

                <div className={styles.modal_header_titles}>
                    <h3
                        className={
                            styles.modal_header__title
                        }
                    >
                        {props.title}
                    </h3>

                    <span
                        className={
                            styles.modal_header__description
                        }
                    >
                        {props.description}
                    </span>
                </div>
            </div>

            <div className={styles.kpis_grid}>
                {/* <KPICard
                    a="В среднем по стране"
                    b="0.28 млн/чел."
                /> */}
                {/* {`${formatAmount(Number(firstRegion?.value))} UZS / чел`} */}

                {isLoading ? <BigNumberLoader size="md" /> : <KPICard a="Больше всех" b={firstRegion?.name} />}

                {isLoading ? <BigNumberLoader size="md" /> : <KPICard a="Ниже всех" b={lastRegion?.name} />}
            </div>

            <div className={styles.chart}>
                {isLoading ? (
                    <SupersetLoader />
                ) : (
                    <ReactECharts option={option} />
                )}
            </div>

            <p className={styles.bottom_text}>
                {props.note}
            </p>
        </div>
    );
}