package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class EvaluatePresentationRequest {

    @NotNull(message = "Marks obtained is required")
    @DecimalMin(value = "0.00", message = "Marks cannot be negative")
    private BigDecimal marksObtained;

    private BigDecimal maxMarks = new BigDecimal("50.00");
    private String remarks;
    private String attendanceStatus = "PRESENT";

    public EvaluatePresentationRequest() {}

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
}
