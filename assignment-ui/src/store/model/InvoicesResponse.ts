export interface InvoicesResponse {
   code: number,
   message: string,
   data: Payload
}

export interface Invoices {
    id: string,
    invoiceNo: String,
    stockCode: String,
    description: String,
    quantity: String,
    invoiceDate: String,
    unitPrice: String,
    customerId: String,
    country: String,
    documentId: String
}

interface Payload { 
    rows: Invoices[],
    totalPage: number,
    count: number
}