import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "../features/auth/authSlice"; // per svuotare redux e token
import type { RootState } from "../store/store";

export interface Movimento {
    id: number;
    data: string;
    descrizione: string;
    importo: number;
}

const rawBaseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await rawBaseQuery(args, api, extraOptions);

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
        getSaldo: builder.query<number, void>({
            query: () => "/saldo",
        }),
        getUltimiMovimenti: builder.query<Movimento[], number | void>({
            query: (limit = 10) => `/movimenti?limit=${limit}`,
        }),
        createBonifico: builder.mutation<void, { beneficiario: string; iban: string; importo: number; causale: string }>({
            query: (body) => ({
                url: "/bonifico",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useGetSaldoQuery, useGetUltimiMovimentiQuery, useCreateBonificoMutation } = accountApi;
