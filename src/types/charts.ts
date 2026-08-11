export type ModalType =
    | 'pos'
    | 'atm'
    | 'cm_regions'
    | null;

interface IChartModal {
    modal?: ModalType;
    setModal?: React.Dispatch<React.SetStateAction<ModalType>>;
}

interface IChartInterface extends IChartModal {
    title?: string;
}

export interface IBigNumber extends IChartModal {
    icon: React.JSX.Element;
    unit: string;
    value: string;
    label: string;
    description: string;

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