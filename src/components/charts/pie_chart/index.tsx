import type { IPieChart } from '../../../types/charts';
import ReactECharts from 'echarts-for-react';
import { ChartCardHeader } from '../../_card/header';

const data = [
    { value: 40, name: 'Chip / NFC' },
    { value: 23, name: 'HumoPay' },
    { value: 17, name: 'E-commerce' },
    { value: 12, name: 'P2P' },
    { value: 8, name: 'QR' },
];

const option = {
    backgroundColor: 'transparent',

    color: [
        '#DFAF42',
        '#E7C86D',
        '#B28B3D',
        '#6B6454',
        '#4A453A',
    ],

    legend: {
        orient: 'vertical',
        right: '7%',
        top: 'middle',

        itemWidth: 8,
        itemHeight: 8,
        itemGap: 9,

        textStyle: {
            color: '#A9A18D',
            fontSize: 12,
            fontFamily: 'Montserrat',
        },

        formatter: (name: string) => {
            const item = data.find((item) => item.name === name);

            return `${name} ${item?.value}%`;
        },

        rich: {
            name: {
                width: 72,
                color: '#E8E2D4',
                fontSize: 12,
            },

            value: {
                color: '#f1e7d0',
                fontSize: 12,
                fontWeight: 700,
                align: 'right',
            },
        },
    },

    series: [
        {
            name: 'Transactions',
            type: 'pie',

            // Move donut to the left
            center: ['32%', '50%'],

            // Donut thickness
            radius: ['58%', '76%'],

            // Data
            data,

            // Hide labels around donut
            label: {
                show: false,
            },

            labelLine: {
                show: false,
            },

            // Space between slices
            itemStyle: {
                borderColor: '#15130f',
                borderWidth: 4,
            },

            emphasis: {
                scale: true,
                scaleSize: 4,
            },
        },
    ],

    // Center text
    graphic: [
        {
            type: 'group',
            left: '32%',
            top: '50%',
            bounding: 'raw',

            children: [
                {
                    type: 'text',
                    left: 'center',
                    top: -14,

                    style: {
                        text: '18.4M',
                        fill: '#E8E2D4',
                        fontSize: 28,
                        fontWeight: 700,
                        fontFamily: 'Cormorant Garamond',
                        textAlign: 'center',
                    },
                },
                {
                    type: 'text',
                    left: 'center',
                    top: 20,

                    style: {
                        text: 'ТРАНЗАКЦИЙ',
                        fill: '#7C7567',
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: 'Montserrat',
                        letterSpacing: 10,
                        textAlign: 'center',
                    },
                },
            ],
        },
    ],
};

export const PieChart = ({ props }: { props: IPieChart }) => {
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