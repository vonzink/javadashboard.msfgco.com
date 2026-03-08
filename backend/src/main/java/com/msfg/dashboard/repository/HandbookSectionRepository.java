package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.HandbookSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HandbookSectionRepository extends JpaRepository<HandbookSection, Long> {
    List<HandbookSection> findByDocumentIdAndIsActiveTrueOrderBySortOrderAsc(Long documentId);

    @Query("SELECT hs FROM HandbookSection hs WHERE hs.document.slug = :documentSlug AND hs.slug = :sectionSlug")
    Optional<HandbookSection> findByDocumentSlugAndSlug(String documentSlug, String sectionSlug);

    Optional<HandbookSection> findByDocumentIdAndSlug(Long documentId, String slug);

    @Query(value = "SELECT * FROM handbook_sections WHERE LOWER(content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(title) LIKE LOWER(CONCAT('%', :keyword, '%'))", nativeQuery = true)
    List<HandbookSection> findByContentOrTitleContaining(@Param("keyword") String keyword);
}
