package com.academic.projectmonitoring.entity;

import com.academic.projectmonitoring.entity.enums.SubmissionStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_milestone_id", nullable = false)
    private ProjectMilestone projectMilestone;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private ProjectGroup group;

    @Column(name = "submission_type", nullable = false, length = 100)
    private String submissionType;

    @Column(name = "current_version", nullable = false)
    private int currentVersion = 1;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private SubmissionStatus status = SubmissionStatus.NOT_SUBMITTED;

    @Column(name = "last_submitted_at")
    private LocalDateTime lastSubmittedAt;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("versionNumber DESC")
    private List<SubmissionVersion> versions = new ArrayList<>();

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("reviewedAt DESC")
    private List<Review> reviews = new ArrayList<>();

    public Submission() {}

    public Submission(ProjectMilestone projectMilestone, Project project, ProjectGroup group, String submissionType) {
        this.projectMilestone = projectMilestone;
        this.project = project;
        this.group = group;
        this.submissionType = submissionType;
        this.currentVersion = 1;
        this.status = SubmissionStatus.NOT_SUBMITTED;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProjectMilestone getProjectMilestone() {
        return projectMilestone;
    }

    public void setProjectMilestone(ProjectMilestone projectMilestone) {
        this.projectMilestone = projectMilestone;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public ProjectGroup getGroup() {
        return group;
    }

    public void setGroup(ProjectGroup group) {
        this.group = group;
    }

    public String getSubmissionType() {
        return submissionType;
    }

    public void setSubmissionType(String submissionType) {
        this.submissionType = submissionType;
    }

    public int getCurrentVersion() {
        return currentVersion;
    }

    public void setCurrentVersion(int currentVersion) {
        this.currentVersion = currentVersion;
    }

    public SubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }

    public LocalDateTime getLastSubmittedAt() {
        return lastSubmittedAt;
    }

    public void setLastSubmittedAt(LocalDateTime lastSubmittedAt) {
        this.lastSubmittedAt = lastSubmittedAt;
    }

    public List<SubmissionVersion> getVersions() {
        return versions;
    }

    public void setVersions(List<SubmissionVersion> versions) {
        this.versions = versions;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }
}
