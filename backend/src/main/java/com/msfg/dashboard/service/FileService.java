package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FileService {

    private final Path uploadDir;

    public FileService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public Map<String, Object> uploadFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "unnamed";
        }

        // Sanitize filename
        String sanitized = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String timestamp = String.valueOf(System.currentTimeMillis());
        String storedFilename = timestamp + "_" + sanitized;

        try {
            Path targetPath = uploadDir.resolve(storedFilename).normalize();
            if (!targetPath.startsWith(uploadDir)) {
                throw new IllegalArgumentException("Invalid file path");
            }
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }

        return Map.of(
                "filename", storedFilename,
                "originalFilename", originalFilename,
                "size", file.getSize(),
                "contentType", file.getContentType() != null ? file.getContentType() : "application/octet-stream",
                "uploadedAt", LocalDateTime.now().toString()
        );
    }

    public List<Map<String, Object>> listFiles() {
        try (Stream<Path> paths = Files.list(uploadDir)) {
            return paths
                    .filter(Files::isRegularFile)
                    .map(path -> {
                        try {
                            return Map.<String, Object>of(
                                    "filename", path.getFileName().toString(),
                                    "size", Files.size(path),
                                    "lastModified", Files.getLastModifiedTime(path).toString()
                            );
                        } catch (IOException e) {
                            return Map.<String, Object>of(
                                    "filename", path.getFileName().toString(),
                                    "error", "Could not read file metadata"
                            );
                        }
                    })
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Failed to list files", e);
        }
    }

    public Resource downloadFile(String filename) {
        try {
            Path filePath = uploadDir.resolve(filename).normalize();
            if (!filePath.startsWith(uploadDir)) {
                throw new IllegalArgumentException("Invalid file path");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("File", filename);
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("File", filename);
        }
    }
}
