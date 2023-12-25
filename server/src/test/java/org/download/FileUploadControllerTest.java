package org.download;

import org.download.controller.FileUploadController;
import org.download.rabbit.RabbitMQConsumer;
import org.download.rabbit.RabbitMQPublisher;
import org.download.services.StorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;


import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import static net.minidev.json.JSONValue.isValidJson;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

import java.util.concurrent.ExecutionException;

@WebMvcTest(FileUploadController.class)
@ExtendWith(MockitoExtension.class)
public class FileUploadControllerTest {
    @InjectMocks
    private FileUploadController fileUploadController;

    @Mock
    private StorageService storageService;

    @Mock
    private RabbitMQPublisher rabbitMQPublisher;

    @Mock
    private RabbitMQConsumer rabbitMQConsumer;

    //Тест проверяет успешную обработку загрузки файла и отправку его на обработку в очередь rabbit.
//    @Test
//    public void testHandleFileUpload_Success() throws IOException, InterruptedException, ExecutionException {
//        // Подготовка
//        MockMultipartFile file = new MockMultipartFile("file",
//                "test.docx", MediaType.MULTIPART_FORM_DATA_VALUE, "test data".getBytes());
//
//        CompletableFuture<ResponseEntity<String>> response = fileUploadController.handleFileUpload(file);
//
//        ResponseEntity<String> result;
//        try {
//            result = response.get();
//            assertEquals(HttpStatus.OK, result.getStatusCode());
//
//            // отправлен в очередь обработки
//            verify(rabbitMQPublisher).sendFileToQueue(anyInt(), eq(file.getBytes()), eq(file.getOriginalFilename()));
//            // отправлен на фронтенд
//            verify(rabbitMQConsumer).listenForResultsAndSendToFrontend();
//
//            assertNotNull(result.getBody());
//            assertTrue(result.getBody().contains("Expected Data"));
//            assertTrue(isValidJson(result.getBody()));
//
//        } catch (Exception e) {
//           e.getMessage();
//        }
//    }


}