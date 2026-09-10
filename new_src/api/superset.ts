import { supersetClient } from "./client";
import type { ChartResponse } from "./types";
export interface ChartResult { [key: string]: unknown }

export interface ChartResultsResponse {
    result: Array<{
        data?: ChartResult[];
        colnames?: string[];
        coltypes?: unknown[];
        query?: string;
        [key: string]: unknown;
    }>;
    [key: string]: unknown;
}

export interface ChartDataRequest {
    datasource: {
        id: number;
        type: string;
    };
    queries: unknown[];
    result_format?: "json" | "csv";
    result_type?: "full" | "results";
}

export const getChartData = async (
    queryContext: ChartDataRequest,
) => {
    const response = await supersetClient.post(
        "/api/v1/chart/data",
        queryContext,
    );

    return response.data;
};

export const getChartResults = async <T>(chartId: number): Promise<ChartResponse<T>> => {
    const accessToken = localStorage.getItem("superset_access_token");

    if (!accessToken) {
        throw new Error("Superset access token not found");
    }

    // Get the chart definition/query context
    const chartResponse = await supersetClient.get(
        `/api/v1/chart/${chartId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    const chart = chartResponse.data?.result;

    if (!chart) {
        throw new Error(`Chart ${chartId} not found`);
    }

    const queryContext =
        typeof chart.query_context === "string"
            ? JSON.parse(chart.query_context)
            : chart.query_context;

    if (!queryContext) {
        throw new Error(`Chart ${chartId} has no query context`);
    }

    const dataResponse = await supersetClient.post(
        "/api/v1/chart/data",
        queryContext,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        },
    );

    return dataResponse.data;
};

export const getDatasetResults = async <T>(
    datasourceId: number,
    columns: string[],
): Promise<T[]> => {
    const accessToken = localStorage.getItem('superset_access_token');

    if (!accessToken) {
        throw new Error('Superset access token not found');
    }

    const queryContext = {
        datasource: {
            id: datasourceId,
            type: 'table',
        },

        queries: [
            {
                columns,
                metrics: [],
                filters: [],
                orderby: [],
                row_limit: 1000,
            },
        ],
    };

    try {
        const response = await supersetClient.post(
            '/api/v1/chart/data',
            queryContext,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        const result = response.data?.result?.[0]?.data;

        if (!result) {
            throw new Error(
                `No data returned from datasource ${datasourceId}`,
            );
        }

        return result as T[];
    } catch (error) {
        console.error(
            `Failed to load Superset datasource ${datasourceId}:`,
            error,
        );

        throw error;
    }
};