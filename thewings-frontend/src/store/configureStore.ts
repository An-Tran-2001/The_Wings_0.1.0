import {configureStore} from '@reduxjs/toolkit';
import AuthReducer, { AuthState } from "./auth/reducer";
export interface IRootState {
    auth: any;
}

export const store = configureStore({
    reducer: {
        auth: AuthReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;