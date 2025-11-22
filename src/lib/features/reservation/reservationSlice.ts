import { IReservation } from "@/src/types/modelTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reservationApi = createApi({
    reducerPath: "reservationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/reservation/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Reservation'],
    endpoints: (builder) => ({
        // get requests
        getAllReservation: builder.query<IReservation[], void>({
            query: () => "get/getall",
            providesTags: ['Reservation'],
        }),
        getAllSoftDeletedReservation: builder.query<IReservation[], void>({
            query: () => "get/getallsoftdeleted",
            providesTags: ['Reservation'],
        }),
        getByIdReservation: builder.query<IReservation, void>({
            query: (id) => `get/getbyid/${id}`,
            providesTags: ['Reservation'],
        }),
        // post requests
        postReservation: builder.mutation({
            query: (newReservation) => ({
                url: 'post',
                method: 'POST',
                body: newReservation,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        confirmReservation: builder.mutation({
            query: ({ id, confirmBody }) => ({
                url: `post/confirm/${id}`,
                method: 'POST',
                body: confirmBody,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        // delete requests
        deleteReservation: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reservation'],
        }),
        softDeleteReservation: builder.mutation({
            query: (id) => ({
                url: `softdelete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reservation'],
        }),
    }),
});

export const {

} = reservationApi;