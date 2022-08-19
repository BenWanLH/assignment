import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppState } from "./model/State";
import fileReducer from "./reducer/file-reducer";
import uploadReducer from "./reducer/upload-reducer";

export function resetStore() {
    return configureStore({
        reducer: {
            upload: uploadReducer,
            file: fileReducer
        },
    });
}

const reducer = {
    upload: uploadReducer,
    file: fileReducer
}

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})

export default store;
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

