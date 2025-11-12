import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from './features/user/userSlice';
import { feedbacksApi } from './features/feedback/feedbackSlice';
import { roomsApi } from './features/room/roomSlice';

export const store = configureStore({
    reducer: {
        [usersApi.reducerPath]: usersApi.reducer,
        [feedbacksApi.reducerPath]: feedbacksApi.reducer,
        [roomsApi.reducerPath]: roomsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            usersApi.middleware,
            feedbacksApi.middleware,
            roomsApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;