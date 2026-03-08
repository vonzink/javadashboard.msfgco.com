package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByCreatedAtDesc();
    List<Announcement> findByStatusOrderByCreatedAtDesc(String status);
}
