import type { IBarChart } from '../../../types/charts';
import ReactECharts from 'echarts-for-react';
import { ChartCardHeader } from '../../_card/header';
import { useEffect, useState } from 'react';
import { getChartResults } from '../../../api/superset';
import type { IncomeRow, ProfitRow } from '../../../api/types';
import { formatMonth } from '../../../utils/functions/formatMonth';
import { formatAmount } from '../../../utils/functions/formatNumber';
import SupersetLoader from '../../_loaders/superset';

type ChartTooltipParam = {
    axisValue: string | number;
    marker: string;
    seriesName: string;
    value: string | number | null;
};

export const BarWithAxis = ({ props }: { props: IBarChart }) => {
    const [months, setMonths] = useState<string[]>([])
    const [factIncomes, setFactIncomes] = useState<number[]>([])
    const [factExpenses, setFactExpenses] = useState<number[]>([])
    const [factProfits, setFactProfits] = useState<number[]>([])
    const [planExpenses, setPlanExpenses] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadPNL = async (): Promise<void> => {
            try {
                const obj = await getChartResults(409);

                const incomeData = obj.result.at(0)?.data as IncomeRow[];
                const profitData = obj.result.at(1)?.data as ProfitRow[];

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

                const filteredIncomeData = incomeData.filter((row) => {
                    const reportMonth = Number(row.report_month);

                    return reportMonth >= startDate && reportMonth < endDate;
                });

                const filteredProfitData = profitData.filter((row) => {
                    const reportMonth = Number(row.report_month);

                    return reportMonth >= startDate && reportMonth < endDate;
                });

                const months = filteredIncomeData.map((row) =>
                    formatMonth(Number(row.report_month))
                );

                const factIncome = filteredIncomeData.map(
                    (row) => row.fact_income
                );

                const factExpense = filteredIncomeData.map(
                    (row) => row.fact_expenses
                );

                const factProfit = filteredProfitData.map(
                    (row) => row.fact_profit
                );

                const planProfit = filteredProfitData.map(
                    (row) => row.plan_profit
                );

                setMonths(months);
                setFactIncomes(factIncome);
                setFactExpenses(factExpense);
                setFactProfits(factProfit);
                setPlanExpenses(planProfit);
            } catch (error) {
                console.error('Failed to load chart data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPNL();
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
                fontWeight: 600
            },

            extraCssText: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);`,

            formatter: (params: ChartTooltipParam[]) => {
                const title = params[0]?.axisValue;

                return `
                    <div>
                        <div style="margin-bottom: 8px; color: #E6DCC5;">
                            ${title}
                        </div>

                        ${params.map((item) => `
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
                                    ${formatAmount(Number(item.value))}
                                </span>
                            </div>
                        `).join('')}
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
            itemGap: 16,

            icon: 'roundRect',

            textStyle: {
                color: '#374151',
                fontWeight: 500,
                fontSize: 10,
            },

            data: ['Доходы', 'Расходы', 'Факт. прибыль', 'План. прибыль'],
        },

        grid: {
            left: 20,
            right: 10,
            top: 40,
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
                fontSize: 10,
                align: "center",
                padding: [0, 0, 0, 20],
            },
        },

        yAxis:
        {
            type: 'value',

            minInterval: 50_000_000_000,

            splitLine: {
                lineStyle: {
                    color: '#f5f5f5',
                },
            },

            axisLabel: {
                color: '#9CA3AF',
                fontSize: 10,
                formatter: (value: number) => formatAmount(value),
                interval: 10e1,
            },

            axisLine: {
                show: false,
            },
        },

        series: [
            {
                name: 'Доходы',
                type: 'bar',
                data: factIncomes,
                barWidth: 11,
                itemStyle: {
                    color: '#1a6fff',
                    borderRadius: [4, 4, 0, 0],
                },
            },

            {
                name: 'Расходы',
                type: 'bar',
                data: factExpenses,
                barWidth: 11,
                itemStyle: {
                    color: '#e32e2a',
                    borderRadius: [4, 4, 0, 0],
                },
            },

            {
                name: 'Факт. прибыль',
                type: 'line',
                data: factProfits,
                smooth: false,
                lineStyle: {
                    color: '#0e9b62',
                    width: 2,
                },
                symbol: 'circle',
                symbolSize: 5,
                itemStyle: {
                    color: '#0e9b62',
                },
            },

            {
                name: 'План. прибыль',
                type: 'line',
                data: planExpenses,
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                lineStyle: {
                    color: '#E89A00',
                    width: 2,
                },
                itemStyle: {
                    color: '#E89A00',
                },
            },
        ]
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
                {/* <div className="tog" id="fin-tog">
                    <button className="tbtn on" data-p="year">Текущий год</button>
                    <button className="tbtn" data-p="month">Прошлый месяц</button>
                </div> */}
            </div>
            <div className="ch">
                {isLoading ? <SupersetLoader /> : <ReactECharts option={option} />}
            </div>
        </div>
    );
};