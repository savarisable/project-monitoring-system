package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.NotNull;

public class SubmitDocumentRequest {

    @NotNull(message = "Project milestone ID is required")
    private Long projectMilestoneId;

    private String studentNotes;

    public SubmitDocumentRequest() {}

    public SubmitDocumentRequest(Long projectMilestoneId, String studentNotes) {
        this.projectMilestoneId = projectMilestoneId;
        this.studentNotes = studentNotes;
    }

    public Long getProjectMilestoneId() {
        return projectMilestoneId;
    }

    public void setProjectMilestoneId(Long projectMilestoneId) {
        this.projectMilestoneId = projectMilestoneId;
    }

    public String getStudentNotes() {
        return studentNotes;
    }

    public void setStudentNotes(String studentNotes) {
        this.studentNotes = studentNotes;
    }
}
