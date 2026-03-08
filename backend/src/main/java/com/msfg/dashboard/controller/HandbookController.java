package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.HandbookDocument;
import com.msfg.dashboard.model.entity.HandbookSection;
import com.msfg.dashboard.service.HandbookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/handbook")
public class HandbookController {

    private final HandbookService handbookService;

    public HandbookController(HandbookService handbookService) {
        this.handbookService = handbookService;
    }

    @GetMapping("/documents")
    public ResponseEntity<List<HandbookDocument>> listDocuments() {
        return ResponseEntity.ok(handbookService.findAllDocuments());
    }

    @GetMapping("/sections/by-slug/{docSlug}/{sectionSlug}")
    public ResponseEntity<HandbookSection> getSectionBySlug(@PathVariable String docSlug,
                                                             @PathVariable String sectionSlug) {
        return ResponseEntity.ok(handbookService.findSectionBySlug(docSlug, sectionSlug));
    }

    @GetMapping("/search")
    public ResponseEntity<List<HandbookSection>> search(@RequestParam String query) {
        return ResponseEntity.ok(handbookService.search(query));
    }

    @PutMapping("/sections/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HandbookSection> updateSection(@PathVariable Long id,
                                                          @Valid @RequestBody HandbookSection section) {
        return ResponseEntity.ok(handbookService.updateSection(id, section));
    }

    @PostMapping("/documents/{docId}/sections")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HandbookSection> createSection(@PathVariable Long docId,
                                                          @Valid @RequestBody HandbookSection section) {
        return ResponseEntity.status(HttpStatus.CREATED).body(handbookService.createSection(docId, section));
    }

    @DeleteMapping("/sections/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteSection(@PathVariable Long id) {
        handbookService.deleteSection(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
