
package org.download.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFPictureData;
import org.download.exception.InvalidFileException;
import org.download.rabbit.RabbitMQConsumer;
import org.download.rabbit.RabbitMQPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import org.download.exception.StorageFileNotFoundException;
import org.download.services.StorageService;


@RestController
@CrossOrigin("*")
public class FileUploadController {
    private static Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private RabbitMQPublisher rabbitMQPublisher;

    @Autowired
    private RabbitMQConsumer rabbitMQConsumer;

    private final StorageService storageService;
    @Autowired
    public FileUploadController(StorageService storageService) {
        this.storageService = storageService;
    }

    @Async
    @PostMapping("/analyse")
    public CompletableFuture<ResponseEntity<String>> handleFileUpload(@RequestParam("file") MultipartFile file) {
        logger.info("Handling handleFileUpload request");

        return CompletableFuture.supplyAsync(() -> {
            if (file.isEmpty() || !storageService.containsText(file)) {
                throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Загруженный файл пуст/Файл не содержит текста");
            }  else {
                // Дальнейшие действия при наличии текста в файле
                try{
                    // Лимит в 4 млн знаков включая пробелы
                    if (storageService.countChar(file) > 4000000) {
                        throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Превышен лимит символов в тексте, больше 4 млн");
                    }

                    Map<String, Object> response = storageService.handleFileUpload(file);
                    HttpStatus status = HttpStatus.OK;

                    if (response.get("status") != null && response.get("status").equals("success")) {
                        try {
                            Integer id = storageService.getNextId();
                            rabbitMQPublisher.sendFileToQueue(id, file.getBytes(), file.getOriginalFilename());
                            rabbitMQConsumer.listenForResultsAndSendToFrontend();

                            storageService.delete(file.getOriginalFilename());
                            return new ResponseEntity<>(id.toString(), status);
                        } catch (IOException e) {
                            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Ошибка отправки файла в очередь обработки");
                        }
                    } else {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, (String) response.get("message"));
                    }
                }catch (IOException e){
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Ошибка обработки файла");
                }
            }
        });
    }


    @GetMapping("/result/{id}")
    @ResponseBody
    @Async
    public CompletableFuture<ResponseEntity<Map<String, Double>>> getResult(@PathVariable String id) {
        if (id == null || id.isEmpty()) {
            // Если id пустой, вернуть соответствующую ошибку
            Map<String, Double> errorResult = new HashMap<>();
            errorResult.put("error", 400.0);
            return CompletableFuture.completedFuture(new ResponseEntity<>(errorResult, HttpStatus.BAD_REQUEST));
        }
        try {
            Integer intId = Integer.parseInt(id);
            Map<String, Double> result = storageService.getResult(intId);

            if (result == null) {
                // Если результат еще не готов, возвращаем статус 202
                result = new HashMap<>();
                result.put("status", 202.0);
                return CompletableFuture.completedFuture(new ResponseEntity<>(result, HttpStatus.ACCEPTED));
            } else {
                // Проверяем, что результат уже существует и содержит данные
                if (!result.isEmpty()) {
                    return CompletableFuture.completedFuture(new ResponseEntity<>(result, HttpStatus.OK));
                } else {
                    // Если результат пуст, возвращаем 204
                    Map<String, Double> ResultNull = new HashMap<>();
                    ResultNull.put("status", 204.0);
                    return CompletableFuture.completedFuture(new ResponseEntity<>(ResultNull, HttpStatus.NO_CONTENT));
                }
            }
        } catch (NumberFormatException e) {
            // Если id не удалось преобразовать в Integer, вернуть соответствующую ошибку
            Map<String, Double> errorResult = new HashMap<>();
            errorResult.put("error", 400.0);
            return CompletableFuture.completedFuture(new ResponseEntity<>(errorResult, HttpStatus.BAD_REQUEST));
        }
    }



    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }
    @ExceptionHandler(InvalidFileException.class)
    public ResponseEntity<?> handleInvalidFileException(InvalidFileException exc) {
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(exc.getMessage());
    }

}