package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class DiaryEntryRequest {

    @NotNull(message = "Group ID is required")
    private Long groupId;

    private Long projectId;

    @NotNull(message = "Meeting date is required")
    private LocalDate meetingDate;

    private LocalTime meetingTime;

    private String venue;

    @NotBlank(message = "Discussion points cannot be blank")
    private String discussionPoints;

    private String guidanceGiven;

    private String targetForNextMeeting;

    private List<StudentAttendanceItem> attendances;

    public static class StudentAttendanceItem {
        private Long studentId;
        private boolean present;
        private String workSummary;
        private String remarks;

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public boolean isPresent() {
            return present;
        }

        public void setPresent(boolean present) {
            this.present = present;
        }

        public String getWorkSummary() {
            return workSummary;
        }

        public void setWorkSummary(String workSummary) {
            this.workSummary = workSummary;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
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

    public List<StudentAttendanceItem> getAttendances() {
        return attendances;
    }

    public void setAttendances(List<StudentAttendanceItem> attendances) {
        this.attendances = attendances;
    }
}
