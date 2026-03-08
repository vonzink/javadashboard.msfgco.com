package com.msfg.dashboard.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "calendar_events")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "who")
    private String who;

    @Column(name = "start", nullable = false)
    private LocalDateTime start;

    @Column(name = "end")
    private LocalDateTime end;

    @Column(name = "allDay")
    @Builder.Default
    private Integer allDay = 0;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 20)
    @Builder.Default
    private String color = "#104547";

    @Column(name = "recurrence_rule", length = 20)
    @Builder.Default
    private String recurrenceRule = "none";

    @Column(name = "recurrence_end")
    private LocalDate recurrenceEnd;

    @Column(name = "recurrence_group_id", length = 36)
    private String recurrenceGroupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
