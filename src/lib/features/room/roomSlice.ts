import { IRoom } from "@/src/types/modelTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roomsApi = createApi({
    reducerPath: "roomsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/room/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Room'],
    endpoints: (builder) => ({
        // get requests
        getAllRooms: builder.query<IRoom[], void>({
            query: () => "get/getall",
            providesTags: ['Room'],
        }),
        getAllSoftDeletedRooms: builder.query<IRoom[], void>({
            query: () => "get/getallsoftdeleted",
            providesTags: ['Room'],
        }),
        getByIdRoom: builder.query<IRoom, void>({
            query: (id) => `get/getbyid/${id}`,
            providesTags: ['Room'],
        }),
        // post requests
        postRoom: builder.mutation({
            query: (newRoom) => ({
                url: 'post',
                method: 'POST',
                body: newRoom,
                headers: { 'Content-Type': 'multipart/form-data' }
            }),
        }),
        // patch requests
        rateRoom: builder.mutation({
            query: ({ id, ratingBody }) => ({
                url: `patch/rate/${id}`,
                method: 'PATCH',
                body: ratingBody,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        // delete requests
        deleteRoom: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Room'],
        }),
        softDeleteRoom: builder.mutation({
            query: (id) => ({
                url: `softdelete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Room'],
        }),
    }),
});

export const {
    useGetAllRoomsQuery, useGetAllSoftDeletedRoomsQuery, useGetByIdRoomQuery, usePostRoomMutation, useRateRoomMutation, useDeleteRoomMutation, useSoftDeleteRoomMutation
} = roomsApi;