import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Movimento {
    id: number;
    data: string;
    descrizione: string;
    importo: number;
}

export const accountApi = createApi({
    reducerPath: "accountApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8090/api",
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getSaldo: builder.query<number, void>({
            query: () => "/saldo",
        }),
        getUltimiMovimenti: builder.query<Movimento[], number | void>({
            query: (limit = 10) => `/movimenti?limit=${limit}`,
        }),
    }),
});

export const { useGetSaldoQuery, useGetUltimiMovimentiQuery } = accountApi;
