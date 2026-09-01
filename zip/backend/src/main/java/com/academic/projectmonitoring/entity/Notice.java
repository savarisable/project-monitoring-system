package com.academic.projectmonitoring.entity;

import com.academic.projectmonitoring.entity.enums.NoticePriority;
import com.academic.projectmonitoring.entity.enums.NoticeTarget;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private NoticePriority priority = NoticePriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_role", length = 50, nullable = false)
    private NoticeTarget targetRole = NoticeTarget.ALL;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "target_group_id")
    private ProjectGroup targetGroup;

    @Column(name = "from_date", nullable = false)
    private LocalDate fromDate;

    @Column(name = "to_date", nullable = false)
    private LocalDate toDate;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    public Notice() {}

    public Notice(String title, String description, NoticePriority priority, NoticeTarget targetRole,
                  ProjectGroup targetGroup, LocalDate fromDate, LocalDate toDate, User createdBy) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.targetRole = targetRole;
        this.targetGroup = targetGroup;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.createdBy = createdBy;
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

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

    public ProjectGroup getTargetGroup() {
        return targetGroup;
    }

    public void setTargetGroup(ProjectGroup targetGroup) {
        this.targetGroup = targetGroup;
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
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
