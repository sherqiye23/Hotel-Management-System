import { IUser } from "@/src/types/modelTypes";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/src/types/rtkSlicesTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/user/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        // get requests
        getAllUsers: builder.query<IUser[], void>({
            query: () => "get/getall",
            providesTags: ['User'],
        }),
        // post requests
        loginUser: builder.mutation<LoginResponse, LoginRequest>({
            query: (newUser) => ({
                url: 'post/login',
                method: 'POST',
                body: newUser,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        registerUser: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (newUser) => ({
                url: 'post/register',
                method: 'POST',
                body: newUser,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: 'post/logout',
                method: 'POST',
            }),
        }),
        forgotPasswordSendOtp: builder.mutation({
            query: (email) => ({
                url: 'post/forgot-password-send-otp',
                method: 'POST',
                body: email,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        forgotPasswordVerifyOtp: builder.mutation({
            query: (verifyBody) => ({
                url: 'post/forgot-password-verify-otp',
                method: 'POST',
                body: verifyBody,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        resetPassword: builder.mutation({
            query: (resetBody) => ({
                url: 'post/reset-password',
                method: 'POST',
                body: resetBody,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        // put requests
        updateUser: builder.mutation({
            query: (updateUser) => ({
                url: 'patch',
                method: 'PATCH',
                body: updateUser,
            }),
            invalidatesTags: ['User'],
        }),
        // updatePasswordUser: builder.mutation({
        //     query: ({ userId, oldPassword, newPassword, confirmPassword }) => ({
        //         url: `put/updatepassword?userId=${userId}&oldPassword=${oldPassword}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`,
        //         method: 'PUT'
        //     }),
        // }),
        updateRole: builder.mutation({
            query: (id) => ({
                url: `patch/role/${id}`,
                method: 'PATCH'
            }),
        }),
        // delete requests
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetAllUsersQuery, useLoginUserMutation, useRegisterUserMutation, useLogoutUserMutation, useForgotPasswordSendOtpMutation, useForgotPasswordVerifyOtpMutation, useResetPasswordMutation, useUpdateRoleMutation, useUpdateUserMutation, useDeleteUserMutation
} = usersApi;