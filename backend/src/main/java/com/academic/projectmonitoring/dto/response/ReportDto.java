package com.academic.projectmonitoring.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ReportDto {

    private String reportType;
    private Long academicYearId;
    private String academicYearName;
    private LocalDateTime generatedAt = LocalDateTime.now();
    private List<ProjectProgressReportItem> projectProgressReport;
    private List<GuideReportItem> guideReport;
    private List<SubmissionReportItem> submissionReport;
    private List<PresentationMarksReportItem> marksReport;

    public ReportDto() {}

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public Long getAcademicYearId() {
        return academicYearId;
    }

    public void setAcademicYearId(Long academicYearId) {
        this.academicYearId = academicYearId;
    }

    public String getAcademicYearName() {
        return academicYearName;
    }

    public void setAcademicYearName(String academicYearName) {
        this.academicYearName = academicYearName;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public List<ProjectProgressReportItem> getProjectProgressReport() {
        return projectProgressReport;
    }

    public void setProjectProgressReport(List<ProjectProgressReportItem> projectProgressReport) {
        this.projectProgressReport = projectProgressReport;
    }

    public List<GuideReportItem> getGuideReport() {
        return guideReport;
    }

    public void setGuideReport(List<GuideReportItem> guideReport) {
        this.guideReport = guideReport;
    }

    public List<SubmissionReportItem> getSubmissionReport() {
        return submissionReport;
    }

    public void setSubmissionReport(List<SubmissionReportItem> submissionReport) {
        this.submissionReport = submissionReport;
    }

    public List<PresentationMarksReportItem> getMarksReport() {
        return marksReport;
    }

    public void setMarksReport(List<PresentationMarksReportItem> marksReport) {
        this.marksReport = marksReport;
    }

    public static class ProjectProgressReportItem {
        private Long projectId;
        private String groupNumber;
        private String projectTitle;
        private String domain;
        private String guideName;
        private String status;
        private double progressPercentage;
        private int completedMilestones;
        private int totalMilestones;
        private String currentStage;
        private boolean delayed;

        public ProjectProgressReportItem() {}

        public Long getProjectId() {
            return projectId;
        }

        public void setProjectId(Long projectId) {
            this.projectId = projectId;
        }

        public String getGroupNumber() {
            return groupNumber;
        }

        public void setGroupNumber(String groupNumber) {
            this.groupNumber = groupNumber;
        }

        public String getProjectTitle() {
            return projectTitle;
        }

        public void setProjectTitle(String projectTitle) {
            this.projectTitle = projectTitle;
        }

        public String getDomain() {
            return domain;
        }

        public void setDomain(String domain) {
            this.domain = domain;
        }

        public String getGuideName() {
            return guideName;
        }

        public void setGuideName(String guideName) {
            this.guideName = guideName;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public double getProgressPercentage() {
            return progressPercentage;
        }

        public void setProgressPercentage(double progressPercentage) {
            this.progressPercentage = progressPercentage;
        }

        public int getCompletedMilestones() {
            return completedMilestones;
        }

        public void setCompletedMilestones(int completedMilestones) {
            this.completedMilestones = completedMilestones;
        }

        public int getTotalMilestones() {
            return totalMilestones;
        }

        public void setTotalMilestones(int totalMilestones) {
            this.totalMilestones = totalMilestones;
        }

        public String getCurrentStage() {
            return currentStage;
        }

        public void setCurrentStage(String currentStage) {
            this.currentStage = currentStage;
        }

        public boolean isDelayed() {
            return delayed;
        }

        public void setDelayed(boolean delayed) {
            this.delayed = delayed;
        }
    }

    public static class GuideReportItem {
        private Long guideId;
        private String guideName;
        private String department;
        private String designation;
        private long assignedGroupsCount;
        private int maxCapacity;
        private long activeProjects;
        private long completedProjects;
        private long pendingReviews;

        public GuideReportItem() {}

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

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public String getDesignation() {
            return designation;
        }

        public void setDesignation(String designation) {
            this.designation = designation;
        }

        public long getAssignedGroupsCount() {
            return assignedGroupsCount;
        }

        public void setAssignedGroupsCount(long assignedGroupsCount) {
            this.assignedGroupsCount = assignedGroupsCount;
        }

        public int getMaxCapacity() {
            return maxCapacity;
        }

        public void setMaxCapacity(int maxCapacity) {
            this.maxCapacity = maxCapacity;
        }

        public long getActiveProjects() {
            return activeProjects;
        }

        public void setActiveProjects(long activeProjects) {
            this.activeProjects = activeProjects;
        }

        public long getCompletedProjects() {
            return completedProjects;
        }

        public void setCompletedProjects(long completedProjects) {
            this.completedProjects = completedProjects;
        }

        public long getPendingReviews() {
            return pendingReviews;
        }

        public void setPendingReviews(long pendingReviews) {
            this.pendingReviews = pendingReviews;
        }
    }

    public static class SubmissionReportItem {
        private Long submissionId;
        private String groupNumber;
        private String projectTitle;
        private String submissionType;
        private int currentVersion;
        private String status;
        private String guideName;
        private LocalDateTime lastSubmittedAt;
        private String lastVerdict;

        public SubmissionReportItem() {}

        public Long getSubmissionId() {
            return submissionId;
        }

        public void setSubmissionId(Long submissionId) {
            this.submissionId = submissionId;
        }

        public String getGroupNumber() {
            return groupNumber;
        }

        public void setGroupNumber(String groupNumber) {
            this.groupNumber = groupNumber;
        }

        public String getProjectTitle() {
            return projectTitle;
        }

        public void setProjectTitle(String projectTitle) {
            this.projectTitle = projectTitle;
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

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getGuideName() {
            return guideName;
        }

        public void setGuideName(String guideName) {
            this.guideName = guideName;
        }

        public LocalDateTime getLastSubmittedAt() {
            return lastSubmittedAt;
        }

        public void setLastSubmittedAt(LocalDateTime lastSubmittedAt) {
            this.lastSubmittedAt = lastSubmittedAt;
        }

        public String getLastVerdict() {
            return lastVerdict;
        }

        public void setLastVerdict(String lastVerdict) {
            this.lastVerdict = lastVerdict;
        }
    }

    public static class PresentationMarksReportItem {
        private Long presentationId;
        private String groupNumber;
        private String projectTitle;
        private int presentationNumber;
        private String presentationTitle;
        private LocalDate scheduledDate;
        private String guideName;
        private BigDecimal marksObtained;
        private BigDecimal maxMarks;
        private String attendanceStatus;
        private String status;

        public PresentationMarksReportItem() {}

        public Long getPresentationId() {
            return presentationId;
        }

        public void setPresentationId(Long presentationId) {
            this.presentationId = presentationId;
        }

        public String getGroupNumber() {
            return groupNumber;
        }

        public void setGroupNumber(String groupNumber) {
            this.groupNumber = groupNumber;
        }

        public String getProjectTitle() {
            return projectTitle;
        }

        public void setProjectTitle(String projectTitle) {
            this.projectTitle = projectTitle;
        }

        public int getPresentationNumber() {
            return presentationNumber;
        }

        public void setPresentationNumber(int presentationNumber) {
            this.presentationNumber = presentationNumber;
        }

        public String getPresentationTitle() {
            return presentationTitle;
        }

        public void setPresentationTitle(String presentationTitle) {
            this.presentationTitle = presentationTitle;
        }

        public LocalDate getScheduledDate() {
            return scheduledDate;
        }

        public void setScheduledDate(LocalDate scheduledDate) {
            this.scheduledDate = scheduledDate;
        }

        public String getGuideName() {
            return guideName;
        }

        public void setGuideName(String guideName) {
            this.guideName = guideName;
        }

        public BigDecimal getMarksObtained() {
            return marksObtained;
        }

        public void setMarksObtained(BigDecimal marksObtained) {
            this.marksObtained = marksObtained;
        }

        public BigDecimal getMaxMarks() {
            return maxMarks;
        }

        public void setMaxMarks(BigDecimal maxMarks) {
            this.maxMarks = maxMarks;
        }

        public String getAttendanceStatus() {
            return attendanceStatus;
        }

        public void setAttendanceStatus(String attendanceStatus) {
            this.attendanceStatus = attendanceStatus;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
