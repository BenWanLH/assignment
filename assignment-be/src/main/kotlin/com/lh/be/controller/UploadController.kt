package com.lh.be.controller

import com.lh.be.InvoiceRepository
import com.lh.be.constants.Constant
import com.lh.be.model.Invoice
import com.lh.be.model.exceptions.FileExtensionException
import com.lh.be.model.response.*
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.InputStream
import org.springframework.web.bind.annotation.CrossOrigin
import java.util.Optional


@RestController
class UploadController @Autowired constructor(private val invoiceRepository: InvoiceRepository) {

    private val defaultResponse: Response = Response(200, "successfully uploaded");
    private var currentPage: Int = 0;

    @CrossOrigin(origins = ["http://localhost:3000"])
    @PostMapping("${Constant.apiPrefix}/uploadFile")
    fun uploadFiles(@RequestPart("file") file: MultipartFile): ResponseEntity<UploadResponse> {
        val processedFile: File = File(file.originalFilename);
        if (processedFile.extension != "csv") {
            throw FileExtensionException();
        }
        val inputStream: InputStream = file.inputStream;
        val parsedCsv = readCsv(inputStream);
        invoiceRepository.saveAll(parsedCsv);
        return ResponseEntity(
            UploadResponse(
                200,
                "Successfully Uploaded",
                DocumentId(parsedCsv[0].documentId)
            ), HttpStatus.OK
        );
    }

    @CrossOrigin(origins = ["http://localhost:3000"])
    @GetMapping("${Constant.apiPrefix}/file/{documentId}")
    @ResponseStatus(HttpStatus.OK)
    fun getFileById(
        @PathVariable(name = "documentId") documentId: String,
        @RequestParam(name = "page") page: String,
        @RequestParam(name = "query") query: Optional<String>
    ): InvoiceInfoResponse {
        var result: Page<Invoice>;
        if (!query.isPresent) {
            result = invoiceRepository.getInvoicesByDocumentId(
                documentId,
                PageRequest.of(page.toInt(), Constant.recordsPerPage)
            );
        } else {
            val queryString = "${query.get()}"
            result = invoiceRepository.getInvoiceByColumn(
                documentId,
                queryString,
                PageRequest.of(page.toInt(), Constant.recordsPerPage)
            );
        }
        return InvoiceInfoResponse(
            200,
            "success",
            InvoicesInfo(result.toList(), result.totalPages, result.totalElements)
        );
    }

    @DeleteMapping("${Constant.apiPrefix}/deleteAllUploadedFile")
    @ResponseStatus(HttpStatus.OK)
    fun deleteAllUploadedFile(): Response {
        invoiceRepository.deleteAll();
        return Response(200, "success");
    }

    @DeleteMapping("${Constant.apiPrefix}/delete/{documentId}")
    @ResponseStatus(HttpStatus.OK)
    fun deleteFileById(@PathVariable(name = "documentId") documentId: String): Response {
        val deletedInvoices = invoiceRepository.deleteByDocumentId(documentId);
        return Response(200, "success");
    }

    fun readCsv(inputStream: InputStream): List<Invoice> {
        val documentId = ObjectId.get().toString();
        val reader = inputStream.bufferedReader()
        reader.readLine()
        return reader.lineSequence()
            .filter { it.isNotBlank() }
            .map {
                // println("this is it ${it}");
                var index = 0;
                val row: MutableList<String> = mutableListOf<String>();
                var mutatedString: String = it;
                while (index < 7) {
                    if (index < 2) {
                        val splitedString = mutatedString.split(",", ignoreCase = false, limit = 2);
                        row.add(splitedString[0]);
                        mutatedString = splitedString[1];
                    } else {
                        // println("this is the mutated string and array ${row} , ${mutatedString}");
                        val lastCommaIndex = mutatedString.lastIndexOf(",");
                        row.add(mutatedString.substring(lastCommaIndex + 1));
                        mutatedString = mutatedString.substring(0, lastCommaIndex);
                        if (index == 6) {
                            row.add(mutatedString);
                        }
                    }
                    index++;
                }
                // println("this is the array ${row}");
                Invoice(
                    ObjectId.get().toString(),
                    row[0],
                    row[1],
                    row[7],
                    row[6],
                    row[5],
                    row[4],
                    row[3],
                    row[2],
                    documentId
                );
            }.toList();
    }
}
