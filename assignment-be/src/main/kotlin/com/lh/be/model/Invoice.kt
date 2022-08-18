package com.lh.be.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class Invoice(
    @Id
    val id: String,
    val invoiceNo: String,
    val stockCode: String,
    val description: String,
    val quantity: String,
    val invoiceDate: String,
    val unitPrice: String,
    val customerId: String,
    val country: String,
    val documentId: String,
)
