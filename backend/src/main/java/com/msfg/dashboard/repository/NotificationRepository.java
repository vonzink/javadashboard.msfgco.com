package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdAndSentFalse(Long userId);
    List<Notification> findByUserIdOrderByReminderDateDescReminderTimeDesc(Long userId);
}
