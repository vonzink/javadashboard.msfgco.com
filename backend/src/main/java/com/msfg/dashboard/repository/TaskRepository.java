package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToIdOrderByDueDateAsc(Long assignedToId);
    List<Task> findByStatusNot(String status);
    List<Task> findByStatusAndAssignedToId(String status, Long assignedToId);
    List<Task> findByStatus(String status);
    List<Task> findByAssignedToId(Long assignedToId);
}
