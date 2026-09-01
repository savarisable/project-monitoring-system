package com.academic.projectmonitoring.dto.response;

import com.academic.projectmonitoring.entity.enums.SubmissionMode;
import com.academic.projectmonitoring.entity.enums.SubmissionStatus;
import java.time.LocalDateTime;
import java.util.List;

public class SubmissionDto {

    private Long id;
    private Long projectMilestoneId;
    private String milestoneTitle;
    private Long projectId;
    private String projectTitle;
    private Long groupId;
    private String groupNumber;
    private String submissionType;
    private int currentVersion;
    private SubmissionStatus status;
    private LocalDateTime lastSubmittedAt;
    private List<SubmissionVersionDto> versions;
    private List<ReviewDto> reviews;

    public SubmissionDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectMilestoneId() {
        return projectMilestoneId;
    }

    public void setProjectMilestoneId(Long projectMilestoneId) {
        this.projectMilestoneId = projectMilestoneId;
    }

    public String getMilestoneTitle() {
        return milestoneTitle;
    }

    public void setMilestoneTitle(String milestoneTitle) {
        this.milestoneTitle = milestoneTitle;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupNumber() {
        return groupNumber;
    }

    public void setGroupNumber(String groupNumber) {
        this.groupNumber = groupNumber;
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

    public List<SubmissionVersionDto> getVersions() {
        return versions;
    }

    public void setVersions(List<SubmissionVersionDto> versions) {
        this.versions = versions;
    }

    public List<ReviewDto> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewDto> reviews) {
        this.reviews = reviews;
    }

    public static class SubmissionVersionDto {
        private Long id;
        private int versionNumber;
        private SubmissionMode submissionMode;
        private String fileName;
        private Long fileSize;
        private String studentNotes;
        private Long submittedById;
        private String submittedByName;
        private LocalDateTime submittedAt;
        private ReviewDto review;

        public SubmissionVersionDto() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public int getVersionNumber() {
            return versionNumber;
        }

        public void setVersionNumber(int versionNumber) {
            this.versionNumber = versionNumber;
        }

        public SubmissionMode getSubmissionMode() {
            return submissionMode;
        }

        public void setSubmissionMode(SubmissionMode submissionMode) {
            this.submissionMode = submissionMode;
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public Long getFileSize() {
            return fileSize;
        }

        public void setFileSize(Long fileSize) {
            this.fileSize = fileSize;
        }

        public String getStudentNotes() {
            return studentNotes;
        }

        public void setStudentNotes(String studentNotes) {
            this.studentNotes = studentNotes;
        }

        public Long getSubmittedById() {
            return submittedById;
        }

        public void setSubmittedById(Long submittedById) {
            this.submittedById = submittedById;
        }

        public String getSubmittedByName() {
            return submittedByName;
        }

        public void setSubmittedByName(String submittedByName) {
            this.submittedByName = submittedByName;
        }

        public LocalDateTime getSubmittedAt() {
            return submittedAt;
        }

        public void setSubmittedAt(LocalDateTime submittedAt) {
            this.submittedAt = submittedAt;
        }

        public ReviewDto getReview() {
            return review;
        }

        public void setReview(ReviewDto review) {
            this.review = review;
        }
    }
}
