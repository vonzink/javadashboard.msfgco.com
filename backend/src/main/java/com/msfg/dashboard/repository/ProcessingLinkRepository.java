package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.ProcessingLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProcessingLinkRepository extends JpaRepository<ProcessingLink, Long> {
    List<ProcessingLink> findByTabOrderBySortOrderAsc(String tab);
}
