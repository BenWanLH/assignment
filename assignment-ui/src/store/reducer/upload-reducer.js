import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const uploadThunk = createAsyncThunk('upload/uploadFile', async (file, thunkApi) => {
    const fileData = new FormData();
    fileData.append('file', file[0].raw);
    let { data } = await api.post('/uploadFile', fileData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
})
export const uploadReducer = createSlice({
    name: 'upload',
    initialState: {
        data: [],
        isLoading: false,
        loadingMessage: "",
        fileId: ""
    },
    reducers: {
        setFileId(state, { payload }) {
            state.fileId = payload;
        }
    },
    extraReducers: {
        [uploadThunk.pending]: (state) => {
            state.isLoading = true;
            state.loadingMessage = "Your file is being uploaded and processed. Please do not close your browser."
        },
        [uploadThunk.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            state.fileId = payload.data.documentId
            state.loadingMessage = "";
        },
        [uploadThunk.rejected]: (state, {}) => {
            state.isLoading = false;
            state.loadingMessage = "";
        }
    }
})

export const uploadActions = { ...uploadReducer.actions, upload: uploadThunk };
export default uploadReducer.reducer