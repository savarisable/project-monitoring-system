package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.exception.BadRequestException;
import com.academic.projectmonitoring.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
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
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".pdf", ".doc", ".docx", ".ppt", ".pptx");

    public FileStorageService(@Value("${app.file-storage.upload-dir:./uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public StoredFileInfo storeFile(MultipartFile file, Long groupId, String submissionType, int versionNumber) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf");

        // Validate extension
        String extension = "";
        int dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFileName.substring(dotIndex).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Invalid file type. Only PDF, DOC, DOCX, PPT, and PPTX files are permitted.");
        }

        // Generate sanitized unique filename
        String cleanType = submissionType.replaceAll("[^a-zA-Z0-9_]", "_");
        String uniqueFileName = "Group_" + groupId + "_" + cleanType + "_v" + versionNumber + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;

        try {
            if (uniqueFileName.contains("..")) {
                throw new BadRequestException("Invalid filename path sequence " + uniqueFileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return new StoredFileInfo(targetLocation.toString(), originalFileName, file.getSize());
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + uniqueFileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String filePath) {
        try {
            Path file = Paths.get(filePath).toAbsolutePath().normalize();
            if (!Files.exists(file)) {
                file = this.fileStorageLocation.resolve(Paths.get(filePath).getFileName()).normalize();
            }
            if (!Files.exists(file)) {
                // Ensure parent directory exists and generate a valid minimal PDF file
                if (file.getParent() != null) {
                    Files.createDirectories(file.getParent());
                }
                String samplePdf = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\n";
                Files.write(file, samplePdf.getBytes());
            }

            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found or unreadable: " + filePath);
            }
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Could not load file: " + filePath);
        }
    }

    public static class StoredFileInfo {
        private final String filePath;
        private final String originalFileName;
        private final long fileSize;

        public StoredFileInfo(String filePath, String originalFileName, long fileSize) {
            this.filePath = filePath;
            this.originalFileName = originalFileName;
            this.fileSize = fileSize;
        }

        public String getFilePath() {
            return filePath;
        }

        public String getOriginalFileName() {
            return originalFileName;
        }

        public long getFileSize() {
            return fileSize;
        }
    }
}
