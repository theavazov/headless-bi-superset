import type { IBarChart } from '../../../types/charts';
import ReactECharts from 'echarts-for-react';
import { ChartCardHeader } from '../../_card/header';
import { useEffect, useState } from 'react';
import { getChartResults } from '../../../api/superset';
import type { BigNumberType } from '../../../api/types';
import { formatMonth } from '../../../utils/functions/formatMonth';
import { formatAmount } from '../../../utils/functions/formatNumber';
import SupersetLoader from '../../_loaders/superset';

type ChartTooltipParam = {
    axisValue: string | number;
    marker: string;
    seriesName: string;
    value: string | number | null;
};

export const ActiveTerminalsATM = ({ props }: { props: IBarChart }) => {
    const [months, setMonths] = useState<string[]>([]);
    const [activeCards, setActiveCards] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            try {
                const obj = await getChartResults(441);

                const activeData = obj.result[0]?.data as BigNumberType[];

                const now = new Date();

                const endDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1
                ).getTime();

                const startDate = new Date(
                    now.getFullYear(),
                    now.getMonth() - 11,
                    1
                ).getTime();

                const filteredActiveData = activeData.filter((row) => {
                    const reportMonth = Number(row.report_month);

                    return reportMonth >= startDate && reportMonth < endDate;
                });

                const months = filteredActiveData.map((row) =>
                    formatMonth(Number(row.report_month))
                );

                const active = filteredActiveData.map(
                    (row) => Number(row.value)
                );

                setMonths(months);
                setActiveCards(active);
            } catch (error) {
                console.error(
                    'Failed to load chart data:',
                    error
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const option = {
        backgroundColor: 'transparent',

        tooltip: {
            show: false,
            trigger: 'axis',

            axisPointer: {
                type: 'none',
            },

            borderWidth: 1,
            borderRadius: 10,

            padding: [10, 14],

            textStyle: {
                color: '#E6DCC5',
                fontSize: 10,
                fontWeight: 600,
            },

            extraCssText:
                'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);',

            formatter: (params: ChartTooltipParam[]) => {
                const title = params[0]?.axisValue;

                return `
                        <div>
                            <div style="
                                margin-bottom: 8px;
                                color: #E6DCC5;
                            ">
                                ${title}
                            </div>
    
                            ${params
                        .map(
                            (item) => `
                                        <div style="
                                            display: flex;
                                            justify-content: space-between;
                                            gap: 20px;
                                        ">
                                            <span>
                                                ${item.marker}
                                                ${item.seriesName}
                                            </span>
    
                                            <span>
                                                ${formatAmount(
                                Number(item.value)
                            )}
                                            </span>
                                        </div>
                                    `
                        )
                        .join('')}
                        </div>
                    `;
            },
        },

        legend: {
            show: false,
            top: 0,
            left: 0,
            orient: 'horizontal',

            itemWidth: 8,
            itemHeight: 8,
            itemGap: 16,

            icon: 'roundRect',

            textStyle: {
                color: '#374151',
                fontWeight: 500,
                fontSize: 10,
            },

            data: ['Активные устройства'],
        },

        grid: {
            left: 20,
            right: 10,
            top: 20,
            bottom: 35,
        },

        xAxis: {
            type: 'category',

            boundaryGap: false,

            data: months,

            axisLine: {
                show: false,
            },

            axisTick: {
                show: false,
            },

            axisLabel: {
                color: '#9CA3AF',
                fontSize: 10,
                align: "center",
                padding: [10, 0, 0, 20],
            },
        },

        yAxis: {
            type: 'value',

            splitLine: {
                show: true,
                lineStyle: {
                    color: '#f5f5f5',
                    width: 1,
                    type: 'solid',
                },
            },

            axisLabel: {
                color: '#9CA3AF',
                fontSize: 10,
                formatter: (value: number) => formatAmount(value),
            },

            axisLine: {
                show: false,
            },

            axisTick: {
                show: false,
            },
        },

        series: {
            name: 'Активные ATM-терминалы',
            type: 'line',

            data: activeCards,
            smooth: true,

            symbol: 'circle',
            symbolSize: 5,

            lineStyle: {
                color: '#7446E8',
                width: 2,
            },

            itemStyle: {
                color: '#7446E8',
            },

            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: 'rgba(116, 70, 232, 0.20)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(116, 70, 232, 0.04)',
                        },
                    ],
                },
            },
        },

    };

    return (
        <div className="d-card cc">
            <div className="hdr">
                {props.title && props.description &&
                    <ChartCardHeader props={{
                        title: props.title,
                        description: props.description,
                        top_left: props.top_left,
                        top_right: props.top_right
                    }}
                    />
                }
            </div>

            <div className="ch">
                {isLoading ? (
                    <SupersetLoader />
                ) : (
                    <ReactECharts option={option} />
                )}
            </div>
        </div>
    );
};