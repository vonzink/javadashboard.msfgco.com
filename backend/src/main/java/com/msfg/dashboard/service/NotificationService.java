package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.Notification;
import com.msfg.dashboard.repository.NotificationRepository;
import com.msfg.dashboard.security.SecurityUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> findForCurrentUser() {
        Long userId = SecurityUser.currentId();
        if (userId == null) {
            throw new IllegalArgumentException("User must be authenticated");
        }
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Notification create(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Transactional
    public Notification update(Long id, Notification updates) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", id));

        if (updates.getTitle() != null) notification.setTitle(updates.getTitle());
        if (updates.getMessage() != null) notification.setMessage(updates.getMessage());
        if (updates.getType() != null) notification.setType(updates.getType());
        if (updates.getRead() != null) notification.setRead(updates.getRead());
        if (updates.getReminderDate() != null) notification.setReminderDate(updates.getReminderDate());

        return notificationRepository.save(notification);
    }

    @Transactional
    public void delete(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        notificationRepository.delete(notification);
    }
}
