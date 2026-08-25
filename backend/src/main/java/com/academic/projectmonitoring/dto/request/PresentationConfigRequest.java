package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class PresentationConfigRequest {

    @NotNull(message = "Academic year ID is required")
    private Long academicYearId;

    @Min(value = 1, message = "Presentation count must be at least 1")
    private int presentationCount = 3;

    public PresentationConfigRequest() {}

    public PresentationConfigRequest(Long academicYearId, int presentationCount) {
        this.academicYearId = academicYearId;
        this.presentationCount = presentationCount;
    }

    public Long getAcademicYearId() {
        return academicYearId;
    }

    public void setAcademicYearId(Long academicYearId) {
        this.academicYearId = academicYearId;
    }

    public int getPresentationCount() {
        return presentationCount;
    }

    public void setPresentationCount(int presentationCount) {
        this.presentationCount = presentationCount;
    }
}
