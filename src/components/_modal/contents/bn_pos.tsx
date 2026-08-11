import styles from "../modal.module.css"
import ReactECharts from 'echarts-for-react';

interface componentProps {
    title: string;
    description: string;
    note: string;
    icon: React.JSX.Element
}

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

        // formatter: (params: any[]) => {
        //     const item = params.find(
        //         (p) => p.seriesName === 'Расходы'
        //     );

        //     return `
        //         <div class="chart-tooltip">
        //             <div class="chart-tooltip__title">
        //             ${item.axisValue}
        //             </div>

        //             <div class="chart-tooltip__value">
        //             Расходы: ${item.value}
        //             </div>
        //         </div>
        //     `;
        // },
    },

    // Bottom legend
    legend: {
        bottom: 0,
        orient: 'horizontal',

        itemWidth: 8,
        itemHeight: 8,
        itemGap: 16,

        icon: 'roundRect',

        textStyle: {
            color: '#AA9E87',
            fontWeight: 600,
            fontSize: 10,
        },

        data: ['Доходы', 'Расходы', 'Прибыль'],
    },

    grid: {
        left: 30,
        right: 15,
        top: 15,
        bottom: 45,
    },

    xAxis: {
        type: 'category',

        data: [
            'Авг',
            'Сен',
            'Окт',
            'Ноя',
            'Дек',
            'Янв',
            'Фев',
            'Мар',
            'Апр',
            'Май',
            'Июн',
            'Июл',
        ],

        axisLine: {
            show: false,
        },

        axisTick: {
            show: false,
        },

        axisLabel: {
            color: '#716B5E',
            fontSize: 10,
        },
    },

    yAxis: {
        type: 'value',

        splitLine: {
            lineStyle: {
                color: '#2B2822',
            },
        },

        axisLabel: {
            color: '#716B5E',
            fontSize: 10,
        },

        axisLine: {
            show: false,
        },
    },

    series: [
        {
            name: 'Доходы',
            type: 'bar',

            data: [
                240, 245, 252, 260,
                280, 245, 252, 260,
                275, 290, 300, 315,
            ],

            barWidth: 11,

            itemStyle: {
                color: '#D9A13D',
                borderRadius: [4, 4, 0, 0],
            },
        },

        {
            name: 'Расходы',
            type: 'bar',

            data: [
                150, 153, 158, 165,
                175, 160, 162, 165,
                170, 175, 180, 185,
            ],

            barWidth: 11,

            itemStyle: {
                color: '#4B463B',
                borderRadius: [4, 4, 0, 0],
            },
        },

        {
            name: 'Прибыль',
            type: 'line',

            data: [
                85, 88, 92, 100,
                85, 88, 92, 100,
                110, 115, 120, 125,
            ],

            smooth: true,

            lineStyle: {
                color: '#E6DCC5',
                width: 2,
            },
        },
    ],
};

export function BN_POS_Modal(props: componentProps) {
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
                <KPICard a="Подключено" b="42 764" c="+5.1% г/г" />
                <KPICard a="Активных" b="38 141" c="89.2% парка" />
                <KPICard a="Новых за месяц" b="2 310" c="+8% к пред." />
                <KPICard a="Без операций 90 дней" b="4 623" c="-0.6 п.п. к пред." />
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