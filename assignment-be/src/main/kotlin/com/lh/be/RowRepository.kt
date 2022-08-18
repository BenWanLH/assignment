package com.lh.be

import com.lh.be.model.Row
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository

interface RowRepository : MongoRepository<Row, String> {
    fun findOneById(id: ObjectId): Row
}