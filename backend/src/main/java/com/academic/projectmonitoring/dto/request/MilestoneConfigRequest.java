package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MilestoneConfigRequest {

    private Long id; // If editing

    @NotNull(message = "Academic year ID is required")
    private Long academicYearId;

    private int milestoneOrder;

    @NotBlank(message = "Milestone title is required")
    private String title;

    private String description;
    private int defaultDeadlineDays = 14;
    private boolean required = true;
    private boolean active = true;

    public MilestoneConfigRequest() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAcademicYearId() {
        return academicYearId;
    }

    public void setAcademicYearId(Long academicYearId) {
        this.academicYearId = academicYearId;
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
