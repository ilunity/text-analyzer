package org.download.services;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;


import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.download.config.StorageProperties;
import org.download.exception.InvalidFileException;
import org.download.exception.StorageException;
import org.download.exception.StorageFileNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;

import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;

import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FileSystemStorageService implements StorageService {
    private Map<Integer, Map<String, Double>> resultMap = new HashMap<>();

    private final Path rootLocation;

    @Autowired
    public FileSystemStorageService(StorageProperties properties) {

        if(properties.getLocation().trim().length() == 0){
            throw new StorageException("File upload location can not be Empty.");
        }

        this.rootLocation = Paths.get(properties.getLocation());
    }

    @Autowired
    private RestTemplate restTemplate;
    private Integer currentId = 0;

    @Override
    public Integer getNextId() {
        synchronized (currentId) {
            currentId++;
            return currentId;
        }
    }

    @Override
    public Integer countChar(MultipartFile file) throws IOException {
        if (file.getOriginalFilename().endsWith(".docx")) {
            XWPFDocument document = new XWPFDocument(file.getInputStream());
            int charCount = 0;

            for (XWPFParagraph paragraph : document.getParagraphs()) {
                charCount += paragraph.getText().length();
            }

            return charCount;
        } else {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Неподдерживаемый формат файла. Требуется .docx");
        }
    }


    public boolean containsText(MultipartFile file) {
        try {
            if (file.getOriginalFilename().endsWith(".docx")) {
                XWPFDocument document = new XWPFDocument(file.getInputStream());
                List<XWPFParagraph> paragraphs = document.getParagraphs();

                for (XWPFParagraph paragraph : paragraphs) {
                    for (XWPFRun run : paragraph.getRuns()) {
                        if (run.getEmbeddedPictures().size() == 0 && !run.text().isEmpty()) {
                            // Возвращаем true, если найден текстовый блок без встроенных изображений, содержащий текст.
                            return true;
                        }
                    }
                }
                // не найден текст или все текстовые блоки только с изображениями.
                return false;
            } else {
                throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Неподдерживаемый формат файла. Требуется .docx");
            }
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Ошибка при проверке файла");
        }
    }

    @Override
    public Map<String, Object> handleFileUpload(MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (file.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Uploaded file is empty");
            }
            if (!file.getOriginalFilename().endsWith(".docx")) {
                throw new InvalidFileException("Only .docx files are allowed!");
            }
            this.store(file);
            response.put("status", "success");
            response.put("message", "File: "+file.getOriginalFilename()+" uploaded successfully");
            return response;
        } catch (InvalidFileException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return response;
        }
    }

    @Override
    public String sendFileToOtherService(MultipartFile file) {
        try {
            String url = "http://localhost:89/post_text";
            HttpClient httpClient = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "multipart/form-data")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            return response.body();

        } catch (Exception e) {
            throw new RuntimeException("Failed to send the file to the other service.", e);
        }
    }
    @Override
    public void store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file.");
            }
            Path destinationFile = this.rootLocation.resolve(
                            Paths.get(file.getOriginalFilename()))
                    .normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                // This is a security check
                throw new StorageException(
                        "Cannot store file outside current directory.");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                        StandardCopyOption.REPLACE_EXISTING);
            }
        }
        catch (IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        }
        catch (IOException e) {
            throw new StorageException("Failed to read stored files", e);
        }

    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
            else {
                throw new StorageFileNotFoundException(
                        "Could not read file: " + filename);

            }
        }
        catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("Could not read file: " + filename, e);
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    @Override
    public void delete(String fileName) {
        Path filePath = this.rootLocation.resolve(fileName).normalize().toAbsolutePath();
        try {
            Files.delete(filePath);
        } catch (IOException e) {
            throw new StorageException("Failed to delete file: " + fileName, e);
        }
    }
    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        }
        catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }


    @Override
    public void save(Integer id, Map<String, Double> messageMap) {
        resultMap.put(id, messageMap);
    }

    @Override
    public Map<String, Double> getResult(Integer id) {

        Map<String, Double> messageMap = resultMap.get(id);

        return messageMap;
    }
}