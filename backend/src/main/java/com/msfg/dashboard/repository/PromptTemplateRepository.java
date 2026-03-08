package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.PromptTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PromptTemplateRepository extends JpaRepository<PromptTemplate, Long> {
    Optional<PromptTemplate> findByName(String name);
    List<PromptTemplate> findByIsActiveTrue();
    List<PromptTemplate> findByPlatform(String platform);
}
