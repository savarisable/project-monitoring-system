package com.academic.projectmonitoring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "milestones")
public class Milestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Column(name = "milestone_order", nullable = false)
    private int milestoneOrder;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "default_deadline_days", nullable = false)
    private int defaultDeadlineDays = 14;

    @Column(name = "is_required", nullable = false)
    private boolean required = true;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    public Milestone() {}

    public Milestone(AcademicYear academicYear, int milestoneOrder, String title, String description,
                     int defaultDeadlineDays, boolean required) {
        this.academicYear = academicYear;
        this.milestoneOrder = milestoneOrder;
        this.title = title;
        this.description = description;
        this.defaultDeadlineDays = defaultDeadlineDays;
        this.required = required;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AcademicYear getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(AcademicYear academicYear) {
        this.academicYear = academicYear;
    }

    public int getMilestoneOrder() {
        return milestoneOrder;
    }

    public void setMilestoneOrder(int milestoneOrder) {
        this.milestoneOrder = milestoneOrder;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDefaultDeadlineDays() {
        return defaultDeadlineDays;
    }

    public void setDefaultDeadlineDays(int defaultDeadlineDays) {
        this.defaultDeadlineDays = defaultDeadlineDays;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
