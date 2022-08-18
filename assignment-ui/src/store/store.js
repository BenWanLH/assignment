import { configureStore } from "@reduxjs/toolkit";
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

export const store = configureStore({
    reducer: {
        upload: uploadReducer,
        file: fileReducer
    },
})

export default store;

