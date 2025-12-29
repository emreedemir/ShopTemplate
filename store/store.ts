import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import cartReducer from './slices/cartSlice';
import profileReducer from './slices/profileSlice';
export const store =configureStore({
    reducer:
    {
        auth:authReducer,
        cart:cartReducer,
        profile:profileReducer
    }
});

export type RootState =ReturnType<typeof store.getState>;
export type AppDispatch =typeof store.dispatch;