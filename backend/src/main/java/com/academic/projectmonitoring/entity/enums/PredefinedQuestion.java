package com.academic.projectmonitoring.entity.enums;

public enum PredefinedQuestion {
    NEXT_MEETING("When is our next scheduled meeting?"),
    DISCUSS_PROJECT("Can we discuss our project / synopsis?"),
    SUBMISSION_QUESTION("When will our submitted report be reviewed / corrections discussed?"),
    NEXT_PRESENTATION("When is our next stage presentation scheduled?"),
    MEET_GUIDE("We request a short in-person discussion with the Guide."),
    NEED_EQUIPMENT_LAB("We require lab / hardware equipment access."),
    GENERAL_QUERY("General academic project query.");

    private final String displayLabel;

    PredefinedQuestion(String displayLabel) {
        this.displayLabel = displayLabel;
    }

    public String getDisplayLabel() {
        return displayLabel;
    }
}
