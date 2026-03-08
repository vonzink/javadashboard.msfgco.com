package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.GuidelineChunk;
import com.msfg.dashboard.model.entity.GuidelineFile;
import com.msfg.dashboard.service.GuidelineService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guidelines")
public class GuidelineController {

    private final GuidelineService guidelineService;

    public GuidelineController(GuidelineService guidelineService) {
        this.guidelineService = guidelineService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<GuidelineChunk>> search(@RequestParam String query) {
        return ResponseEntity.ok(guidelineService.search(query));
    }

    @GetMapping("/files")
    public ResponseEntity<List<GuidelineFile>> listFiles() {
        return ResponseEntity.ok(guidelineService.findAllFiles());
    }

    @GetMapping("/chunks/{id}")
    public ResponseEntity<List<GuidelineChunk>> getChunks(@PathVariable Long id) {
        return ResponseEntity.ok(guidelineService.findChunksByFileId(id));
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(guidelineService.uploadFile(file));
    }

    @DeleteMapping("/files/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteFile(@PathVariable Long id) {
        guidelineService.deleteFile(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
