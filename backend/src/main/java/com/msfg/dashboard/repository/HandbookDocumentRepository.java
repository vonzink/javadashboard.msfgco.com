package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.HandbookDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HandbookDocumentRepository extends JpaRepository<HandbookDocument, Long> {
    List<HandbookDocument> findAllByIsActiveTrueOrderBySortOrderAsc();
    Optional<HandbookDocument> findBySlug(String slug);
}
