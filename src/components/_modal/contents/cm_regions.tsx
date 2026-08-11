import styles from "../modal.module.css"
import ReactECharts from 'echarts-for-react';

interface componentProps {
    title: string;
    description: string;
    note: string;
    icon: React.JSX.Element
}

const regions = [
    { iso: 'UZ-TK', name: 'г. Ташкент', value: 395 },
    { iso: 'UZ-TO', name: 'Ташкент', value: 82 },
    { iso: 'UZ-JI', name: 'Джизак', value: 44 },
    { iso: 'UZ-AN', name: 'Андижан', value: 46 },
    { iso: 'UZ-NG', name: 'Наманган', value: 45 },
    { iso: 'UZ-FA', name: 'Фергана', value: 45 },
    { iso: 'UZ-SI', name: 'Сырдарья', value: 45 },
    { iso: 'UZ-SA', name: 'Самарканд', value: 45 },
    { iso: 'UZ-QA', name: 'Кашкадарья', value: 45 },
    { iso: 'UZ-SU', name: 'Сурхандарья', value: 45 },
    { iso: 'UZ-BU', name: 'Бухара', value: 45 },
    { iso: 'UZ-NW', name: 'Навои', value: 45 },
    { iso: 'UZ-XO', name: 'Хорезм', value: 45 },
    { iso: 'UZ-QR', name: 'Каракалпакстан', value: 45 },
];

const sortedRegions = [...regions].sort((a, b) => b.value - a.value);

const values = sortedRegions.map(r => r.value);

const option = {
    visualMap: {
        min: Math.min(...values),
        max: Math.max(...values),
        show: false,
        inRange: {
            color: ['#cf9d3f'],
        },
    },

    grid: {
        top: 0,
        right: 20,
        bottom: 10,
        left: 10,
        containLabel: true,
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
            fontWeight: 600,
        },

        extraCssText: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);`,
    },

    xAxis: {
        type: 'value',
        min: 0,
        splitLine: {
            show: true,
            lineStyle: {
                color: '#2b2822',
            },
        },
    },

    yAxis: {
        type: 'category',
        data: sortedRegions.map(r => r.name),
    },

    series: [
        {
            type: 'bar',
            data: sortedRegions.map(r => ({
                name: r.name,
                iso: r.iso,
                value: r.value,
            })),
            barWidth: 12,
            barCategoryGap: '40%',
            borderRadius: 10,
            itemStyle: {
                borderRadius: [1, 4, 4, 1],
            },
        },
    ],
};

export function BN_CMRegion_Modal(props: componentProps) {
    return (
        <div>
            <div className={styles.modal_header}>
                <span className={styles.modal_header_icon}>{props.icon}</span>
                <div className={styles.modal_header_titles}>
                    <h3 className={styles.modal_header__title}>{props.title}</h3>
                    <span className={styles.modal_header__description}>{props.description}</span>
                </div>
            </div>
            <div className={styles.kpis_grid}>
                <KPICard a="В среднем по стране" b="0.28 млн/чел." c="+5.1% г/г" />
                <KPICard a="Ташкент" b="1.13 млн/чел." c="89.2% парка" />
                <KPICard a="Медиана регионов" b="0.19 млн/чел." c="+8% к пред." />
                <KPICard a="Ниже всех" b="Сурхандарья" c="-0.6 п.п. к пред." />
            </div>
            <div className={styles.chart}>
                <ReactECharts option={option} />
            </div>
            <p className={styles.bottom_text}>{props.note}</p>
        </div>
    );
}

const KPICard = ({ a, b, c }: { a: string, b: string, c: string }) => {
    return (
        <div className={styles.mk}>
            <div className={styles.a}>{a}</div>
            <div className={styles.b}>{b}</div>
            <div className={styles.c}>{c}</div>
        </div>
    )
}