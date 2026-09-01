package com.academic.projectmonitoring.dto.response;

import com.academic.projectmonitoring.entity.enums.PredefinedQuestion;
import com.academic.projectmonitoring.entity.enums.StudentRequestStatus;
import java.time.LocalDateTime;

public class StudentRequestResponseDto {

    private Long id;
    private Long groupId;
    private String groupNumber;
    private Long studentId;
    private String studentName;
    private Long guideId;
    private String guideName;
    private PredefinedQuestion predefinedQuestion;
    private String questionLabel;
    private String additionalNote;
    private StudentRequestStatus status;
    private String guideResponse;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;

    public StudentRequestResponseDto() {}

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

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
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

    public PredefinedQuestion getPredefinedQuestion() {
        return predefinedQuestion;
    }

    public void setPredefinedQuestion(PredefinedQuestion predefinedQuestion) {
        this.predefinedQuestion = predefinedQuestion;
        this.questionLabel = predefinedQuestion != null ? predefinedQuestion.getDisplayLabel() : null;
    }

    public String getQuestionLabel() {
        return questionLabel;
    }

    public void setQuestionLabel(String questionLabel) {
        this.questionLabel = questionLabel;
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
