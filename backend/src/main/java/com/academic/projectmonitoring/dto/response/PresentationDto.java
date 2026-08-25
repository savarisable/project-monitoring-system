package com.academic.projectmonitoring.dto.response;

import com.academic.projectmonitoring.entity.enums.PresentationStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class PresentationDto {

    private Long id;
    private Long academicYearId;
    private Long projectId;
    private String projectTitle;
    private Long groupId;
    private String groupNumber;
    private int presentationNumber;
    private String title;
    private LocalDate scheduledDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String venue;
    private String description;
    private PresentationStatus status;
    private PresentationEvaluationDto evaluation;

    public PresentationDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAcademicYearId() {
        return academicYearId;
    }

    public void setAcademicYearId(Long academicYearId) {
        this.academicYearId = academicYearId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
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

    public PresentationEvaluationDto getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(PresentationEvaluationDto evaluation) {
        this.evaluation = evaluation;
    }

    public static class PresentationEvaluationDto {
        private Long id;
        private Long guideId;
        private String guideName;
        private BigDecimal marksObtained;
        private BigDecimal maxMarks;
        private String remarks;
        private String attendanceStatus;
        private LocalDateTime evaluatedAt;

        public PresentationEvaluationDto() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public BigDecimal getMarksObtained() {
            return marksObtained;
        }

        public void setMarksObtained(BigDecimal marksObtained) {
            this.marksObtained = marksObtained;
        }

        public BigDecimal getMaxMarks() {
            return maxMarks;
        }

        public void setMaxMarks(BigDecimal maxMarks) {
            this.maxMarks = maxMarks;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public String getAttendanceStatus() {
            return attendanceStatus;
        }

        public void setAttendanceStatus(String attendanceStatus) {
            this.attendanceStatus = attendanceStatus;
        }

        public LocalDateTime getEvaluatedAt() {
            return evaluatedAt;
        }

        public void setEvaluatedAt(LocalDateTime evaluatedAt) {
            this.evaluatedAt = evaluatedAt;
        }
    }
}
