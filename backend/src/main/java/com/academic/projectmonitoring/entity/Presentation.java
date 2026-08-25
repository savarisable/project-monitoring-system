package com.academic.projectmonitoring.entity;

import com.academic.projectmonitoring.entity.enums.PresentationStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "presentations")
public class Presentation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "presentation_number", nullable = false)
    private int presentationNumber;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(length = 150)
    private String venue;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private PresentationStatus status = PresentationStatus.SCHEDULED;

    @OneToOne(mappedBy = "presentation", cascade = CascadeType.ALL)
    private PresentationEvaluation evaluation;

    public Presentation() {}

    public Presentation(AcademicYear academicYear, Project project, int presentationNumber, String title,
                        LocalDate scheduledDate, LocalTime startTime, LocalTime endTime, String venue, String description) {
        this.academicYear = academicYear;
        this.project = project;
        this.presentationNumber = presentationNumber;
        this.title = title;
        this.scheduledDate = scheduledDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.venue = venue;
        this.description = description;
        this.status = PresentationStatus.SCHEDULED;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AcademicYear getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(AcademicYear academicYear) {
        this.academicYear = academicYear;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public int getPresentationNumber() {
        return presentationNumber;
    }

    public void setPresentationNumber(int presentationNumber) {
        this.presentationNumber = presentationNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public PresentationStatus getStatus() {
        return status;
    }

    public void setStatus(PresentationStatus status) {
        this.status = status;
    }

    public PresentationEvaluation getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(PresentationEvaluation evaluation) {
        this.evaluation = evaluation;
    }
}
