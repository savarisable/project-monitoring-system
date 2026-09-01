package com.academic.projectmonitoring.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class ProjectDiaryDto {
    private Long id;
    private Long groupId;
    private String groupNumber;
    private Long projectId;
    private String projectTitle;
    private Long guideId;
    private String guideName;
    private LocalDate meetingDate;
    private LocalTime meetingTime;
    private String venue;
    private String discussionPoints;
    private String guidanceGiven;
    private String targetForNextMeeting;
    private LocalDateTime createdAt;
    private List<DiaryAttendanceDto> attendances = new ArrayList<>();

    public ProjectDiaryDto() {}

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

    public LocalDate getMeetingDate() {
        return meetingDate;
    }

    public void setMeetingDate(LocalDate meetingDate) {
        this.meetingDate = meetingDate;
    }

    public LocalTime getMeetingTime() {
        return meetingTime;
    }

    public void setMeetingTime(LocalTime meetingTime) {
        this.meetingTime = meetingTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getDiscussionPoints() {
        return discussionPoints;
    }

    public void setDiscussionPoints(String discussionPoints) {
        this.discussionPoints = discussionPoints;
    }

    public String getGuidanceGiven() {
        return guidanceGiven;
    }

    public void setGuidanceGiven(String guidanceGiven) {
        this.guidanceGiven = guidanceGiven;
    }

    public String getTargetForNextMeeting() {
        return targetForNextMeeting;
    }

    public void setTargetForNextMeeting(String targetForNextMeeting) {
        this.targetForNextMeeting = targetForNextMeeting;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<DiaryAttendanceDto> getAttendances() {
        return attendances;
    }

    public void setAttendances(List<DiaryAttendanceDto> attendances) {
        this.attendances = attendances;
    }
}
