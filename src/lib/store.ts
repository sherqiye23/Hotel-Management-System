import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from './features/user/userSlice';
import { feedbacksApi } from './features/feedback/feedbackSlice';

export const store = configureStore({
    reducer: {
        [usersApi.reducerPath]: usersApi.reducer,
        [feedbacksApi.reducerPath]: feedbacksApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            usersApi.middleware,
            feedbacksApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;