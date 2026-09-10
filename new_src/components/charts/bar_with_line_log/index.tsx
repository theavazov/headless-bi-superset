import type { IBarChart } from '../../../types/charts';
import ReactECharts from 'echarts-for-react';
import { ChartCardHeader } from '../../_card/header';
import { useEffect, useState } from 'react';
import { getChartResults } from '../../../api/superset';
import type { PosAmountData } from '../../../api/types';
import { formatMonth } from '../../../utils/functions/formatMonth';
import { formatAmount } from '../../../utils/functions/formatNumber';
import SupersetLoader from '../../_loaders/superset';

type ChartTooltipParam = {
    axisValue: string | number;
    marker: string;
    seriesName: string;
    value: string | number | null;
};

type PaymentSchema =
    | 'HUMO'
    | 'Visa'
    | 'Uzcard'
    | 'MasterCard'
    | 'Elcard'
    | 'UnionPay'

const PAYMENT_SCHEMAS: PaymentSchema[] = [
    'HUMO',
    'Visa',
    'Uzcard',
    'MasterCard',
    'Elcard',
    'UnionPay',
];

const PAYMENT_COLORS: Record<PaymentSchema, string> = {
    HUMO: '#246BEB',
    Visa: '#E58A00',
    Uzcard: '#E8C9A5',
    MasterCard: '#9254DE',
    Elcard: '#CDB4E9',
    UnionPay: '#36A269',
};

export const BarWithLineLogariphmic = ({
    props,
}: {
    props: IBarChart;
}) => {
    const [months, setMonths] = useState<string[]>([]);
    const [amountData, setAmountData] = useState<PosAmountData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            try {
                const obj = await getChartResults(456);

                const data =
                    obj.result.at(0)?.data as PosAmountData[];

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

                const filteredData = data.filter((row) => {
                    const reportMonth = Number(row.report_month);

                    return reportMonth >= startDate && reportMonth < endDate;
                });

                setAmountData(filteredData);

                setMonths(
                    filteredData.map((row) =>
                        formatMonth(Number(row.report_month))
                    )
                );
            } catch (error) {
                console.error(
                    'Failed to load POS chart data:',
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

            backgroundColor: '#24211B',
            borderColor: '#6B5B3D',
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
                                        margin-bottom: 4px;
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
            top: 0,
            left: 0,

            orient: 'horizontal',

            itemWidth: 8,
            itemHeight: 8,
            itemGap: 18,

            icon: 'roundRect',

            textStyle: {
                color: '#8D8778',
                fontSize: 9,
                fontWeight: 500,
            },

            data: PAYMENT_SCHEMAS,
        },

        grid: {
            left: 50,
            right: 15,
            top: 45,
            bottom: 25,
        },

        xAxis: {
            type: 'category',

            data: months,

            axisLine: {
                show: false,
            },

            axisTick: {
                show: false,
            },

            axisLabel: {
                color: '#9CA3AF',
                fontSize: 9,
            },
        },

        yAxis: {
            type: 'value',

            min: 0,

            splitLine: {
                lineStyle: {
                    color: '#F5F5F5',
                },
            },

            axisLine: {
                show: false,
            },

            axisTick: {
                show: false,
            },

            axisLabel: {
                color: '#9CA3AF',
                fontSize: 9,

                formatter: (value: number) => {
                    if (value >= 1e12) {
                        return `${value / 1e12} трлн`;
                    }

                    if (value >= 1e9) {
                        return `${value / 1e9} млрд`;
                    }

                    if (value >= 1e6) {
                        return `${value / 1e6} млн`;
                    }

                    if (value >= 1e3) {
                        return `${value / 1e3} тыс.`;
                    }

                    return value.toString();
                },
            },
        },

        series: PAYMENT_SCHEMAS.map((schema, index) => ({
            name: schema,

            type: 'bar',

            stack: 'total',

            barWidth: 24,

            data: amountData.map(
                (row) =>
                    Number(
                        row[
                        schema as keyof PosAmountData
                        ] ?? 0
                    )
            ),

            itemStyle: {
                color: PAYMENT_COLORS[schema],
                opacity: 1,

                // Rounded top only for the last visible stack
                borderRadius:
                    index === PAYMENT_SCHEMAS.length - 1
                        ? [4, 4, 0, 0]
                        : 0,
            },

            emphasis: {
                focus: 'series',
                itemStyle: {
                    opacity: 1,
                },
            },
        })),
    };

    return (
        <div className="d-card cc">
            <div className="hdr">
                {props.title && props.description && (
                    <ChartCardHeader
                        props={{
                            title: props.title,
                            description: props.description,
                            top_left: props.top_left,
                            top_right: props.top_right,
                        }}
                    />
                )}
            </div>

            <div className="ch">
                {isLoading ? (
                    <SupersetLoader />
                ) : (
                    <ReactECharts
                        option={option}
                    />
                )}
            </div>
        </div>
    );
};
