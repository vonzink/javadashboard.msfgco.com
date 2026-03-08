package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.Task;
import com.msfg.dashboard.repository.TaskRepository;
import com.msfg.dashboard.security.SecurityUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> findAll(String status, Long assignedTo) {
        if (status != null && assignedTo != null) {
            return taskRepository.findByStatusAndAssignedToId(status, assignedTo);
        } else if (status != null) {
            return taskRepository.findByStatus(status);
        } else if (assignedTo != null) {
            return taskRepository.findByAssignedToId(assignedTo);
        }
        return taskRepository.findAll();
    }

    @Transactional
    public Task create(Task task) {
        if (task.getCreatedBy() == null) {
            task.setCreatedBy(SecurityUser.current());
        }
        return taskRepository.save(task);
    }

    @Transactional
    public Task update(Long id, Task updates) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        if (updates.getTitle() != null) task.setTitle(updates.getTitle());
        if (updates.getDescription() != null) task.setDescription(updates.getDescription());
        if (updates.getStatus() != null) task.setStatus(updates.getStatus());
        if (updates.getPriority() != null) task.setPriority(updates.getPriority());
        if (updates.getDueDate() != null) task.setDueDate(updates.getDueDate());
        if (updates.getAssignedTo() != null) task.setAssignedTo(updates.getAssignedTo());

        return taskRepository.save(task);
    }

    @Transactional
    public void delete(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        taskRepository.delete(task);
    }
}
