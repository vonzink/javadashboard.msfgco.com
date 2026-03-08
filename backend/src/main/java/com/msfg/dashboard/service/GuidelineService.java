package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.GuidelineFile;
import com.msfg.dashboard.model.entity.GuidelineChunk;
import com.msfg.dashboard.repository.GuidelineFileRepository;
import com.msfg.dashboard.repository.GuidelineChunkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class GuidelineService {

    private final GuidelineFileRepository guidelineFileRepository;
    private final GuidelineChunkRepository guidelineChunkRepository;

    public GuidelineService(GuidelineFileRepository guidelineFileRepository,
                            GuidelineChunkRepository guidelineChunkRepository) {
        this.guidelineFileRepository = guidelineFileRepository;
        this.guidelineChunkRepository = guidelineChunkRepository;
    }

    public List<GuidelineChunk> search(String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("Search query is required");
        }
        return guidelineChunkRepository.findByContentContainingIgnoreCase(query);
    }

    public List<GuidelineFile> findAllFiles() {
        return guidelineFileRepository.findAll();
    }

    public List<GuidelineChunk> findChunksByFileId(Long fileId) {
        GuidelineFile file = guidelineFileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("GuidelineFile", fileId));
        return guidelineChunkRepository.findByGuidelineFileId(fileId);
    }

    @Transactional
    public Map<String, Object> uploadFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) originalFilename = "unnamed";

        GuidelineFile guidelineFile = new GuidelineFile();
        guidelineFile.setFileName(originalFilename);
        guidelineFile.setFileSize(file.getSize());
        guidelineFile.setContentType(file.getContentType());
        guidelineFile = guidelineFileRepository.save(guidelineFile);

        // In production, file content would be parsed and chunked here
        // For now, create a single placeholder chunk
        GuidelineChunk chunk = new GuidelineChunk();
        chunk.setGuidelineFile(guidelineFile);
        chunk.setContent("File uploaded: " + originalFilename + ". Content parsing pending.");
        chunk.setChunkIndex(0);
        guidelineChunkRepository.save(chunk);

        return Map.of(
                "id", guidelineFile.getId(),
                "fileName", originalFilename,
                "fileSize", file.getSize(),
                "uploadedAt", LocalDateTime.now().toString(),
                "message", "File uploaded successfully. Content will be processed."
        );
    }

    @Transactional
    public void deleteFile(Long id) {
        GuidelineFile file = guidelineFileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GuidelineFile", id));
        guidelineChunkRepository.deleteByGuidelineFileId(id);
        guidelineFileRepository.delete(file);
    }
}
