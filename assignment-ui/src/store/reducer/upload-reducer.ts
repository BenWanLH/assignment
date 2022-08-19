import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { UploadReducerState } from "../model/State";
import { UploadResponse } from "../model/UploadResponse";

const uploadThunk = createAsyncThunk<UploadResponse, File>('upload/uploadFile', async (file) => {
    const fileData = new FormData();
    fileData.append('file', file);
    let { data } = await api.post('/uploadFile', fileData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
})

const initialState: UploadReducerState = {
    isLoading: false,
    loadingMessage: "",
    fileId: "",
    file: undefined
}
export const uploadReducer = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        setFileId(state: UploadReducerState, { payload }: PayloadAction<String>) {
            state.fileId = payload;
        },
        setFile(state, { payload }: PayloadAction<File | undefined>) {
            state.file = payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(uploadThunk.pending, (state: UploadReducerState) => {
            state.isLoading = true;
            state.loadingMessage = "Your file is being uploaded and processed. Please do not close your browser."
            return;
        })
        builder.addCase(uploadThunk.fulfilled, (state: UploadReducerState, { payload }: PayloadAction<UploadResponse>) => {
            state.isLoading = false;
            state.fileId = payload.data.documentId
            state.loadingMessage = "";
            return;
        })
        builder.addCase(uploadThunk.rejected, (state: UploadReducerState) => {
            state.isLoading = false;
            state.loadingMessage = "";
            return
        })
    }
})

export const uploadActions = { ...uploadReducer.actions, upload: uploadThunk };
export default uploadReducer.reducer