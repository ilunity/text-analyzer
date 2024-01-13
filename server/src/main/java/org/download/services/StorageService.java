package org.download.services;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Map;
import java.util.stream.Stream;

public interface StorageService {

    Integer countChar(MultipartFile file) throws IOException;

    void init();

    void save(Integer id, Map<String, Double> messageMap);

    public Map<String, Double> getResult(Integer id);


    void store(MultipartFile file);

    Stream<Path> loadAll();

    Path load(String filename);

    Resource loadAsResource(String filename);

    void deleteAll();
    void delete(String fileName);

    String sendFileToOtherService(MultipartFile file);

    Map<String, Object> handleFileUpload(MultipartFile file);

     boolean containsText(MultipartFile file);

    public Integer getNextId();



}