import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "../features/auth/authSlice";
import type { RootState } from "../store/store";

export interface Movimento {
    _id: string;
    data: string;
    descrizione: string;
    importo: number;
}

export interface PaginatedMovimentiResponse {
    contenuto: Movimento[];
    pagina: number;
    totalePagine: number;
    totaleElementi: number;
}

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        api.dispatch(logout());
        window.location.href = "/login";
    }

    return result;
};

export const accountApi = createApi({
    reducerPath: "accountApi",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getSaldo: builder.query<{ saldo: number }, void>({
            query: () => "/saldo",
        }),
        getMovimentiPaginati: builder.query<PaginatedMovimentiResponse, { page?: number; pageSize?: number }>({
            query: ({ page = 1, pageSize = 10 }) => `/movimenti?page=${page}&pageSize=${pageSize}`,
        }),
        createBonifico: builder.mutation<void, { beneficiario: string; iban: string; importo: number; causale: string }>({
            query: (body) => ({
                url: "/bonifico",
                method: "POST",
                body,
            }),
        }),
        downloadMovimentiPdf: builder.mutation<Blob, void>({
            query: () => ({
                url: "/movimenti/pdf",
                method: "GET",
                responseHandler: (response) => response.blob(),
            }),
        }),
    }),
});

export const {
    useGetSaldoQuery,
    useGetMovimentiPaginatiQuery,
    useCreateBonificoMutation,
    useDownloadMovimentiPdfMutation,
} = accountApi;