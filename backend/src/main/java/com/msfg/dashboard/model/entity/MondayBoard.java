package com.msfg.dashboard.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "monday_boards")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MondayBoard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "board_id", nullable = false, unique = true, length = 50)
    private String boardId;

    @Column(name = "board_name", nullable = false)
    private String boardName;

    @Column(name = "target_section")
    private String boardType;

    @Column(name = "column_mappings", columnDefinition = "json")
    private String columnMappings;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean enabled = true;

    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
