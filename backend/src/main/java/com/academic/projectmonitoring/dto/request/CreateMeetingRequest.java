package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateMeetingRequest {

    @NotNull(message = "Target group ID is required")
    private Long groupId;

    @NotBlank(message = "Meeting title is required")
    private String title;

    @NotNull(message = "Meeting date is required")
    private LocalDate meetingDate;

    @NotBlank(message = "Meeting time is required (e.g. 11:30 AM)")
    private String meetingTime;

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    public CreateMeetingRequest() {}

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getMeetingDate() {
        return meetingDate;
    }

    public void setMeetingDate(LocalDate meetingDate) {
        this.meetingDate = meetingDate;
    }

    public String getMeetingTime() {
        return meetingTime;
    }

    public void setMeetingTime(String meetingTime) {
        this.meetingTime = meetingTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
}
