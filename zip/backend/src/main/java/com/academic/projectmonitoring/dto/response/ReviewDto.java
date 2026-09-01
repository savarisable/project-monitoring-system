package com.academic.projectmonitoring.dto.response;

import java.time.LocalDateTime;

public class ReviewDto {

    private Long id;
    private Long submissionVersionId;
    private Long submissionId;
    private Long guideId;
    private String guideName;
    private String verdict;
    private Long predefinedFeedbackId;
    private String predefinedFeedbackCode;
    private String predefinedFeedbackTitle;
    private String predefinedFeedbackText;
    private String customRemarks;
    private LocalDateTime reviewedAt;

    public ReviewDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSubmissionVersionId() {
        return submissionVersionId;
    }

    public void setSubmissionVersionId(Long submissionVersionId) {
        this.submissionVersionId = submissionVersionId;
    }

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public Long getGuideId() {
        return guideId;
    }

    public void setGuideId(Long guideId) {
        this.guideId = guideId;
    }

    public String getGuideName() {
        return guideName;
    }

    public void setGuideName(String guideName) {
        this.guideName = guideName;
    }

    public String getVerdict() {
        return verdict;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    public Long getPredefinedFeedbackId() {
        return predefinedFeedbackId;
    }

    public void setPredefinedFeedbackId(Long predefinedFeedbackId) {
        this.predefinedFeedbackId = predefinedFeedbackId;
    }

    public String getPredefinedFeedbackCode() {
        return predefinedFeedbackCode;
    }

    public void setPredefinedFeedbackCode(String predefinedFeedbackCode) {
        this.predefinedFeedbackCode = predefinedFeedbackCode;
    }

    public String getPredefinedFeedbackTitle() {
        return predefinedFeedbackTitle;
    }

    public void setPredefinedFeedbackTitle(String predefinedFeedbackTitle) {
        this.predefinedFeedbackTitle = predefinedFeedbackTitle;
    }

    public String getPredefinedFeedbackText() {
        return predefinedFeedbackText;
    }

    public void setPredefinedFeedbackText(String predefinedFeedbackText) {
        this.predefinedFeedbackText = predefinedFeedbackText;
    }

    public String getCustomRemarks() {
        return customRemarks;
    }

    public void setCustomRemarks(String customRemarks) {
        this.customRemarks = customRemarks;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}
