package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByStartBetween(LocalDateTime start, LocalDateTime end);
}
