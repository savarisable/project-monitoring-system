package com.academic.projectmonitoring.dto.response;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {

    // Metrics Cards
    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long delayedProjects;
    private long totalGuides;
    private long totalStudents;
    private long totalGroups;
    private long pendingSubmissions;
    private long pendingReviews;
    private long upcomingPresentationsCount;

    // Charts & Distributions
    private Map<String, Long> projectStatusDistribution;
    private Map<String, Long> guideWorkloadDistribution;
    private Map<String, Long> milestoneCompletionDistribution;

    // Recent items
    private List<ProjectDto> recentProjects;
    private List<SubmissionDto> pendingSubmissionsList;
    private List<PresentationDto> upcomingPresentations;
    private List<NoticeDto> activeNotices;

    public DashboardStatsDto() {}

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
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

    public long getDelayedProjects() {
        return delayedProjects;
    }

    public void setDelayedProjects(long delayedProjects) {
        this.delayedProjects = delayedProjects;
    }

    public long getTotalGuides() {
        return totalGuides;
    }

    public void setTotalGuides(long totalGuides) {
        this.totalGuides = totalGuides;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalGroups() {
        return totalGroups;
    }

    public void setTotalGroups(long totalGroups) {
        this.totalGroups = totalGroups;
    }

    public long getPendingSubmissions() {
        return pendingSubmissions;
    }

    public void setPendingSubmissions(long pendingSubmissions) {
        this.pendingSubmissions = pendingSubmissions;
    }

    public long getPendingReviews() {
        return pendingReviews;
    }

    public void setPendingReviews(long pendingReviews) {
        this.pendingReviews = pendingReviews;
    }

    public long getUpcomingPresentationsCount() {
        return upcomingPresentationsCount;
    }

    public void setUpcomingPresentationsCount(long upcomingPresentationsCount) {
        this.upcomingPresentationsCount = upcomingPresentationsCount;
    }

    public Map<String, Long> getProjectStatusDistribution() {
        return projectStatusDistribution;
    }

    public void setProjectStatusDistribution(Map<String, Long> projectStatusDistribution) {
        this.projectStatusDistribution = projectStatusDistribution;
    }

    public Map<String, Long> getGuideWorkloadDistribution() {
        return guideWorkloadDistribution;
    }

    public void setGuideWorkloadDistribution(Map<String, Long> guideWorkloadDistribution) {
        this.guideWorkloadDistribution = guideWorkloadDistribution;
    }

    public Map<String, Long> getMilestoneCompletionDistribution() {
        return milestoneCompletionDistribution;
    }

    public void setMilestoneCompletionDistribution(Map<String, Long> milestoneCompletionDistribution) {
        this.milestoneCompletionDistribution = milestoneCompletionDistribution;
    }

    public List<ProjectDto> getRecentProjects() {
        return recentProjects;
    }

    public void setRecentProjects(List<ProjectDto> recentProjects) {
        this.recentProjects = recentProjects;
    }

    public List<SubmissionDto> getPendingSubmissionsList() {
        return pendingSubmissionsList;
    }

    public void setPendingSubmissionsList(List<SubmissionDto> pendingSubmissionsList) {
        this.pendingSubmissionsList = pendingSubmissionsList;
    }

    public List<PresentationDto> getUpcomingPresentations() {
        return upcomingPresentations;
    }

    public void setUpcomingPresentations(List<PresentationDto> upcomingPresentations) {
        this.upcomingPresentations = upcomingPresentations;
    }

    public List<NoticeDto> getActiveNotices() {
        return activeNotices;
    }

    public void setActiveNotices(List<NoticeDto> activeNotices) {
        this.activeNotices = activeNotices;
    }
}
