package com.msfg.dashboard.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lendingpad_loans")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LendingpadLoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "loan_id", unique = true, length = 100)
    private String externalId;

    @Column(name = "borrower_name")
    private String borrowerName;

    @Column(name = "co_borrower_name")
    private String coBorrowerName;

    @Column(name = "loan_number", length = 50)
    private String loanNumber;

    @Column(name = "loan_amount", precision = 15, scale = 2)
    private BigDecimal loanAmount;

    @Column(name = "loan_type")
    private String loanType;

    @Column(name = "loan_purpose")
    private String loanPurpose;

    @Column(name = "property_address")
    private String propertyAddress;

    @Column(name = "property_city")
    private String propertyCity;

    @Column(name = "property_state")
    private String propertyState;

    @Column(name = "property_zip")
    private String propertyZip;

    @Column(name = "loan_status")
    private String status;

    @Column(name = "lock_status")
    private String lockStatus;

    @Column(name = "lock_expiration")
    private LocalDate lockExpiration;

    @Column(name = "note_rate", precision = 6, scale = 3)
    private BigDecimal rate;

    @Column(precision = 6, scale = 3)
    private BigDecimal apr;

    @Column(name = "term")
    private Integer loanTerm;

    @Column(name = "ltv_ratio", precision = 6, scale = 3)
    private BigDecimal ltv;

    @Column(name = "combined_ltv", precision = 6, scale = 3)
    private BigDecimal cltv;

    @Column(name = "back_dti", precision = 6, scale = 3)
    private BigDecimal dti;

    @Column(name = "credit_score")
    private Integer creditScore;

    @Column(name = "lo_name")
    private String loName;

    @Column(name = "lo_email")
    private String loEmail;

    @Column(name = "processor_name")
    private String processorName;

    @Column(name = "processor_email")
    private String processorEmail;

    @Column(name = "underwriter_name")
    private String underwriterName;

    @Column(name = "investor_name")
    private String investorName;

    @Column(name = "estimated_closing")
    private LocalDate estimatedClosing;

    @Column(name = "actual_closing")
    private LocalDate actualClosing;

    @Column(name = "raw_json", columnDefinition = "json")
    private String rawData;

    private String source;

    @Column(name = "received_at")
    private LocalDateTime syncedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
