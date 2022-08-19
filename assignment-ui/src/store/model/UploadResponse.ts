
export interface UploadResponse {
    code: number,
    message: String,
    data: Payload
}


interface Payload {
    documentId: String
}