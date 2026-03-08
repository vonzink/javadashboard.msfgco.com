package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.ProcessingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProcessingRecordRepository extends JpaRepository<ProcessingRecord, Long> {
    @Query("SELECT pr FROM ProcessingRecord pr WHERE pr.lo.id = :userId OR pr.processor.id = :userId ORDER BY pr.createdAt DESC")
    List<ProcessingRecord> findByLoIdOrProcessorIdOrderByCreatedAtDesc(Long userId);

    List<ProcessingRecord> findByOrderTypeOrderByCreatedAtDesc(String orderType);
}
