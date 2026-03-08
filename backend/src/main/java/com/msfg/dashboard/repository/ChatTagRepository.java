package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.ChatTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatTagRepository extends JpaRepository<ChatTag, Long> {
    Optional<ChatTag> findByName(String name);
}
