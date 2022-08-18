package com.lh.be

import com.fasterxml.jackson.databind.ObjectMapper
import com.lh.be.constants.Constant
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import com.google.gson.Gson
import com.lh.be.model.response.UploadResponse
import org.junit.jupiter.api.AfterEach
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import java.nio.file.Files
import java.nio.file.Paths


@SpringBootTest
@AutoConfigureMockMvc

class BeApplicationTests (
	@Autowired val mockMvc: MockMvc,
	@Autowired val objectMapper: ObjectMapper
) {
	companion object {
		@JvmField
		var testId: String = ""
	}
	@Test
	fun uploadFilesThrowBadRequestIfFileNotCsv() {
		val byteArr = Files.readAllBytes(Paths.get("./src/test/kotlin/com/lh/be/mockData/mock.txt"));
		mockMvc.perform(multipart("${Constant.apiPrefix}/uploadFile").file("file", byteArr))
			.andExpect(status().isBadRequest());
	}

	@Test
	fun uploadFilesSucceed() {
		val byteArr = Files.readAllBytes(Paths.get("./src/test/kotlin/com/lh/be/mockData/mock.csv"));
		val sampleFile = MockMultipartFile("file","mock.csv", "text/csv",byteArr);
		val multipartRequest = MockMvcRequestBuilders.multipart("${Constant.apiPrefix}/uploadFile");
		val result = mockMvc.perform(multipartRequest.file(sampleFile))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.data.documentId").exists())
			.andReturn();
		val parsedObject = Gson().fromJson(result.response.contentAsString, UploadResponse::class.java);
		testId = parsedObject.data.documentId;
	}

	@Test
	fun getFileByIdWithoutQuery() {
		setup();
		mockMvc.get("${Constant.apiPrefix}/file/${testId}?page=0")
						.andExpect {
							status { isOk() }
							jsonPath("$.data.count").equals(3)
							jsonPath("$.data.totalPage").equals(1)
						}
	}

	@Test
	fun deleteFileByIdSuccess() {
		setup()
		mockMvc.delete("${Constant.apiPrefix}/delete/${testId}")
			.andExpect {
				status { isOk() }
			}
	}

	@AfterEach
	fun deleteFileUploaded() {
		if(testId != "") {
			deleteFileByIdSuccess();
		}
	}

	fun setup() {
		val byteArr = Files.readAllBytes(Paths.get("./src/test/kotlin/com/lh/be/mockData/mock.csv"));
		val sampleFile = MockMultipartFile("file","mock.csv", "text/csv",byteArr);
		val multipartRequest = MockMvcRequestBuilders.multipart("${Constant.apiPrefix}/uploadFile");
		val result = mockMvc.perform(multipartRequest.file(sampleFile))
			.andReturn();
		val parsedObject = Gson().fromJson(result.response.contentAsString, UploadResponse::class.java);
		testId = parsedObject.data.documentId;
	}

}
