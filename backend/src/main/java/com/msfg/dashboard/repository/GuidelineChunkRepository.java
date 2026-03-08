package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.GuidelineChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GuidelineChunkRepository extends JpaRepository<GuidelineChunk, Long> {
    List<GuidelineChunk> findByGuidelineFileId(Long guidelineFileId);

    @Query(value = "SELECT * FROM guideline_chunks WHERE LOWER(content) LIKE LOWER(CONCAT('%', :keyword, '%'))", nativeQuery = true)
    List<GuidelineChunk> findByContentContainingIgnoreCase(@Param("keyword") String keyword);

    void deleteByGuidelineFileId(Long guidelineFileId);
    List<GuidelineChunk> findByGuidelineFileIdOrderByChunkIndexAsc(Long guidelineFileId);
}
