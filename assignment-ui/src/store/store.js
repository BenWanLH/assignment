import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./reducer/file-reducer";
import uploadReducer from "./reducer/upload-reducer";


export default configureStore({
    reducer: {
        upload: uploadReducer,
        file: fileReducer
    },
})