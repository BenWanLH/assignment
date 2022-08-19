import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { InvoicesResponse } from "../model/InvoicesResponse"
import { AppState, FileReducerState } from "../model/State";

const getInvoicesThunk = createAsyncThunk<InvoicesResponse, { fileId: String }, { state: AppState }>('file/getInvoicesById', async ({ fileId }, { getState }) => {
    const state: AppState = getState();
    let { data }: { data: InvoicesResponse } = await api.get(`/file/${fileId}`, {
        params: {
            page: state.file.currentPage,
            query: state.file.query || undefined
        }
    });
    return data;
})

const initialState: FileReducerState = {
    fileId: "",
    invoices: [],
    totalPage: 0,
    totalInvoices: 0,
    currentPage: 0,
    isLoading: false,
    loadingMessage: "",
    query: "",
}

export const fileReducer = createSlice({
    name: 'file',
    initialState,
    reducers: {
        setCurrentPage: (state: FileReducerState, { payload }: PayloadAction<number>) => {
            state.currentPage = payload;
        },
        setQuery: (state, { payload }: PayloadAction<String>) => {
            state.query = payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getInvoicesThunk.pending, (state: FileReducerState) => {
            state.isLoading = true;
            state.loadingMessage = "Please wait a moment as we load your invoices."
        })
        builder.addCase(getInvoicesThunk.fulfilled, (state: FileReducerState, { payload }: PayloadAction<InvoicesResponse>) => {
            state.invoices = payload.data.rows;
            state.totalPage = payload.data.totalPage;
            state.totalInvoices = payload.data.count;
            state.isLoading = false;
            state.loadingMessage = "";
        })
        builder.addCase(getInvoicesThunk.rejected, (state: FileReducerState) => {
            state.isLoading = false;
            state.loadingMessage = "";
        })
    }
})

export const fileActions = { ...fileReducer.actions, getInvoiceById: getInvoicesThunk };

export default fileReducer.reducer