package com.academic.projectmonitoring.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_work_logs")
public class StudentWorkLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private ProjectGroup group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "module_name", length = 150, nullable = false)
    private String moduleName;

    @Column(name = "tasks_accomplished", columnDefinition = "TEXT", nullable = false)
    private String tasksAccomplished;

    @Column(name = "hours_spent")
    private Double hoursSpent = 0.0;

    @Column(name = "challenges_faced", columnDefinition = "TEXT")
    private String challengesFaced;

    @Column(name = "next_plans", columnDefinition = "TEXT")
    private String nextPlans;

    @Column(name = "verified_by_guide")
    private boolean verifiedByGuide = false;

    @Column(name = "guide_remark", columnDefinition = "TEXT")
    private String guideRemark;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public StudentWorkLog() {}

    public StudentWorkLog(Student student, ProjectGroup group, Project project, LocalDate logDate, String moduleName, String tasksAccomplished, Double hoursSpent, String challengesFaced, String nextPlans) {
        this.student = student;
        this.group = group;
        this.project = project;
        this.logDate = logDate;
        this.moduleName = moduleName;
        this.tasksAccomplished = tasksAccomplished;
        this.hoursSpent = hoursSpent != null ? hoursSpent : 0.0;
        this.challengesFaced = challengesFaced;
        this.nextPlans = nextPlans;
        this.verifiedByGuide = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
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
