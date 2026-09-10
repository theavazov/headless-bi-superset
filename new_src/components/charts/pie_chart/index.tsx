import type { IPieChart } from '../../../types/charts';
import ReactECharts from 'echarts-for-react';
import { ChartCardHeader } from '../../_card/header';
import { useEffect, useState } from 'react';
import { getChartResults } from '../../../api/superset';
import type { PieChartType } from '../../../api/types';
import { formatAmount } from '../../../utils/functions/formatNumber';
import SupersetLoader from '../../_loaders/superset';

export const PieChart = ({ props }: { props: IPieChart }) => {
    const [data, setData] = useState<{ value: number, name: string }[]>([])
    const [allTranCount, setAllTranCount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            try {
                const obj = await getChartResults(329);

                const chartData = obj.result.at(0)?.data as PieChartType[];

                const innerData = chartData.map((row) => ({
                    value: row.count,
                    name: row.payment_method
                }));

                const totalCount = chartData.reduce((sum, row) => sum + Number(row.count), 0);

                setAllTranCount(totalCount);

                setData(innerData)
            } catch (error) {
                console.error('Failed to load chart data:', error);
            } finally {
                setIsLoading(false)
            }
        };

        loadData();
    }, []);

    const formatPercent = (value: number) => {
        return value
            .toFixed(2)
            .replace(/\.?0+$/, '');
    };

    const option = {
        backgroundColor: '#fff',

        color: [
            '#246BEB', // P2P
            '#8B96A8', // ePOS
            '#10A66A', // POS
            '#7446E8', // QR
            '#E53935', // ATM
            '#E89A00', // HumoPay
            '#f5ef42', // HumoPay
        ],

        tooltip: {
            show: false,
            trigger: 'item',
            borderWidth: 1,
            borderRadius: 10,
            padding: [10, 14],

            textStyle: {
                color: '#E6DCC5',
                fontSize: 10,
                fontWeight: 600,
            },

            formatter: (params: {
                name: string;
                value: number;
                percent: number;
                marker: string;
            }) => {
                return `
                    <div>
                        <div style="
                            margin-bottom: 6px;
                            color: #E6DCC5;
                        ">
                            ${params.marker} ${params.name}
                        </div>

                        <div style="
                            display: flex;
                            justify-content: space-between;
                            gap: 20px;
                        ">
                            <span>Количество</span>
                            <span>${formatAmount(params.value)}</span>
                        </div>

                        <div style="
                            display: flex;
                            justify-content: space-between;
                            gap: 20px;
                        ">
                            <span>Доля</span>
                            <span>${formatPercent(params.percent)}%</span>
                        </div>
                    </div>
                `;
            },

            extraCssText:
                'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);',
        },

        legend: {
            show: false,
            orient: 'vertical',
            right: '10%',
            top: 'middle',

            itemWidth: 8,
            itemHeight: 8,
            itemGap: 30,

            textStyle: {
                color: '#374151',
                fontSize: 11,
            },

            formatter: (name: string) => {
                const item = data.find((item) => item.name === name);

                if (!item || !allTranCount) {
                    return name;
                }

                const percentage = (item.value / allTranCount) * 100;

                return `${name} ${formatPercent(percentage)}%`;
            },
        },

        series: [
            {
                name: 'Transactions',
                type: 'pie',

                // donut position
                center: ['10', '10%'],

                // thickness/size matching screenshot
                radius: ['10%', '10%'],

                data,

                label: {
                    show: false,
                },

                labelLine: {
                    show: false,
                },

                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 3,
                },

                emphasis: {
                    scale: true,
                    scaleSize: 4,
                },
            },
        ],

        graphic: [
            {
                type: 'group',
                left: '30%',
                top: '50%',
                bounding: 'raw',

                children: [
                    {
                        type: 'text',
                        left: 'center',
                        top: -22,

                        style: {
                            text: formatAmount(allTranCount),
                            fill: '#273142',
                            fontSize: 18,
                            fontWeight: 700,
                            textAlign: 'center',
                        },
                    },

                    {
                        type: 'text',
                        left: 'center',
                        top: 5,

                        style: {
                            text: 'ОПЕРАЦИЙ ЗА ГОД',
                            fill: '#9AA1AC',
                            fontSize: 10,
                            fontWeight: 500,
                            textAlign: 'center',
                        },
                    },
                ],
            },
            {
                type: 'group',
                right: '6%',
                top: '50%',
                bounding: 'raw',
                children: data.map((item, index) => {
                    const percentage = (item.value / allTranCount) * 100;
                    return {
                        type: 'group',
                        top: index * 20,
                        children: [
                            // colored dot
                            {
                                type: 'circle',

                                shape: {
                                    cx: 4,
                                    cy: 4,
                                    r: 4,
                                },

                                style: {
                                    fill: [
                                        '#246BEB',
                                        '#8B96A8',
                                        '#10A66A',
                                        '#7446E8',
                                        '#E53935',
                                        '#E89A00',
                                    ][index],
                                },
                            },

                            // name
                            {
                                type: 'text',

                                left: 14,
                                top: -2,

                                style: {
                                    text: item.name,

                                    fill: '#374151',
                                    fontSize: 10,
                                    fontWeight: 400,
                                },
                            },

                            // percentage
                            {
                                type: 'text',

                                left: 150,
                                top: -2,

                                style: {
                                    text: `${formatPercent(percentage)}%`,

                                    fill: '#111827',
                                    fontSize: 10,
                                    fontFamily: 'Montserrat, sans-serif',
                                    fontWeight: 400,

                                    textAlign: 'right',
                                },
                            }
                        ]
                    }
                }),
            }
        ],

        media: [
            {
                query: {
                    maxWidth: 600,
                },

                option: {
                    legend: {
                        right: '3%',

                        textStyle: {
                            fontSize: 9,
                        },

                        itemWidth: 7,
                        itemHeight: 7,
                        itemGap: 8,
                    },

                    series: [
                        {
                            center: ['45%', '50%'],
                            radius: ['55%', '80%'],
                        },
                    ],

                    graphic: [
                        {
                            type: 'group',
                            left: '45%',
                            top: '52%',
                            bounding: 'raw',

                            children: [
                                {
                                    type: 'text',
                                    left: 'center',
                                    top: -18,

                                    style: {
                                        text: formatAmount(allTranCount),
                                        fill: '#273142',
                                        fontSize: 16,
                                        fontWeight: 700,
                                        textAlign: 'center',
                                    },
                                },

                                {
                                    type: 'text',
                                    left: 'center',
                                    top: 5,

                                    style: {
                                        text: 'ОПЕРАЦИЙ ЗА ГОД',
                                        fill: '#9AA1AC',
                                        fontSize: 8,
                                        fontWeight: 500,
                                        letterSpacing: '.6rem',
                                        textAlign: 'center',
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
        ],
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
                {isLoading ? <SupersetLoader /> : (
                    <div className="chart-wrapper__pie">
                        <ReactECharts option={option} style={{ width: '55%' }} />
                        <div className="custom-legend__pie">
                            {data.map((item, index) => {
                                const percentage = (item.value / allTranCount) * 100;

                                return (
                                    <div className="legend-row__pie" key={item.name}>
                                        <div className="legend-name__pie">
                                            <span
                                                className="legend-dot__pie"
                                                style={{
                                                    backgroundColor: [
                                                        '#246BEB',
                                                        '#8B96A8',
                                                        '#10A66A',
                                                        '#7446E8',
                                                        '#E53935',
                                                        '#E89A00',
                                                        '#f5ef42'
                                                    ][index],
                                                }}
                                            />

                                            <span>{item.name}</span>
                                        </div>

                                        <span className="legend-value__pie">
                                            {formatPercent(percentage)}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};