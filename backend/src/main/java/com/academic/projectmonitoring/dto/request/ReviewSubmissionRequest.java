package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReviewSubmissionRequest {

    @NotNull(message = "Submission version ID is required")
    private Long submissionVersionId;

    @NotBlank(message = "Verdict is required (VERIFIED or CORRECTION_REQUIRED)")
    private String verdict; // VERIFIED, CORRECTION_REQUIRED

    private Long predefinedFeedbackId;
    private String predefinedFeedbackText;
    private String customRemarks;

    public ReviewSubmissionRequest() {}

    public Long getSubmissionVersionId() {
        return submissionVersionId;
    }

    public void setSubmissionVersionId(Long submissionVersionId) {
        this.submissionVersionId = submissionVersionId;
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
}
