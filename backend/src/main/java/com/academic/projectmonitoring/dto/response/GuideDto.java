package com.academic.projectmonitoring.dto.response;

import java.util.List;

public class GuideDto {

    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String department;
    private String designation;
    private String specialization;
    private int maxGroupsCapacity;
    private long allocatedGroupsCount;
    private List<GroupSummaryDto> allocatedGroups;

    public GuideDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getMaxGroupsCapacity() {
        return maxGroupsCapacity;
    }

    public void setMaxGroupsCapacity(int maxGroupsCapacity) {
        this.maxGroupsCapacity = maxGroupsCapacity;
    }

    public long getAllocatedGroupsCount() {
        return allocatedGroupsCount;
    }

    public void setAllocatedGroupsCount(long allocatedGroupsCount) {
        this.allocatedGroupsCount = allocatedGroupsCount;
    }

    public List<GroupSummaryDto> getAllocatedGroups() {
        return allocatedGroups;
    }

    public void setAllocatedGroups(List<GroupSummaryDto> allocatedGroups) {
        this.allocatedGroups = allocatedGroups;
    }

    public static class GroupSummaryDto {
        private Long groupId;
        private String groupNumber;
        private String projectTitle;
        private String projectStatus;

        public GroupSummaryDto() {}

        public GroupSummaryDto(Long groupId, String groupNumber, String projectTitle, String projectStatus) {
            this.groupId = groupId;
            this.groupNumber = groupNumber;
            this.projectTitle = projectTitle;
            this.projectStatus = projectStatus;
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

        public String getProjectTitle() {
            return projectTitle;
        }

        public void setProjectTitle(String projectTitle) {
            this.projectTitle = projectTitle;
        }

        public String getProjectStatus() {
            return projectStatus;
        }

        public void setProjectStatus(String projectStatus) {
            this.projectStatus = projectStatus;
        }
    }
}
