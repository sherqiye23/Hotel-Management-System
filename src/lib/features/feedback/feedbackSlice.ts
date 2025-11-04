import { IFeedback } from "@/src/types/modelTypes";
import { FeedbackPostRequestType, FeedbackPostResponseType } from "@/src/types/rtkSlicesTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const feedbacksApi = createApi({
    reducerPath: "feedbacksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/feedback/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Feedback'],
    endpoints: (builder) => ({
        // get requests
        getAllFeedbacks: builder.query<IFeedback[], void>({
            query: () => "get/getall",
            providesTags: ['Feedback'],
        }),
        getAllSoftDeletedFeedbacks: builder.query<IFeedback[], void>({
            query: () => "get/getallsoftdeleted",
            providesTags: ['Feedback'],
        }),
        getByIdFeedback: builder.query<IFeedback, void>({
            query: (id) => `get/getbyid/${id}`,
            providesTags: ['Feedback'],
        }),
        // post requests
        postFeedback: builder.mutation<FeedbackPostResponseType, FeedbackPostRequestType>({
            query: (newFeedback) => ({
                url: 'post',
                method: 'POST',
                body: newFeedback,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        // patch requests
        updateFeedback: builder.mutation({
            query: (updateFeedback) => ({
                url: 'patch',
                method: 'PATCH',
                body: updateFeedback,
            }),
            invalidatesTags: ['Feedback'],
        }),
        updateReadFeedback: builder.mutation({
            query: (id) => ({
                url: `patch/read/${id}`,
                method: 'PATCH'
            }),
        }),
        restoreAllFeedback: builder.mutation({
            query: () => ({
                url: `patch/restoreall/`,
                method: 'PATCH'
            }),
        }),
        restoreByIdFeedback: builder.mutation({
            query: (id) => ({
                url: `patch/restorebyid/${id}`,
                method: 'PATCH'
            }),
        }),
        // delete requests
        deleteFeedback: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Feedback'],
        }),
        softDeleteFeedback: builder.mutation({
            query: (id) => ({
                url: `softdelete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Feedback'],
        }),
    }),
});

export const {
    useGetAllFeedbacksQuery, useGetAllSoftDeletedFeedbacksQuery, useGetByIdFeedbackQuery, usePostFeedbackMutation, useUpdateFeedbackMutation, useUpdateReadFeedbackMutation, useRestoreAllFeedbackMutation, useRestoreByIdFeedbackMutation, useDeleteFeedbackMutation, useSoftDeleteFeedbackMutation
} = feedbacksApi;