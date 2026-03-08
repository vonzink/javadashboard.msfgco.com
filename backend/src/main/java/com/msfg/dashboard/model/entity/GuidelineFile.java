package com.msfg.dashboard.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "guideline_files")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class GuidelineFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_type", nullable = false, length = 50)
    private String productType;

    @Column(name = "file_name", nullable = false, length = 500)
    private String fileName;

    @Column(name = "s3_key", length = 1000)
    private String s3Key;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "version_label", length = 100)
    private String versionLabel;

    @Column(nullable = false)
    @Builder.Default
    private String status = "processing";

    @Column(name = "chunk_count")
    private Integer chunkCount;

    @Transient
    private String contentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "guidelineFile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<GuidelineChunk> chunks = new ArrayList<>();
}
