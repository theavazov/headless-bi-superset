import type { ILineChart } from '../../../types/charts';
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { ChartCardHeader } from '../../_card/header';

const option: EChartsOption = {
    textStyle: {
        fontFamily: 'Montserrat, sans-serif',
    },

    backgroundColor: "transparent",

    tooltip: {
        trigger: "axis",
        backgroundColor: "#1f2937",
        textStyle: {
            color: "#fff",
        },
    },

    grid: {
        left: 40,
        right: 10,
        top: 30,
        bottom: 30,
    },

    xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisLabel: {
            color: "#7E7460",
        },
    },

    yAxis: {
        type: "value",
        axisLine: {
            show: false,
        },
        splitLine: {
            lineStyle: {
                color: "#2B2822",
            },
        },
        axisLabel: {
            color: "#7E7460",
        },
    },

    series: [
        {
            name: "Name",
            type: "line",
            smooth: true,

            data: [120, 200, 150, 80, 70, 110, 130],

            // line color
            lineStyle: {
                color: "#D9A441",
                width: 3,
            },

            // point color
            itemStyle: {
                color: "#D9A441",
            },

            // area below the line
            areaStyle: {
                color: "rgba(217, 164, 65, 0.15)",
            },

            // hide points until hover
            showSymbol: false,

            emphasis: {
                focus: "series",
            },
        },
    ],
};

export const LineChart = ({ props }: { props: ILineChart }) => {
    return (
        <div className="d-card cc">
            <div className="hdr">
                {props.title && props.description && <ChartCardHeader props={{ title: props.title, description: props.description }} />}
                {/* <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <div className="tog" id="txn-tog">
                        <button className="tbtn on" data-m="vol">Объём</button>
                        <button className="tbtn" data-m="cnt">Кол-во</button>
                    </div>
                    <div className="tog" id="txn-per">
                        <button className="tbtn on" data-p="m12">12М</button>
                        <button className="tbtn" data-p="d30">30 дней</button>
                    </div>
                </div> */}
            </div>
            <div className="ch">
                <ReactECharts
                    option={option}
                    style={{ height: 250, width: "100%" }}
                />
            </div>
        </div>
    );
};