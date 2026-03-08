package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.CalendarEvent;
import com.msfg.dashboard.service.CalendarEventService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar-events")
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    public CalendarEventController(CalendarEventService calendarEventService) {
        this.calendarEventService = calendarEventService;
    }

    @GetMapping
    public ResponseEntity<List<CalendarEvent>> list(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(calendarEventService.findByDateRange(start, end));
    }

    @PostMapping
    public ResponseEntity<CalendarEvent> create(@Valid @RequestBody CalendarEvent event) {
        return ResponseEntity.status(HttpStatus.CREATED).body(calendarEventService.create(event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        calendarEventService.delete(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
