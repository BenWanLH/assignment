package com.lh.be.controller.ControllerAdvice

import com.lh.be.model.exceptions.FileExtensionException
import com.lh.be.model.response.Response
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class FileExceptionHandler {
    @ExceptionHandler
    fun handleFileExtensionException(exception : FileExtensionException): ResponseEntity<Response> {
        val response : Response = Response(HttpStatus.BAD_REQUEST.value(), "File Extension should be .csv");
        return ResponseEntity(response, HttpStatus.BAD_REQUEST);
    }
}