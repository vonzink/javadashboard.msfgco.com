package com.msfg.dashboard.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "processing_records")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProcessingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "loan_number", length = 100)
    private String loanNumber;

    @Column(name = "borrower", nullable = false)
    private String borrowerName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User lo;

    @Column(name = "lo_name")
    private String loName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processor_id")
    private User processor;

    @Column(name = "processor_name")
    private String processorName;

    @Column(name = "type", nullable = false, length = 50)
    private String orderType;

    @Column(name = "vendor")
    private String vendorName;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "ordered";

    @Column(name = "ordered_date")
    private LocalDate orderDate;

    @Column(name = "received_date")
    private LocalDate receivedDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "reference")
    private String referenceNumber;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
