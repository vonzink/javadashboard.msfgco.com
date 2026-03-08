package com.msfg.dashboard.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "guideline_chunks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class GuidelineChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private GuidelineFile guidelineFile;

    @Column(name = "chunk_index")
    private Integer chunkIndex;

    @Column(name = "section_id", length = 50)
    private String sectionId;

    @Column(name = "section_title", length = 500)
    private String sectionTitle;

    @Column(name = "page_number")
    private Integer pageNumber;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "product_type", length = 50)
    private String productType;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
