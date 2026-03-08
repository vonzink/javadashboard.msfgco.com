package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.Notification;
import com.msfg.dashboard.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> listForCurrentUser() {
        return ResponseEntity.ok(notificationService.findForCurrentUser());
    }

    @PostMapping
    public ResponseEntity<Notification> create(@Valid @RequestBody Notification notification) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.create(notification));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> update(@PathVariable Long id,
                                               @Valid @RequestBody Notification notification) {
        return ResponseEntity.ok(notificationService.update(id, notification));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        notificationService.delete(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
