package com.academic.projectmonitoring.dto.response;

import com.academic.projectmonitoring.entity.enums.ProjectStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ProjectDto {

    private Long id;
    private Long groupId;
    private String groupNumber;
    private Long academicYearId;
    private String academicYearName;
    private String title;
    private String projectAbstract;
    private String domain;
    private String technologies;
    private LocalDate startDate;
    private LocalDate expectedEndDate;
    private ProjectStatus status;
    private double progressPercentage;
    private int completedMilestonesCount;
    private int totalMilestonesCount;
    private String currentStage;
    private LocalDate nextDeadline;
    private GuideDto guide;
    private List<StudentDto> members;
    private List<MilestoneDto> milestones;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getProjectAbstract() {
        return projectAbstract;
    }

    public void setProjectAbstract(String projectAbstract) {
        this.projectAbstract = projectAbstract;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getExpectedEndDate() {
        return expectedEndDate;
    }

    public void setExpectedEndDate(LocalDate expectedEndDate) {
        this.expectedEndDate = expectedEndDate;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public int getCompletedMilestonesCount() {
        return completedMilestonesCount;
    }

    public void setCompletedMilestonesCount(int completedMilestonesCount) {
        this.completedMilestonesCount = completedMilestonesCount;
    }

    public int getTotalMilestonesCount() {
        return totalMilestonesCount;
    }

    public void setTotalMilestonesCount(int totalMilestonesCount) {
        this.totalMilestonesCount = totalMilestonesCount;
    }

    public String getCurrentStage() {
        return currentStage;
    }

    public void setCurrentStage(String currentStage) {
        this.currentStage = currentStage;
    }

    public LocalDate getNextDeadline() {
        return nextDeadline;
    }

    public void setNextDeadline(LocalDate nextDeadline) {
        this.nextDeadline = nextDeadline;
    }

    public GuideDto getGuide() {
        return guide;
    }

    public void setGuide(GuideDto guide) {
        this.guide = guide;
    }

    public List<StudentDto> getMembers() {
        return members;
    }

    public void setMembers(List<StudentDto> members) {
        this.members = members;
    }

    public List<MilestoneDto> getMilestones() {
        return milestones;
    }

    public void setMilestones(List<MilestoneDto> milestones) {
        this.milestones = milestones;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
