package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.entity.Project;
import com.academic.projectmonitoring.entity.ProjectMilestone;
import com.academic.projectmonitoring.entity.enums.MilestoneStatus;
import com.academic.projectmonitoring.entity.enums.ProjectStatus;
import com.academic.projectmonitoring.repository.ProjectMilestoneRepository;
import com.academic.projectmonitoring.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProjectLifecycleService {

    private final ProjectMilestoneRepository projectMilestoneRepository;
    private final ProjectRepository projectRepository;

    public ProjectLifecycleService(ProjectMilestoneRepository projectMilestoneRepository,
                                   ProjectRepository projectRepository) {
        this.projectMilestoneRepository = projectMilestoneRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional
    public void recalculateProjectProgress(Project project) {
        List<ProjectMilestone> milestones = projectMilestoneRepository
                .findByProjectIdOrderByMilestone_MilestoneOrderAsc(project.getId());

        if (milestones.isEmpty()) {
            project.setStatus(ProjectStatus.NOT_STARTED);
            projectRepository.save(project);
            return;
        }

        LocalDate today = LocalDate.now();
        long totalRequired = milestones.stream().filter(pm -> pm.getMilestone().isRequired()).count();
        long completedRequired = milestones.stream()
                .filter(pm -> pm.getMilestone().isRequired() && pm.getStatus() == MilestoneStatus.COMPLETED)
                .count();

        boolean hasDelayed = false;
        boolean hasCorrection = false;

        for (ProjectMilestone pm : milestones) {
            if (pm.getStatus() != MilestoneStatus.COMPLETED) {
                if (pm.getDeadline() != null && pm.getDeadline().isBefore(today)) {
                    pm.setStatus(MilestoneStatus.DELAYED);
                    hasDelayed = true;
                }
                if (pm.getStatus() == MilestoneStatus.CORRECTION_REQUIRED) {
                    hasCorrection = true;
                }
            }
        }
        projectMilestoneRepository.saveAll(milestones);

        if (completedRequired == totalRequired && totalRequired > 0) {
            project.setStatus(ProjectStatus.COMPLETED);
        } else if (hasDelayed) {
            project.setStatus(ProjectStatus.DELAYED);
        } else if (hasCorrection) {
            project.setStatus(ProjectStatus.CORRECTION_REQUIRED);
        } else if (completedRequired > 0) {
            project.setStatus(ProjectStatus.ON_TRACK);
        } else {
            project.setStatus(ProjectStatus.IN_PROGRESS);
        }

        projectRepository.save(project);
    }

    public double calculateProgressPercentage(List<ProjectMilestone> milestones) {
        if (milestones == null || milestones.isEmpty()) return 0.0;
        long totalRequired = milestones.stream().filter(pm -> pm.getMilestone().isRequired()).count();
        if (totalRequired == 0) return 0.0;
        long completedRequired = milestones.stream()
                .filter(pm -> pm.getMilestone().isRequired() && pm.getStatus() == MilestoneStatus.COMPLETED)
                .count();
        return Math.round(((double) completedRequired / totalRequired) * 1000.0) / 10.0;
    }

    public String determineCurrentStage(List<ProjectMilestone> milestones) {
        if (milestones == null || milestones.isEmpty()) return "Not Started";
        for (ProjectMilestone pm : milestones) {
            if (pm.getStatus() != MilestoneStatus.COMPLETED) {
                return pm.getMilestone().getTitle();
            }
        }
        return "Completed";
    }

    public LocalDate getNextUpcomingDeadline(List<ProjectMilestone> milestones) {
        if (milestones == null) return null;
        for (ProjectMilestone pm : milestones) {
            if (pm.getStatus() != MilestoneStatus.COMPLETED && pm.getDeadline() != null) {
                return pm.getDeadline();
            }
        }
        return null;
    }
}
