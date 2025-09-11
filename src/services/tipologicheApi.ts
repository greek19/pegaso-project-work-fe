import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "../features/auth/authSlice";
import type { RootState } from "../store/store";
import type {Fondo} from "../model/Fondo.ts";
import type {Polizza} from "../model/Polizza.ts";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL_BE,
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
