import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from "../model/Auth.ts";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL_BE + "/auth",
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth?.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials,
            }),
        }),
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (user) => ({
                url: "/register",
                method: "POST",
                body: user,
            }),
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
