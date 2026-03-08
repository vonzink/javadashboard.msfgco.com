package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.ContentItem;
import com.msfg.dashboard.model.entity.PromptTemplate;
import com.msfg.dashboard.service.ContentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    // --- Templates ---

    @GetMapping("/templates")
    public ResponseEntity<List<PromptTemplate>> listTemplates() {
        return ResponseEntity.ok(contentService.findAllTemplates());
    }

    @PostMapping("/templates")
    public ResponseEntity<PromptTemplate> createTemplate(@Valid @RequestBody PromptTemplate template) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contentService.createTemplate(template));
    }

    @PutMapping("/templates/{id}")
    public ResponseEntity<PromptTemplate> updateTemplate(@PathVariable Long id,
                                                          @Valid @RequestBody PromptTemplate template) {
        return ResponseEntity.ok(contentService.updateTemplate(id, template));
    }

    // --- Search ---

    @GetMapping("/search")
    public ResponseEntity<List<ContentItem>> search(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(contentService.searchContent(query));
    }

    // --- Generate (STUBBED) ---

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generate(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(contentService.generateContent(request));
    }

    // --- Content Items ---

    @GetMapping("/items")
    public ResponseEntity<List<ContentItem>> listItems() {
        return ResponseEntity.ok(contentService.findAllItems());
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ContentItem> updateItem(@PathVariable Long id,
                                                   @Valid @RequestBody ContentItem item) {
        return ResponseEntity.ok(contentService.updateItem(id, item));
    }

    @PostMapping("/items/{id}/approve")
    public ResponseEntity<ContentItem> approveItem(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.approveItem(id));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteItem(@PathVariable Long id) {
        contentService.deleteItem(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    // --- Publish (STUBBED) ---

    @PostMapping("/publish/{id}")
    public ResponseEntity<Map<String, Object>> publish(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.publishContent(id));
    }
}
