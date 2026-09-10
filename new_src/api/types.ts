export type ChartResponse<T> = {
    result: Array<{
        data: T[];
        rowcount: number;
    }>;
};

export type BigNumberTrendlineRow = {
    report_month: number;
    count: number;
    count__countribution?: number;
};

export type PieChartType = {
    payment_method: string;
    count: number;
    count__countribution: number;
};

export type IncomeRow = {
    report_month: string;
    fact_income: number;
    fact_expenses: number;
};

export type ProfitRow = {
    report_month: string;
    fact_profit: number;
    plan_profit: number;
};

export type CountryMapChartType = {
    region_iso: string;
    volume_per_capita_uzs: number;
};

export type IssuedCardData = {
    report_month: string;
    issued_cards: number;
}

export type ActiveCardData = {
    report_month: string;
    active_cards: number;
}

export type IssuedMonthlyCardData = {
    ISSUE_DATE: string;
    number_of_cards: number;
}

export type PosAmountData = {
    report_month: string;
    volume_transacted: number;
}

export type PosCountData = {
    report_month: string;
    pos_count: number;
}

export type TrendData = {
    report_month: number;
    activated_count: number;
    issued_count: number;
}

export type BigNumberTrendsObject = {
    connected: BigNumberTrendlineRow[];
    active: BigNumberTrendlineRow[];
    newPerMonth: BigNumberTrendlineRow[];
    inactive: BigNumberTrendlineRow[];
}

export type TokenizedTransaction = {
    TXN_DATE: number;
    HumoPay: number;
}

export type BigNumberType = {
    report_month: number;
    value: number;
}

export type NewBigNumberType = {
    trend: number;
    value: number;
}

export type PaymentSystemDataType = {
    report_month: number;
    HUMO: number;
    Uzcard: number;
    Visa: number;
    MasterCard: number;
    UnionPay: number;
    Other: number;
}