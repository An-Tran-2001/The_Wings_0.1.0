import {configureStore} from '@reduxjs/toolkit';

export interface IRootState {
    auth: any;
}

export const store = configureStore({
    reducer: {
        auth: () => ({})
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;