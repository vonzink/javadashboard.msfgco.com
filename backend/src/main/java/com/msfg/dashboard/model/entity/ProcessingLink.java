package com.msfg.dashboard.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "processing_links")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProcessingLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "section_type", nullable = false, length = 20)
    private String tab;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    private String email;

    @Column(length = 50)
    private String phone;

    @Column(length = 50)
    private String fax;

    @Column(name = "agent_name")
    private String agentName;

    @Column(name = "agent_email")
    private String agentEmail;

    @Column(length = 100)
    private String icon;

    @Column(name = "group_label", length = 100)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
