package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.dto.request.MarkOfflineSubmissionRequest;
import com.academic.projectmonitoring.dto.request.StudentRequestDto;
import com.academic.projectmonitoring.dto.request.StudentWorkLogRequest;
import com.academic.projectmonitoring.dto.response.*;
import com.academic.projectmonitoring.entity.*;
import com.academic.projectmonitoring.entity.enums.*;
import com.academic.projectmonitoring.exception.BadRequestException;
import com.academic.projectmonitoring.exception.ResourceNotFoundException;
import com.academic.projectmonitoring.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final ProjectGroupRepository groupRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMilestoneRepository milestoneRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionVersionRepository versionRepository;
    private final MeetingRepository meetingRepository;
    private final ProjectDiaryEntryRepository diaryRepository;
    private final StudentWorkLogRepository studentWorkLogRepository;
    private final StudentRequestRepository requestRepository;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;

    public StudentService(
            StudentRepository studentRepository,
            ProjectGroupRepository groupRepository,
            ProjectRepository projectRepository,
            ProjectMilestoneRepository milestoneRepository,
            SubmissionRepository submissionRepository,
            SubmissionVersionRepository versionRepository,
            MeetingRepository meetingRepository,
            ProjectDiaryEntryRepository diaryRepository,
            StudentWorkLogRepository studentWorkLogRepository,
            StudentRequestRepository requestRepository,
            NotificationService notificationService,
            FileStorageService fileStorageService) {
        this.studentRepository = studentRepository;
        this.groupRepository = groupRepository;
        this.projectRepository = projectRepository;
        this.milestoneRepository = milestoneRepository;
        this.submissionRepository = submissionRepository;
        this.versionRepository = versionRepository;
        this.meetingRepository = meetingRepository;
        this.diaryRepository = diaryRepository;
        this.studentWorkLogRepository = studentWorkLogRepository;
        this.requestRepository = requestRepository;
        this.notificationService = notificationService;
        this.fileStorageService = fileStorageService;
    }

    private Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + userId));
    }

    private ProjectGroup getStudentGroup(Student student) {
        return groupRepository.findByMembers_Student_Id(student.getId())
                .orElseThrow(() -> new BadRequestException("You are not assigned to any project group yet."));
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(Long userId) {
        Student student = getStudentByUserId(userId);
        ProjectGroup group = getStudentGroup(student);
        Project project = group.getProject();

        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setGroupId(group.getId());
        stats.setGroupCode(group.getGroupCode());
        stats.setIsLeader(group.getLeader() != null && group.getLeader().getId().equals(student.getId()));
        stats.setLeaderName(group.getLeader() != null ? group.getLeader().getFullName() : "N/A");

        if (project != null) {
            stats.setProjectId(project.getId());
            stats.setProjectTitle(project.getTitle());
            stats.setProjectStatus(project.getStatus() != null ? project.getStatus().name() : "IN_PROGRESS");
            stats.setGuideName(project.getGuide() != null ? project.getGuide().getFullName() : "Not Allocated");

            List<ProjectMilestone> milestones = milestoneRepository.findByProjectIdOrderBySequenceNumberAsc(project.getId());
            stats.setTotalMilestones((long) milestones.size());
            long completed = milestones.stream().filter(m -> m.getStatus() == MilestoneStatus.COMPLETED).count();
            stats.setCompletedMilestones(completed);
            stats.setProgressPercentage(milestones.isEmpty() ? 0 : (int) ((completed * 100.0) / milestones.size()));
        }

        return stats;
    }

    @Transactional(readOnly = true)
    public List<MilestoneDto> getProjectMilestones(Long userId) {
        Student student = getStudentByUserId(userId);
        ProjectGroup group = getStudentGroup(student);
        if (group.getProject() == null) return Collections.emptyList();

        List<ProjectMilestone> milestones = milestoneRepository.findByProjectIdOrderBySequenceNumberAsc(group.getProject().getId());
        boolean isLeader = group.getLeader() != null && group.getLeader().getId().equals(student.getId());

        return milestones.stream().map(m -> {
            MilestoneDto dto = new MilestoneDto();
            dto.setId(m.getId());
            dto.setTitle(m.getTitle());
            dto.setDescription(m.getDescription());
            dto.setSequenceNumber(m.getSequenceNumber());
            dto.setStatus(m.getStatus().name());
            dto.setDeadline(m.getDeadline());
            dto.setWeightage(m.getWeightage());
            dto.setIsLeader(isLeader);
            dto.setLeaderName(group.getLeader() != null ? group.getLeader().getFullName() : "Group Leader");

            submissionRepository.findByMilestoneId(m.getId()).ifPresent(sub -> {
                dto.setSubmissionStatus(sub.getStatus().name());
                dto.setSubmissionDate(sub.getSubmittedAt());
                dto.setCurrentVersion(sub.getCurrentVersion());
                dto.setGuideRemarks(sub.getGuideRemarks());
                dto.setFileUrl(sub.getFileUrl());
                dto.setLinkUrl(sub.getLinkUrl());
                dto.setSubmittedByName(sub.getSubmittedBy() != null ? sub.getSubmittedBy().getFullName() : "Group Member");
            });

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public SubmissionDto submitMilestoneDeliverable(Long userId, Long milestoneId, MultipartFile file, String linkUrl, String remarks) {
        Student student = getStudentByUserId(userId);
        ProjectGroup group = getStudentGroup(student);
        Project project = group.getProject();

        if (project == null) {
            throw new BadRequestException("No project assigned to your group yet.");
        }

        ProjectMilestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found: " + milestoneId));

        String storedFileName = null;
        if (file != null && !file.isEmpty()) {
            storedFileName = fileStorageService.storeFile(file, group.getGroupCode(), milestone.getTitle());
        }

        Submission submission = submissionRepository.findByMilestoneId(milestoneId)
                .orElseGet(() -> {
                    Submission newSub = new Submission();
                    newSub.setProject(project);
                    newSub.setMilestone(milestone);
                    newSub.setGroup(group);
                    newSub.setCurrentVersion(1);
                    return newSub;
                });

        int newVersionNumber = submission.getId() != null ? submission.getCurrentVersion() + 1 : 1;
        submission.setCurrentVersion(newVersionNumber);
        submission.setStatus(SubmissionStatus.SUBMITTED);
        submission.setSubmittedBy(student);
        submission.setSubmittedAt(LocalDateTime.now());
        if (storedFileName != null) {
            submission.setFileUrl("/api/common/files/" + storedFileName);
            submission.setFileName(file.getOriginalFilename());
        }
        if (linkUrl != null && !linkUrl.trim().isEmpty()) {
            submission.setLinkUrl(linkUrl.trim());
        }
        if (remarks != null && !remarks.trim().isEmpty()) {
            submission.setStudentRemarks(remarks.trim());
        }

        submission = submissionRepository.save(submission);

        SubmissionVersion version = new SubmissionVersion();
        version.setSubmission(submission);
        version.setVersionNumber(newVersionNumber);
        version.setFileUrl(submission.getFileUrl());
        version.setFileName(submission.getFileName());
        version.setLinkUrl(submission.getLinkUrl());
        version.setSubmittedAt(LocalDateTime.now());
        version.setSubmittedBy(student);
        version.setRemarks(remarks);
        versionRepository.save(version);

        if (project.getGuide() != null && project.getGuide().getUser() != null) {
            notificationService.sendNotification(
                    project.getGuide().getUser().getId(),
                    "New Submission (" + group.getGroupCode() + ")",
                    "Group " + group.getGroupCode() + " submitted " + milestone.getTitle() + " (v" + newVersionNumber + ").",
                    "/guide/submissions"
            );
        }

        for (GroupMember member : group.getMembers()) {
            if (member.getStudent() != null && member.getStudent().getUser() != null && !member.getStudent().getId().equals(student.getId())) {
                notificationService.sendNotification(
                        member.getStudent().getUser().getId(),
                        "Milestone Deliverable Submitted",
                        student.getFullName() + " submitted " + milestone.getTitle() + " for your team.",
                        "/student/submissions"
                );
            }
        }

        SubmissionDto dto = new SubmissionDto();
        dto.setId(submission.getId());
        dto.setMilestoneId(milestone.getId());
        dto.setMilestoneTitle(milestone.getTitle());
        dto.setStatus(submission.getStatus().name());
        dto.setCurrentVersion(submission.getCurrentVersion());
        dto.setFileUrl(submission.getFileUrl());
        dto.setSubmittedAt(submission.getSubmittedAt());
        return dto;
    }
}