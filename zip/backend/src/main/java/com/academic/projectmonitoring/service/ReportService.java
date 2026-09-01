package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.dto.response.ReportDto;
import com.academic.projectmonitoring.entity.*;
import com.academic.projectmonitoring.entity.enums.MilestoneStatus;
import com.academic.projectmonitoring.entity.enums.ProjectStatus;
import com.academic.projectmonitoring.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ProjectRepository projectRepository;
    private final GuideRepository guideRepository;
    private final GuideAllocationRepository guideAllocationRepository;
    private final SubmissionRepository submissionRepository;
    private final PresentationRepository presentationRepository;
    private final ProjectMilestoneRepository projectMilestoneRepository;
    private final ProjectHeadService projectHeadService;
    private final ProjectLifecycleService projectLifecycleService;

    public ReportService(ProjectRepository projectRepository,
                         GuideRepository guideRepository,
                         GuideAllocationRepository guideAllocationRepository,
                         SubmissionRepository submissionRepository,
                         PresentationRepository presentationRepository,
                         ProjectMilestoneRepository projectMilestoneRepository,
                         ProjectHeadService projectHeadService,
                         ProjectLifecycleService projectLifecycleService) {
        this.projectRepository = projectRepository;
        this.guideRepository = guideRepository;
        this.guideAllocationRepository = guideAllocationRepository;
        this.submissionRepository = submissionRepository;
        this.presentationRepository = presentationRepository;
        this.projectMilestoneRepository = projectMilestoneRepository;
        this.projectHeadService = projectHeadService;
        this.projectLifecycleService = projectLifecycleService;
    }

    @Transactional(readOnly = true)
    public ReportDto generateReport(String type, Long academicYearId, Long guideIdFilter, String statusFilter) {
        AcademicYear year = projectHeadService.getAcademicYearOrDefault(academicYearId);
        ReportDto report = new ReportDto();
        report.setReportType(type != null ? type.toUpperCase() : "PROJECT_PROGRESS");
        report.setAcademicYearId(year.getId());
        report.setAcademicYearName(year.getYearName());
        report.setGeneratedAt(LocalDateTime.now());

        if ("GUIDE".equalsIgnoreCase(type)) {
            report.setGuideReport(generateGuideReport(year.getId()));
        } else if ("SUBMISSIONS".equalsIgnoreCase(type)) {
            report.setSubmissionReport(generateSubmissionReport(year.getId()));
        } else if ("MARKS".equalsIgnoreCase(type)) {
            report.setMarksReport(generateMarksReport(year.getId()));
        } else {
            report.setProjectProgressReport(generateProjectProgressReport(year.getId(), guideIdFilter, statusFilter));
        }

        return report;
    }

    private List<ReportDto.ProjectProgressReportItem> generateProjectProgressReport(Long yearId, Long guideIdFilter, String statusFilter) {
        List<Project> projects = projectRepository.findByAcademicYearId(yearId);

        if (guideIdFilter != null) {
            projects = projects.stream()
                    .filter(p -> p.getGroup().getGuideAllocation() != null &&
                            p.getGroup().getGuideAllocation().isActive() &&
                            p.getGroup().getGuideAllocation().getGuide().getId().equals(guideIdFilter))
                    .collect(Collectors.toList());
        }

        if (statusFilter != null && !statusFilter.trim().isEmpty() && !"ALL".equalsIgnoreCase(statusFilter)) {
            try {
                ProjectStatus ps = ProjectStatus.valueOf(statusFilter.toUpperCase());
                projects = projects.stream().filter(p -> p.getStatus() == ps).collect(Collectors.toList());
            } catch (Exception ignored) {}
        }

        List<ReportDto.ProjectProgressReportItem> items = new ArrayList<>();
        for (Project p : projects) {
            ReportDto.ProjectProgressReportItem item = new ReportDto.ProjectProgressReportItem();
            item.setProjectId(p.getId());
            item.setGroupNumber(p.getGroup().getGroupNumber());
            item.setProjectTitle(p.getTitle());
            item.setDomain(p.getDomain());

            Optional<GuideAllocation> allocOpt = guideAllocationRepository.findByGroupIdAndActiveTrue(p.getGroup().getId());
            item.setGuideName(allocOpt.map(a -> a.getGuide().getUser().getFullName()).orElse("Unassigned"));

            item.setStatus(p.getStatus().name());

            List<ProjectMilestone> pms = projectMilestoneRepository.findByProjectIdOrderByMilestone_MilestoneOrderAsc(p.getId());
            item.setTotalMilestones(pms.size());
            item.setCompletedMilestones((int) pms.stream().filter(pm -> pm.getStatus() == MilestoneStatus.COMPLETED).count());
            item.setProgressPercentage(projectLifecycleService.calculateProgressPercentage(pms));
            item.setCurrentStage(projectLifecycleService.determineCurrentStage(pms));
            item.setDelayed(p.getStatus() == ProjectStatus.DELAYED);

            items.add(item);
        }
        return items;
    }

    private List<ReportDto.GuideReportItem> generateGuideReport(Long yearId) {
        List<Guide> guides = guideRepository.findAll();
        List<ReportDto.GuideReportItem> items = new ArrayList<>();

        for (Guide g : guides) {
            ReportDto.GuideReportItem item = new ReportDto.GuideReportItem();
            item.setGuideId(g.getId());
            item.setGuideName(g.getUser().getFullName());
            item.setDepartment(g.getDepartment());
            item.setDesignation(g.getDesignation());
            item.setMaxCapacity(g.getMaxGroupsCapacity());

            List<GuideAllocation> allocations = guideAllocationRepository.findByGuideIdAndActiveTrue(g.getId());
            item.setAssignedGroupsCount(allocations.size());

            List<Project> projects = projectRepository.findByGuideId(g.getId());
            item.setActiveProjects(projects.stream().filter(p -> p.getStatus() != ProjectStatus.COMPLETED).count());
            item.setCompletedProjects(projects.stream().filter(p -> p.getStatus() == ProjectStatus.COMPLETED).count());
            item.setPendingReviews(submissionRepository.findPendingSubmissionsForGuideUser(g.getUser().getId()).size());

            items.add(item);
        }
        return items;
    }

    private List<ReportDto.SubmissionReportItem> generateSubmissionReport(Long yearId) {
        List<Submission> submissions = submissionRepository.findAll();
        List<ReportDto.SubmissionReportItem> items = new ArrayList<>();

        for (Submission s : submissions) {
            ReportDto.SubmissionReportItem item = new ReportDto.SubmissionReportItem();
            item.setSubmissionId(s.getId());
            item.setGroupNumber(s.getGroup().getGroupNumber());
            item.setProjectTitle(s.getProject().getTitle());
            item.setSubmissionType(s.getSubmissionType());
            item.setCurrentVersion(s.getCurrentVersion());
            item.setStatus(s.getStatus().name());
            item.setLastSubmittedAt(s.getLastSubmittedAt());

            Optional<GuideAllocation> alloc = guideAllocationRepository.findByGroupIdAndActiveTrue(s.getGroup().getId());
            item.setGuideName(alloc.map(a -> a.getGuide().getUser().getFullName()).orElse("Unassigned"));

            if (!s.getReviews().isEmpty()) {
                item.setLastVerdict(s.getReviews().get(0).getVerdict());
            } else {
                item.setLastVerdict("Pending Review");
            }

            items.add(item);
        }
        return items;
    }

    private List<ReportDto.PresentationMarksReportItem> generateMarksReport(Long yearId) {
        List<Presentation> presentations = presentationRepository.findByAcademicYearId(yearId);
        List<ReportDto.PresentationMarksReportItem> items = new ArrayList<>();

        for (Presentation pres : presentations) {
            ReportDto.PresentationMarksReportItem item = new ReportDto.PresentationMarksReportItem();
            item.setPresentationId(pres.getId());
            item.setGroupNumber(pres.getProject().getGroup().getGroupNumber());
            item.setProjectTitle(pres.getProject().getTitle());
            item.setPresentationNumber(pres.getPresentationNumber());
            item.setPresentationTitle(pres.getTitle());
            item.setScheduledDate(pres.getScheduledDate());
            item.setStatus(pres.getStatus().name());

            Optional<GuideAllocation> alloc = guideAllocationRepository.findByGroupIdAndActiveTrue(pres.getProject().getGroup().getId());
            item.setGuideName(alloc.map(a -> a.getGuide().getUser().getFullName()).orElse("Unassigned"));

            if (pres.getEvaluation() != null) {
                item.setMarksObtained(pres.getEvaluation().getMarksObtained());
                item.setMaxMarks(pres.getEvaluation().getMaxMarks());
                item.setAttendanceStatus(pres.getEvaluation().getAttendanceStatus());
            }

            items.add(item);
        }
        return items;
    }
}
