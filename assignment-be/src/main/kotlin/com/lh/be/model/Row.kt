package com.lh.be.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class Row (
    @Id
    val id: String = ObjectId.get().toString(),
    val value: String
)