package com.academic.projectmonitoring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_version_id", nullable = false, unique = true)
    private SubmissionVersion submissionVersion;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "guide_id", nullable = false)
    private Guide guide;

    @Column(nullable = false, length = 50)
    private String verdict; // VERIFIED, CORRECTION_REQUIRED

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "predefined_feedback_id")
    private FeedbackTemplate predefinedFeedback;

    @Column(name = "predefined_feedback_text", columnDefinition = "TEXT")
    private String predefinedFeedbackText;

    @Column(name = "custom_remarks", columnDefinition = "TEXT")
    private String customRemarks;

    @Column(name = "reviewed_at", updatable = false)
    private LocalDateTime reviewedAt = LocalDateTime.now();

    public Review() {}

    public Review(SubmissionVersion submissionVersion, Submission submission, Guide guide,
                  String verdict, FeedbackTemplate predefinedFeedback, String predefinedFeedbackText, String customRemarks) {
        this.submissionVersion = submissionVersion;
        this.submission = submission;
        this.guide = guide;
        this.verdict = verdict;
        this.predefinedFeedback = predefinedFeedback;
        this.predefinedFeedbackText = predefinedFeedbackText;
        this.customRemarks = customRemarks;
        this.reviewedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SubmissionVersion getSubmissionVersion() {
        return submissionVersion;
    }

    public void setSubmissionVersion(SubmissionVersion submissionVersion) {
        this.submissionVersion = submissionVersion;
    }

    public Submission getSubmission() {
        return submission;
    }

    public void setSubmission(Submission submission) {
        this.submission = submission;
    }

    public Guide getGuide() {
        return guide;
    }

    public void setGuide(Guide guide) {
        this.guide = guide;
    }

    public String getVerdict() {
        return verdict;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    public FeedbackTemplate getPredefinedFeedback() {
        return predefinedFeedback;
    }

    public void setPredefinedFeedback(FeedbackTemplate predefinedFeedback) {
        this.predefinedFeedback = predefinedFeedback;
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
