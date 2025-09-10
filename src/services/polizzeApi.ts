import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "../features/auth/authSlice";
import type { RootState } from "../store/store";

export interface Polizza {
    _id: string;
    nome: string;
    tipo: string;
    costoMensile: number;
}

export interface PolizzeUtenteResponse {
    polizzeAttive: Polizza[];
    polizzeDisponibili: Polizza[];
}

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/polizze",
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

export const polizzeApi = createApi({
    reducerPath: "polizzeApi",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getPolizzeUtente: builder.query<PolizzeUtenteResponse, void>({
            query: () => "",
        }),
        aggiungiPolizza: builder.mutation<Polizza, { polizzaId: string }>({
            query: ({ polizzaId }) => ({
                url: "/aggiungi",
                method: "POST",
                body: { polizzaId },
            }),
        }),
    }),
});

export const {
    useGetPolizzeUtenteQuery,
    useAggiungiPolizzaMutation
} = polizzeApi;
