package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.ContentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContentItemRepository extends JpaRepository<ContentItem, Long> {
    List<ContentItem> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ContentItem> findByStatus(String status);

    @Query(value = "SELECT * FROM content_items WHERE LOWER(text_content) LIKE LOWER(CONCAT('%', :keyword, '%'))", nativeQuery = true)
    List<ContentItem> findByContentContainingIgnoreCase(@Param("keyword") String keyword);
}
