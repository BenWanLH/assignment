package com.lh.be

import com.lh.be.model.Invoice
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

interface InvoiceRepository : MongoRepository<Invoice, String>{
    fun findOneById(id: String): Invoice;
    fun getInvoicesByDocumentId(documentid: String, page: Pageable): Page<Invoice>;
    @Query("{documentId: ?0,\$or : [" +
            "{'invoiceNo': {\$regex: ?1}}, " +
            "{'description': {\$regex: ?1, \$options: 'i'}}, " +
            "{'stockCode':  {\$regex: ?1, \$options: 'i'}}," +
            "{quantity: {\$regex: ?1, \$options: 'i'}}," +
            "{invoiceDate: {\$regex: ?1, \$options: 'i'}}," +
            "{unitPrice: {\$regex: ?1, \$options: 'i'}}," +
            "{customerId: {\$regex: ?1, \$options: 'i'}}," +
            "{country:  {\$regex: ?1, \$options: 'i'}}]}")
    fun getInvoiceByColumn(documentId: String,query: String, page: Pageable): Page<Invoice>
    fun deleteByDocumentId(documentId: String) : List<Invoice>
}

