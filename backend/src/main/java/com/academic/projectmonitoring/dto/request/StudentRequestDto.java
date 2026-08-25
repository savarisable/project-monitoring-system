package com.academic.projectmonitoring.dto.request;

import com.academic.projectmonitoring.entity.enums.PredefinedQuestion;
import jakarta.validation.constraints.NotNull;

public class StudentRequestDto {

    @NotNull(message = "Predefined question must be selected")
    private PredefinedQuestion predefinedQuestion;

    private String additionalNote;

    public StudentRequestDto() {}

    public StudentRequestDto(PredefinedQuestion predefinedQuestion, String additionalNote) {
        this.predefinedQuestion = predefinedQuestion;
        this.additionalNote = additionalNote;
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
}
