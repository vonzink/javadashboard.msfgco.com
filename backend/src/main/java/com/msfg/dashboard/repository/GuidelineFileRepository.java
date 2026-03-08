package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.GuidelineFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuidelineFileRepository extends JpaRepository<GuidelineFile, Long> {
    List<GuidelineFile> findByProductType(String productType);
}
