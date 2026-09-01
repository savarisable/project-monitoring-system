package com.academic.projectmonitoring.entity;

import com.academic.projectmonitoring.entity.enums.PredefinedQuestion;
import com.academic.projectmonitoring.entity.enums.StudentRequestStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_requests")
public class StudentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private ProjectGroup group;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "guide_id", nullable = false)
    private Guide guide;

    @Enumerated(EnumType.STRING)
    @Column(name = "predefined_question", length = 100, nullable = false)
    private PredefinedQuestion predefinedQuestion;

    @Column(name = "additional_note", columnDefinition = "TEXT")
    private String additionalNote;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private StudentRequestStatus status = StudentRequestStatus.PENDING;

    @Column(name = "guide_response", columnDefinition = "TEXT")
    private String guideResponse;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    public StudentRequest() {}

    public StudentRequest(ProjectGroup group, Student student, Guide guide,
                          PredefinedQuestion predefinedQuestion, String additionalNote) {
        this.group = group;
        this.student = student;
        this.guide = guide;
        this.predefinedQuestion = predefinedQuestion;
        this.additionalNote = additionalNote;
        this.status = StudentRequestStatus.PENDING;
        this.createdAt = LocalDateTime.now();
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

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Guide getGuide() {
        return guide;
    }

    public void setGuide(Guide guide) {
        this.guide = guide;
    }

    public PredefinedQuestion getPredefinedQuestion() {
        return predefinedQuestion;
    }

    public void setPredefinedQuestion(PredefinedQuestion predefinedQuestion) {
        this.predefinedQuestion = predefinedQuestion;
    }

    public String getAdditionalNote() {
        return additionalNote;
    }

    public void setAdditionalNote(String additionalNote) {
        this.additionalNote = additionalNote;
    }

    public StudentRequestStatus getStatus() {
        return status;
    }

    public void setStatus(StudentRequestStatus status) {
        this.status = status;
    }

    public String getGuideResponse() {
        return guideResponse;
    }

    public void setGuideResponse(String guideResponse) {
        this.guideResponse = guideResponse;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }
}
