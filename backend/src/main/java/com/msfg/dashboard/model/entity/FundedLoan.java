package com.msfg.dashboard.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "funded_loans")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FundedLoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "loan_number", length = 100)
    private String loanNumber;

    @Column(name = "client_name", nullable = false)
    private String borrowerName;

    @Column(name = "loan_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal loanAmount;

    @Column(name = "loan_type", length = 100)
    private String loanType;

    private String investor;

    @Column(name = "funded_date", nullable = false)
    private LocalDate fundingDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_lo_id")
    private User lo;

    @Column(name = "assigned_lo_name")
    private String loName;

    @Column(name = "assigned_processor_id", insertable = false, updatable = false)
    private Long processorId;

    @Column(name = "property_address", length = 500)
    private String propertyAddress;

    @Column(name = "source_system", length = 100)
    private String source;

    @Column(name = "monday_item_id", length = 50)
    private String mondayItemId;

    @Column(name = "source_board_id", length = 50)
    private String mondayBoardId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
