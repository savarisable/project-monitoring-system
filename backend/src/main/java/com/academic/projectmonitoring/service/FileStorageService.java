package com.academic.projectmonitoring.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    private Path fileStorageLocation;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "pdf", "doc", "docx", "ppt", "pptx", "txt", "rtf",
            "mp4", "mkv", "mov", "avi", "webm",
            "zip", "rar", "7z", "tar", "gz",
            "png", "jpg", "jpeg", "webp"
    );

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class StoredFileInfo {
        private String fileName;
        private String filePath;
        private String fileUrl;
        private Long fileSize;
        private String contentType;
    }

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";
        int i = originalFileName.lastIndexOf('.');
        if (i > 0) {
            extension = originalFileName.substring(i + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new RuntimeException("File type '." + extension + "' is not supported. Please upload MP4, ZIP, PDF, or Office documents.");
        }

        String uniqueFileName = UUID.randomUUID() + "_" + originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");
        try {
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName, ex);
        }
    }

    public StoredFileInfo storeFile(MultipartFile file, Long groupId, String milestoneCode, int versionNumber) {
        String storedName = storeFile(file);
        return StoredFileInfo.builder()
                .fileName(file.getOriginalFilename())
                .filePath(storedName)
                .fileUrl("/api/files/" + storedName)
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .build();
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found: " + fileName, ex);
        }
    }

    public Path loadFileAsPath(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }
}