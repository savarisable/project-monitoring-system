package com.academic.projectmonitoring.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class GroupDto {

    private Long id;
    private String groupNumber;
    private Long academicYearId;
    private String academicYearName;
    private LocalDateTime createdAt;
    private GuideDto guide;
    private List<StudentDto> members;
    private ProjectDto project;

    public GroupDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getAcademicYearName() {
        return academicYearName;
    }

    public void setAcademicYearName(String academicYearName) {
        this.academicYearName = academicYearName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public GuideDto getGuide() {
        return guide;
    }

    public void setGuide(GuideDto guide) {
        this.guide = guide;
    }

    public List<StudentDto> getMembers() {
        return members;
    }

    public void setMembers(List<StudentDto> members) {
        this.members = members;
    }

    public ProjectDto getProject() {
        return project;
    }

    public void setProject(ProjectDto project) {
        this.project = project;
    }
}
