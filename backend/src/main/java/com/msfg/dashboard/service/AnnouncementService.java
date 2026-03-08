package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.Announcement;
import com.msfg.dashboard.model.entity.User;
import com.msfg.dashboard.repository.AnnouncementRepository;
import com.msfg.dashboard.security.SecurityUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    public List<Announcement> findAll() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Announcement create(Announcement announcement) {
        User currentUser = SecurityUser.current();
        if (currentUser != null) {
            announcement.setCreatedBy(currentUser);
        }
        return announcementRepository.save(announcement);
    }

    @Transactional
    public void delete(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", id));
        announcementRepository.delete(announcement);
    }
}
