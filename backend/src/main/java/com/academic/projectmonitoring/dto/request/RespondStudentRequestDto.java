package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.NotBlank;

public class RespondStudentRequestDto {

    @NotBlank(message = "Response message is required")
    private String response;

    public RespondStudentRequestDto() {}

    public RespondStudentRequestDto(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}
