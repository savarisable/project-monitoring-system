package com.academic.projectmonitoring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project_diary_entries")
public class ProjectDiaryEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private ProjectGroup group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "guide_id", nullable = false)
    private Guide guide;

    @Column(name = "meeting_date", nullable = false)
    private LocalDate meetingDate;

    @Column(name = "meeting_time")
    private LocalTime meetingTime;

    @Column(length = 150)
    private String venue;

    @Column(name = "discussion_points", columnDefinition = "TEXT", nullable = false)
    private String discussionPoints;

    @Column(name = "guidance_given", columnDefinition = "TEXT")
    private String guidanceGiven;

    @Column(name = "target_for_next_meeting", columnDefinition = "TEXT")
    private String targetForNextMeeting;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "diaryEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DiaryAttendance> attendances = new ArrayList<>();

    public ProjectDiaryEntry() {}

    public ProjectDiaryEntry(ProjectGroup group, Project project, Guide guide, LocalDate meetingDate, LocalTime meetingTime, String venue, String discussionPoints, String guidanceGiven, String targetForNextMeeting) {
        this.group = group;
        this.project = project;
        this.guide = guide;
        this.meetingDate = meetingDate;
        this.meetingTime = meetingTime;
        this.venue = venue;
        this.discussionPoints = discussionPoints;
        this.guidanceGiven = guidanceGiven;
        this.targetForNextMeeting = targetForNextMeeting;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProjectGroup getGroup() {
        return group;
    }

    public void setGroup(ProjectGroup group) {
        this.group = group;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Guide getGuide() {
        return guide;
    }

    public void setGuide(Guide guide) {
        this.guide = guide;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<DiaryAttendance> getAttendances() {
        return attendances;
    }

    public void setAttendances(List<DiaryAttendance> attendances) {
        this.attendances = attendances;
    }
}
