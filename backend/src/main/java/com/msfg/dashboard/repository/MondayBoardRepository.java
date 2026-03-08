package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.MondayBoard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MondayBoardRepository extends JpaRepository<MondayBoard, Long> {
    Optional<MondayBoard> findByBoardId(String boardId);
    List<MondayBoard> findByEnabledTrue();
}
