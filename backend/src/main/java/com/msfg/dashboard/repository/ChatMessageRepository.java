package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
