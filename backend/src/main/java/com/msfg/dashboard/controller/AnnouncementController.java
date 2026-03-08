package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.Announcement;
import com.msfg.dashboard.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public ResponseEntity<List<Announcement>> listAll() {
        return ResponseEntity.ok(announcementService.findAll());
    }

    @PostMapping
    public ResponseEntity<Announcement> create(@Valid @RequestBody Announcement announcement) {
        return ResponseEntity.status(HttpStatus.CREATED).body(announcementService.create(announcement));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        announcementService.delete(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
