import type { ICountryMapChart } from '../../../types/charts';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { ChartCardHeader } from '../../_card/header';
import uzbekistan from '../../../assets/uz.svg?raw';
import { useEffect, useState } from 'react';
import { getDatasetResults } from '../../../api/superset';
import type { CountryMapChartType } from '../../../api/types';
import SupersetLoader from '../../_loaders/superset';
import { formatAmount } from '../../../utils/functions/formatNumber';

echarts.registerMap('uzbekistan', { svg: uzbekistan });

const regionNames: Record<string, string> = {
    'UZ-TK': 'г. Ташкент',
    'UZ-TO': 'Ташкентская обл.',
    'UZ-JI': 'Джизак',
    'UZ-AN': 'Андижан',
    'UZ-NG': 'Наманган',
    'UZ-FA': 'Фергана',
    'UZ-SI': 'Сырдарья',
    'UZ-SA': 'Самарканд',
    'UZ-QA': 'Кашкадарья',
    'UZ-SU': 'Сурхандарья',
    'UZ-BU': 'Бухара',
    'UZ-NW': 'Навои',
    'UZ-XO': 'Хорезм',
    'UZ-QR': 'Республика Каракалпакстан'
};

export const CountryMapChart = ({ props }: { props: ICountryMapChart }) => {
    const [data, setData] = useState<
        {
            id: string;
            name: string;
            value: number;
        }[]
    >([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            try {
                const chartData = await getDatasetResults<CountryMapChartType>(
                    91,
                    [
                        'region_iso',
                        'volume_per_capita_uzs',
                    ],
                );

                const innerData = chartData
                    .map((row) => {
                        const regionName = regionNames[row.region_iso];

                        if (!regionName) {
                            console.warn(
                                `Unknown region ISO: ${row.region_iso}`
                            );
                            return null;
                        }

                        return {
                            id: row.region_iso,
                            name: regionName,
                            value: Number(row.volume_per_capita_uzs),
                        };
                    })
                    .filter(
                        (
                            item
                        ): item is {
                            id: string;
                            name: string;
                            value: number;
                        } => item !== null
                    );

                setData(innerData);
            } catch (error) {
                console.error('Failed to load chart data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const maxValue = Math.max(
        ...data.map((item) => item.value),
        0
    );

    const option = {
        backgroundColor: 'transparent',

        tooltip: {
            trigger: 'item',

            backgroundColor: '#24211B',
            borderColor: '#6B5B3D',
            borderWidth: 1,
            borderRadius: 8,

            textStyle: {
                color: '#E8E2D4',
                fontFamily: 'Montserrat',
                fontSize: 11,
            },

            formatter: (params: {
                name: string;
                value: number | string;
                data?: {
                    id?: string;
                };
            }) => {
                const value = Number(params.value);

                return `
                    <div style="font-family: Montserrat">
                        <div style="
                            color: #E8E2D4;
                            font-weight: 600;
                            margin-bottom: 4px;
                        ">
                            ${params.name}
                        </div>

                        <div style="color: #A9A18D">
                            ${Number.isFinite(value) ? `объём транзакций: ${formatAmount(value)} UZS / чел` : 'Нет данных'}
                        </div>
                    </div>
                `;
            },
        },

        visualMap: {
            show: false,

            min: 0,
            max: maxValue,

            inRange: {
                color: [
                    '#29261F',
                    '#4A3A21',
                    '#785B28',
                    '#B28B3D',
                    '#DFAF42',
                ],
            },
        },

        series: [
            {
                type: 'map',
                map: 'uzbekistan',

                data,

                // No names on the map
                label: {
                    show: false,
                },

                itemStyle: {
                    borderColor: '#171510',
                    borderWidth: 1,
                },

                emphasis: {
                    label: {
                        show: false,
                    },

                    itemStyle: {
                        borderColor: '#E8E2D4',
                        borderWidth: 1.5,

                        shadowBlur: 12,
                        shadowColor: 'rgba(223, 175, 66, 0.55)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 2,
                    },
                },
            },
        ],
    };

    return (
        <div className="d-card cc h-full">
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

            <div className="map">
                {isLoading ? (
                    <SupersetLoader />
                ) : (
                    <ReactECharts
                        option={option}
                        style={{
                            width: '100%',
                            height: '350px',
                        }}
                    />
                )}
            </div>
        </div>
    );
};