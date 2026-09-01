package com.academic.projectmonitoring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "diary_attendances")
public class DiaryAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "diary_entry_id", nullable = false)
    private ProjectDiaryEntry diaryEntry;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private boolean present = true;

    @Column(name = "work_summary", columnDefinition = "TEXT")
    private String workSummary;

    @Column(name = "remarks", length = 255)
    private String remarks;

    public DiaryAttendance() {}

    public DiaryAttendance(ProjectDiaryEntry diaryEntry, Student student, boolean present, String workSummary, String remarks) {
        this.diaryEntry = diaryEntry;
        this.student = student;
        this.present = present;
        this.workSummary = workSummary;
        this.remarks = remarks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProjectDiaryEntry getDiaryEntry() {
        return diaryEntry;
    }

    public void setDiaryEntry(ProjectDiaryEntry diaryEntry) {
        this.diaryEntry = diaryEntry;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
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
