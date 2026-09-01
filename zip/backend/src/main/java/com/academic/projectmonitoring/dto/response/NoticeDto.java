package com.academic.projectmonitoring.dto.response;

import com.academic.projectmonitoring.entity.enums.NoticePriority;
import com.academic.projectmonitoring.entity.enums.NoticeTarget;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class NoticeDto {

    private Long id;
    private String title;
    private String description;
    private NoticePriority priority;
    private NoticeTarget targetRole;
    private Long targetGroupId;
    private String targetGroupNumber;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private boolean active;

    public NoticeDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public NoticePriority getPriority() {
        return priority;
    }

    public void setPriority(NoticePriority priority) {
        this.priority = priority;
    }

    public NoticeTarget getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(NoticeTarget targetRole) {
        this.targetRole = targetRole;
    }

    public Long getTargetGroupId() {
        return targetGroupId;
    }

    public void setTargetGroupId(Long targetGroupId) {
        this.targetGroupId = targetGroupId;
    }

    public String getTargetGroupNumber() {
        return targetGroupNumber;
    }

    public void setTargetGroupNumber(String targetGroupNumber) {
        this.targetGroupNumber = targetGroupNumber;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
