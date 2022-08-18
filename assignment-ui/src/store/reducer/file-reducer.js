import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const getInvoicesThunk = createAsyncThunk('file/getInvoicesById', async ({ fileId }, { getState }) => {

    const state = getState();
    console.log('this is state', state);
    let { data } = await api.get(`/file/${fileId}`, {
        params: {
            page: state.file.currentPage - 1,
            query: state.file.query || undefined
        }
    });
    return data;
})
export const fileReducer = createSlice({
    name: 'file',
    initialState: {
        fileId: "",
        invoices: [],
        totalPage: 0,
        totalInvoices: 0,
        currentPage: 1,
        isLoading: false,
        loadingMessage: "",
        query:"",
    },
    reducers: {
        setCurrentPage: (state, { payload }) => {
            state.currentPage = payload;
        },
        setQuery: (state, { payload }) => {
            state.query = payload;
        }
    },
    extraReducers: {
        [getInvoicesThunk.pending]: (state) => {
            state.isLoading = true;
            state.loadingMessage = "Please wait a moment as we load your invoices."
        },
        [getInvoicesThunk.fulfilled]: (state, { payload }) => {
            console.log('this is the payload', payload);
            state.invoices = payload.data.rows;
            state.totalPage = payload.data.totalPage;
            state.totalInvoices = payload.data.count;
            state.isLoading = false;
            state.loadingMessage = "";
        },
        [getInvoicesThunk.rejected]: (state, { payload }) => {
            console.log('this is the payload', payload);
            state.isLoading = false;
            state.loadingMessage = "";
        }
    }
})

export const fileActions = { ...fileReducer.actions, getInvoiceById: getInvoicesThunk };
export default fileReducer.reducer