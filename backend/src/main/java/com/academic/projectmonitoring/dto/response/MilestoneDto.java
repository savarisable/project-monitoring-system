package com.academic.projectmonitoring.dto.response;

import com.academic.projectmonitoring.entity.enums.MilestoneStatus;
import com.academic.projectmonitoring.entity.enums.SubmissionStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class MilestoneDto {

    private Long id; // ProjectMilestone ID or Milestone ID
    private Long milestoneId;
    private Long projectId;
    private int order;
    private String title;
    private String description;
    private LocalDate deadline;
    private MilestoneStatus status;
    private boolean required;
    private boolean delayed;
    private LocalDateTime completedAt;
    private SubmissionDto submission;

    public MilestoneDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMilestoneId() {
        return milestoneId;
    }

    public void setMilestoneId(Long milestoneId) {
        this.milestoneId = milestoneId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
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

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public MilestoneStatus getStatus() {
        return status;
    }

    public void setStatus(MilestoneStatus status) {
        this.status = status;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public boolean isDelayed() {
        return delayed;
    }

    public void setDelayed(boolean delayed) {
        this.delayed = delayed;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public SubmissionDto getSubmission() {
        return submission;
    }

    public void setSubmission(SubmissionDto submission) {
        this.submission = submission;
    }
}
