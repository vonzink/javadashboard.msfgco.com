package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.CalendarEvent;
import com.msfg.dashboard.repository.CalendarEventRepository;
import com.msfg.dashboard.security.SecurityUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;

    public CalendarEventService(CalendarEventRepository calendarEventRepository) {
        this.calendarEventRepository = calendarEventRepository;
    }

    public List<CalendarEvent> findByDateRange(LocalDateTime start, LocalDateTime end) {
        if (start != null && end != null) {
            return calendarEventRepository.findByStartBetween(start, end);
        }
        return calendarEventRepository.findAll();
    }

    @Transactional
    public CalendarEvent create(CalendarEvent event) {
        if (event.getCreatedBy() == null) {
            event.setCreatedBy(SecurityUser.current());
        }
        return calendarEventRepository.save(event);
    }

    @Transactional
    public void delete(Long id) {
        CalendarEvent event = calendarEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CalendarEvent", id));
        calendarEventRepository.delete(event);
    }
}
