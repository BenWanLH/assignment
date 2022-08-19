import { Invoices } from "./InvoicesResponse";

export interface FileReducerState {
    fileId: String,
    invoices: Invoices[],
    totalPage: number,
    totalInvoices: number,
    currentPage: number,
    isLoading: boolean,
    loadingMessage: String,
    query: String
}

export interface UploadReducerState {
    isLoading: boolean,
    loadingMessage: String,
    fileId: String
    file: File | undefined
}

export interface AppState {
    file: FileReducerState,
    upload: UploadReducerState
}