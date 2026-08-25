package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.NotNull;

public class MarkOfflineSubmissionRequest {

    @NotNull(message = "Project milestone ID is required")
    private Long projectMilestoneId;

    private String notes;

    public MarkOfflineSubmissionRequest() {}

    public MarkOfflineSubmissionRequest(Long projectMilestoneId, String notes) {
        this.projectMilestoneId = projectMilestoneId;
        this.notes = notes;
    }

    public Long getProjectMilestoneId() {
        return projectMilestoneId;
    }

    public void setProjectMilestoneId(Long projectMilestoneId) {
        this.projectMilestoneId = projectMilestoneId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
