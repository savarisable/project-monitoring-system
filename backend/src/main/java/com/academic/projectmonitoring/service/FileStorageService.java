package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    
    // Comprehensive permitted academic deliverable extensions
    private final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
        // Documents & Presentations
        "pdf", "doc", "docx", "ppt", "pptx", "txt", "rtf",
        // Project Demo Videos
        "mp4", "mkv", "mov", "avi", "webm",
        // Source Code & Project Archives
        "zip", "rar", "7z", "tar", "gz",
        // Architecture Diagrams & Screenshots
        "png", "jpg", "jpeg", "webp", "gif"
    );

    public FileStorageService(@Value("${app.upload.dir:./uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file, String groupCode, String milestoneName) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file.");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "document");

        // Security check
        if (originalFileName.contains("..")) {
            throw new BadRequestException("Filename contains invalid path sequence " + originalFileName);
        }

        String fileExtension = "";
        int dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex > 0) {
            fileExtension = originalFileName.substring(dotIndex + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
            throw new BadRequestException("Invalid file type (." + fileExtension + "). Supported formats: PDF, DOC, PPT, MP4 Video, ZIP, and PNG/JPG.");
        }

        // Clean name formatted with group and milestone
        String cleanMilestone = milestoneName.replaceAll("[^a-zA-Z0-9_-]", "_");
        String cleanGroup = groupCode.replaceAll("[^a-zA-Z0-9_-]", "_");
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        String targetFileName = cleanGroup + "_" + cleanMilestone + "_" + uniqueId + "." + fileExtension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(targetFileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }
            return targetFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + targetFileName + ". Please try again!", ex);
        }
    }

    public Path loadFileAsPath(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }
}
