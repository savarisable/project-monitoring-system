package com.academic.projectmonitoring.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class StudentWorkLogRequest {

    @NotNull(message = "Log date is required")
    private LocalDate logDate;

    @NotBlank(message = "Module / Task name is required")
    private String moduleName;

    @NotBlank(message = "Tasks accomplished description is required")
    private String tasksAccomplished;

    private Double hoursSpent;

    private String challengesFaced;

    private String nextPlans;

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public String getTasksAccomplished() {
        return tasksAccomplished;
    }

    public void setTasksAccomplished(String tasksAccomplished) {
        this.tasksAccomplished = tasksAccomplished;
    }

    public Double getHoursSpent() {
        return hoursSpent;
    }

    public void setHoursSpent(Double hoursSpent) {
        this.hoursSpent = hoursSpent;
    }

    public String getChallengesFaced() {
        return challengesFaced;
    }

    public void setChallengesFaced(String challengesFaced) {
        this.challengesFaced = challengesFaced;
    }

    public String getNextPlans() {
        return nextPlans;
    }

    public void setNextPlans(String nextPlans) {
        this.nextPlans = nextPlans;
    }
}
