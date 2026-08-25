package com.academic.projectmonitoring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "presentation_evaluations")
public class PresentationEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "presentation_id", nullable = false, unique = true)
    private Presentation presentation;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "guide_id", nullable = false)
    private Guide guide;

    @Column(name = "marks_obtained", precision = 5, scale = 2)
    private BigDecimal marksObtained;

    @Column(name = "max_marks", precision = 5, scale = 2, nullable = false)
    private BigDecimal maxMarks = new BigDecimal("50.00");

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "attendance_status", length = 50, nullable = false)
    private String attendanceStatus = "PRESENT";

    @Column(name = "evaluated_at", updatable = false)
    private LocalDateTime evaluatedAt = LocalDateTime.now();

    public PresentationEvaluation() {}

    public PresentationEvaluation(Presentation presentation, Guide guide, BigDecimal marksObtained,
                                  BigDecimal maxMarks, String remarks, String attendanceStatus) {
        this.presentation = presentation;
        this.guide = guide;
        this.marksObtained = marksObtained;
        this.maxMarks = maxMarks != null ? maxMarks : new BigDecimal("50.00");
        this.remarks = remarks;
        this.attendanceStatus = attendanceStatus != null ? attendanceStatus : "PRESENT";
        this.evaluatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Presentation getPresentation() {
        return presentation;
    }

    public void setPresentation(Presentation presentation) {
        this.presentation = presentation;
    }

    public Guide getGuide() {
        return guide;
    }

    public void setGuide(Guide guide) {
        this.guide = guide;
    }

    public BigDecimal getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(BigDecimal marksObtained) {
        this.marksObtained = marksObtained;
    }

    public BigDecimal getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(BigDecimal maxMarks) {
        this.maxMarks = maxMarks;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(String attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    public LocalDateTime getEvaluatedAt() {
        return evaluatedAt;
    }

    public void setEvaluatedAt(LocalDateTime evaluatedAt) {
        this.evaluatedAt = evaluatedAt;
    }
}
