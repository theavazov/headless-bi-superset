import type { ICountryMapChart } from '../../../types/charts';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { ChartCardHeader } from '../../_card/header';
import uzbekistan from '../../../assets/uz.svg?raw';

const svgWithIsoNames = uzbekistan.replace(
    /(<path\b[^>]*?)\sname="([^"]+)"([^>]*?)data-name="([^"]+)"([^>]*>)/g,
    '$1 name="$4"$3 data-name="$4"$5',
);

echarts.registerMap('uzbekistan', { svg: svgWithIsoNames });

const regionNames: Record<string, string> = {
    'UZ-TK': 'г. Ташкент',
    'UZ-TO': 'Ташкент',
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

const regionData = [
    { iso: 'UZ-TK', value: 395 },
    { iso: 'UZ-TO', value: 82 },
    { iso: 'UZ-JI', value: 44 },
    { iso: 'UZ-AN', value: 46 },
    { iso: 'UZ-NG', value: 45 },
    { iso: 'UZ-FA', value: 45 },
    { iso: 'UZ-SI', value: 45 },
    { iso: 'UZ-SA', value: 45 },
    { iso: 'UZ-QA', value: 45 },
    { iso: 'UZ-SU', value: 45 },
    { iso: 'UZ-BU', value: 45 },
    { iso: 'UZ-NW', value: 45 },
    { iso: 'UZ-XO', value: 45 },
    { iso: 'UZ-QR', value: 45 },
];

const mapData = regionData
    .map(({ iso, value }) => {
        const name = regionNames[iso];

        if (!name) {
            console.warn(`Unknown region: ${iso}`);
            return null;
        }

        return {
            name,
            value,
            iso,
        };
    })
    .filter(Boolean);

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

        formatter: (params: { name: string, value: string }) => {
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
                        ${params.value ?? 0}
                    </div>
                </div>
            `;
        },
    },

    visualMap: {
        show: false,

        min: 0,
        max: Math.max(...regionData.map(item => item.value)),

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

            data: mapData,

            itemStyle: {
                borderColor: '#171510',
                borderWidth: 1,
            },

            emphasis: {
                itemStyle: {
                    borderColor: '#E8E2D4',
                    borderWidth: 1.5,
                },
            },
        },
    ],
};

export const CountryMapChart = ({ props }: { props: ICountryMapChart }) => {
    const handleClick = () => {
        if (props.modal) {
            props.setModal?.(props.modal);
        }
    };

    return (
        <div className="d-card cc h-full">
            <div className="hdr">
                {props.title && props.description && <ChartCardHeader props={{ title: props.title, description: props.description }} />}
            </div>
            <button className="map" onClick={handleClick}>
                <ReactECharts option={option} style={{ width: 100 + "%" }} />
            </button>
        </div>
    );
};