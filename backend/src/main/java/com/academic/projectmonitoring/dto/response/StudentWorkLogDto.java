package com.academic.projectmonitoring.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class StudentWorkLogDto {

    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long groupId;
    private String groupNumber;
    private Long projectId;
    private String projectTitle;
    private LocalDate logDate;
    private String moduleName;
    private String tasksAccomplished;
    private Double hoursSpent;
    private String challengesFaced;
    private String nextPlans;
    private boolean verifiedByGuide;
    private String guideRemark;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
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

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public String getTasksAccomplished() {
        return tasksAccomplished;
    }

    public void setTasksAccomplished(String tasksAccomplished) {
        this.tasksAccomplished = tasksAccomplished;
    }

    public Double getHoursSpent() {
        return hoursSpent;
    }

    public void setHoursSpent(Double hoursSpent) {
        this.hoursSpent = hoursSpent;
    }

    public String getChallengesFaced() {
        return challengesFaced;
    }

    public void setChallengesFaced(String challengesFaced) {
        this.challengesFaced = challengesFaced;
    }

    public String getNextPlans() {
        return nextPlans;
    }

    public void setNextPlans(String nextPlans) {
        this.nextPlans = nextPlans;
    }

    public boolean isVerifiedByGuide() {
        return verifiedByGuide;
    }

    public void setVerifiedByGuide(boolean verifiedByGuide) {
        this.verifiedByGuide = verifiedByGuide;
    }

    public String getGuideRemark() {
        return guideRemark;
    }

    public void setGuideRemark(String guideRemark) {
        this.guideRemark = guideRemark;
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
