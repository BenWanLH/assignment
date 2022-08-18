package com.lh.be.model.response

import com.lh.be.model.Invoice

data class UploadResponse(
    val code: Int,
    val message: String,
    val data: DocumentId
)

data class DocumentId(
    val documentId: String
)

data class InvoiceInfoResponse(
    val code: Int,
    val message: String,
    val data: InvoicesInfo
)

data class InvoicesInfo(
    val rows: List<Invoice>,
    val totalPage: Int,
    val count: Long
)