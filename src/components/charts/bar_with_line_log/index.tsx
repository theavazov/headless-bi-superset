import type { IBarChart } from '../../../types/charts';
import ReactECharts from 'echarts-for-react';
import { ChartCardHeader } from '../../_card/header';

const option = {
    backgroundColor: 'transparent',

    textStyle: {
        fontFamily: 'Montserrat, sans-serif',
    },

    tooltip: {
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
            fontWeight: 600
        },

        extraCssText: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);`,
    },

    // -------------------------
    // LEGEND
    // -------------------------
    legend: {
        bottom: 0,
        left: 0,

        orient: 'horizontal',

        itemWidth: 8,
        itemHeight: 8,
        itemGap: 12,

        icon: 'roundRect',

        textStyle: {
            color: '#8D8778',
            fontSize: 9,
            fontWeight: 500,
        },

        data: [
            'Объём транзакций',
            'Кол-во POS',
        ],
    },

    grid: {
        left: 65,
        right: 12,
        top: 15,
        bottom: 60,
    },

    // -------------------------
    // X AXIS
    // -------------------------
    xAxis: {
        type: 'category',

        data: [
            'Янв 25',
            'Фев 25',
            'Мар 25',
            'Апр 25',
            'Май 25',
            'Июн 25',
            'Июл 25',
            'Авг 25',
            'Сен 25',
            'Окт 25',
            'Ноя 25',
            'Дек 25',
            'Янв 26',
            'Фев 26',
            'Мар 26',
            'Апр 26',
            'Май 26',
            'Июн 26',
            'Июл 26',
        ],

        axisLine: {
            show: false,
        },

        axisTick: {
            show: false,
        },

        axisLabel: {
            color: '#716B5E',
            fontSize: 9,

            // Show only every 3rd label
            interval: 2,
        },

        name: 'Дата',

        nameLocation: 'middle',
        nameGap: 28,

        nameTextStyle: {
            color: '#716B5E',
            fontSize: 9,
        },
    },

    // -------------------------
    // Y AXIS — LOGARITHMIC
    // -------------------------
    yAxis: {
        type: 'log',

        logBase: 10,

        min: 1e4,
        max: 1e14,

        name: 'Объём транзакций (сум), Кол-во POS',

        nameLocation: 'middle',
        nameGap: 48,

        nameTextStyle: {
            color: '#716B5E',
            fontSize: 9,
        },

        axisLine: {
            show: false,
        },

        axisTick: {
            show: false,
        },

        axisLabel: {
            color: '#716B5E',
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

        splitLine: {
            show: true,

            lineStyle: {
                color: '#27251F',
                width: 1,
            },
        },
    },

    // -------------------------
    // SERIES
    // -------------------------
    series: [
        // POS BARS
        {
            name: 'Кол-во POS',

            type: 'bar',

            data: [
                15000,
                15500,
                16000,
                17000,
                18000,
                18500,
                19000,
                19500,
                20000,
                21000,
                22000,
                22500,
                23000,
                23500,
                24000,
                24500,
                25000,
                25500,
                26000,
            ],

            barWidth: 12,

            itemStyle: {
                color: '#4A463C',

                borderRadius: [
                    4,
                    4,
                    4,
                    4,
                ],
            },

            // Keep bars visually subtle
            z: 1,
        },

        // TRANSACTION VOLUME LINE
        {
            name: 'Объём транзакций',

            type: 'line',

            data: [
                2.1e12,
                2.15e12,
                2.2e12,
                2.25e12,
                2.3e12,
                2.35e12,
                2.4e12,
                2.45e12,
                2.55e12,
                2.45e12,
                2.6e12,
                2.65e12,
                2.7e12,
                2.75e12,
                2.8e12,
                2.85e12,
                2.9e12,
                2.95e12,
                3.0e12,
            ],

            smooth: true,

            showSymbol: false,

            lineStyle: {
                color: '#D9A13D',
                width: 2,
            },

            itemStyle: {
                color: '#D9A13D',
            },

            z: 2,
        },
    ],
};

export const BarWithLineLogariphmic = ({ props }: { props: IBarChart }) => {
    return (
        <div className="d-card cc">
            <div className="hdr">
                {props.title && props.description && <ChartCardHeader props={{ title: props.title, description: props.description }} />}
            </div>
            <div className="ch">
                <ReactECharts option={option} />
            </div>
        </div>
    );
};