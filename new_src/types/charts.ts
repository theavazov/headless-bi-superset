export type ModalType =
    | 'pos'
    | 'atm'
    | 'cm_regions'
    | null;

interface IChartInterface {
    title?: string;
    top_left: string;
    top_right?: string;
}

export interface IBigNumber {
    unit: string;
    value: string;
    label: string;
    trend: number;
    description: string;
    isLoading: boolean;
}

export interface ILineChart extends IChartInterface {
    description?: string;
}

export interface IBarChart extends IChartInterface {
    description?: string;
}

export interface IPieChart extends IChartInterface {
    description?: string;
}

export interface ICountryMapChart extends IChartInterface {
    description?: string;
}

export type TrendInfo = {
    value: number;
    percent: number;
}

export type ModalPropsType = {
    title: string;
    description: string;
    note: string;
    icon: React.JSX.Element;
}

export type BigNumberTrendLineReturn = {
    value: number;
    trend: number;
}