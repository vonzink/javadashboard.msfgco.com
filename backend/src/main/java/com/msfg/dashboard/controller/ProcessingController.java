package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.ProcessingLink;
import com.msfg.dashboard.model.entity.ProcessingRecord;
import com.msfg.dashboard.service.ProcessingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/processing")
public class ProcessingController {

    private final ProcessingService processingService;

    public ProcessingController(ProcessingService processingService) {
        this.processingService = processingService;
    }

    // --- Processing Records ---

    @GetMapping
    public ResponseEntity<List<ProcessingRecord>> listRecords() {
        return ResponseEntity.ok(processingService.findAllRecords());
    }

    @PostMapping
    public ResponseEntity<ProcessingRecord> createRecord(@Valid @RequestBody ProcessingRecord record) {
        return ResponseEntity.status(HttpStatus.CREATED).body(processingService.createRecord(record));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProcessingRecord> updateRecord(@PathVariable Long id,
                                                          @Valid @RequestBody ProcessingRecord record) {
        return ResponseEntity.ok(processingService.updateRecord(id, record));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteRecord(@PathVariable Long id) {
        processingService.deleteRecord(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    // --- Processing Links ---

    @GetMapping("/links")
    public ResponseEntity<List<ProcessingLink>> listLinks() {
        return ResponseEntity.ok(processingService.findAllLinks());
    }

    @PostMapping("/links")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProcessingLink> createLink(@Valid @RequestBody ProcessingLink link) {
        return ResponseEntity.status(HttpStatus.CREATED).body(processingService.createLink(link));
    }

    @PutMapping("/links/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProcessingLink> updateLink(@PathVariable Long id,
                                                      @Valid @RequestBody ProcessingLink link) {
        return ResponseEntity.ok(processingService.updateLink(id, link));
    }

    @DeleteMapping("/links/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteLink(@PathVariable Long id) {
        processingService.deleteLink(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
