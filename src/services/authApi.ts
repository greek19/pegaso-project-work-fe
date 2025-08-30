import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

interface RegisterRequest {
    username: string;
    password: string;
}

interface RegisterResponse {
    message: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/auth",
        credentials: "include",
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
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
