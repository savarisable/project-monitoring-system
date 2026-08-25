package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.NotNull;

public class AllocateGuideRequest {

    @NotNull(message = "Group ID is required")
    private Long groupId;

    @NotNull(message = "Guide ID is required")
    private Long guideId;

    public AllocateGuideRequest() {}

    public AllocateGuideRequest(Long groupId, Long guideId) {
        this.groupId = groupId;
        this.guideId = guideId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getGuideId() {
        return guideId;
    }

    public void setGuideId(Long guideId) {
        this.guideId = guideId;
    }
}
