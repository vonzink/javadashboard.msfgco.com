package com.msfg.dashboard.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "content_items")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ContentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_template_id")
    private PromptTemplate template;

    @Column(length = 20, nullable = false)
    private String platform;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "text_content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "metadata", columnDefinition = "json")
    private String metadata;

    @Column(length = 30)
    @Builder.Default
    private String status = "draft";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledFor;

    @Column(name = "posted_at")
    private LocalDateTime publishedAt;

    @Column(name = "post_external_id")
    private String publishResult;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
