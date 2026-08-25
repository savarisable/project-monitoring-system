package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateGroupRequest {

    @NotBlank(message = "Group number is required (e.g. Group 01)")
    private String groupNumber;

    @NotNull(message = "Academic year is required")
    private Long academicYearId;

    @NotEmpty(message = "At least one student must be added to the group")
    private List<Long> studentIds;

    private Long leaderStudentId;

    private Long guideId; // Optional immediate guide allocation

    public CreateGroupRequest() {}

    public String getGroupNumber() {
        return groupNumber;
    }

    public void setGroupNumber(String groupNumber) {
        this.groupNumber = groupNumber;
    }

    public Long getAcademicYearId() {
        return academicYearId;
    }

    public void setAcademicYearId(Long academicYearId) {
        this.academicYearId = academicYearId;
    }

    public List<Long> getStudentIds() {
        return studentIds;
    }

    public void setStudentIds(List<Long> studentIds) {
        this.studentIds = studentIds;
    }

    public Long getLeaderStudentId() {
        return leaderStudentId;
    }

    public void setLeaderStudentId(Long leaderStudentId) {
        this.leaderStudentId = leaderStudentId;
    }

    public Long getGuideId() {
        return guideId;
    }

    public void setGuideId(Long guideId) {
        this.guideId = guideId;
    }
}
