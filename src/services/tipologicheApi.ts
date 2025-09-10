import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "../features/auth/authSlice";
import type { RootState } from "../store/store";

export interface Fondo {
    id: number;
    nome: string;
    descrizione: string;
    tipoAttivo: string;
    rendimento1anno: number;
    investimentoMinimo: number;
    sfdrLevel: number;
    performance: number[];
}

export interface Polizza {
    id: number;
    nome: string;
    tipo: string;
    costoMensile: number;
}

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
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

export const tipologicheApi = createApi({
    reducerPath: "tipologicheApi",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getFondi: builder.query<Fondo[], void>({
            query: () => "/tipologiche/fondi",
        }),
        getPolizze: builder.query<Polizza[], void>({
            query: () => "/tipologiche/polizze",
        }),
    }),
});

export const {
    useGetFondiQuery,
    useGetPolizzeQuery,
} = tipologicheApi;
