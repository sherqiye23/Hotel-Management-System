import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/payment/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Payment'],
    endpoints: (builder) => ({
        // post requests
        postPayment: builder.mutation({
            query: (id) => ({
                url: `${id}`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    usePostPaymentMutation
} = paymentApi;