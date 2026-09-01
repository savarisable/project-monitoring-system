package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.dto.request.StudentRequestDto;
import com.academic.projectmonitoring.dto.request.SubmitDocumentRequest;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMilestoneRepository projectMilestoneRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionVersionRepository submissionVersionRepository;
    private final PresentationRepository presentationRepository;
    private final MeetingRepository meetingRepository;
    private final NoticeRepository noticeRepository;
    private final StudentRequestRepository studentRequestRepository;
    private final FileStorageService fileStorageService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final ProjectLifecycleService projectLifecycleService;
    private final ProjectHeadService projectHeadService;
    private final GuideService guideService;
    private final ProjectDiaryEntryRepository projectDiaryEntryRepository;

    public StudentService(StudentRepository studentRepository,
                          GroupMemberRepository groupMemberRepository,
                          ProjectRepository projectRepository,
                          ProjectMilestoneRepository projectMilestoneRepository,
                          SubmissionRepository submissionRepository,
                          SubmissionVersionRepository submissionVersionRepository,
                          PresentationRepository presentationRepository,
                          MeetingRepository meetingRepository,
                          NoticeRepository noticeRepository,
                          StudentRequestRepository studentRequestRepository,
                          FileStorageService fileStorageService,
                          AuditLogService auditLogService,
                          NotificationService notificationService,
                          ProjectLifecycleService projectLifecycleService,
                          ProjectHeadService projectHeadService,
                          GuideService guideService,
                          ProjectDiaryEntryRepository projectDiaryEntryRepository) {
        this.studentRepository = studentRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.projectRepository = projectRepository;
        this.projectMilestoneRepository = projectMilestoneRepository;
        this.submissionRepository = submissionRepository;
        this.submissionVersionRepository = submissionVersionRepository;
        this.presentationRepository = presentationRepository;
        this.meetingRepository = meetingRepository;
        this.noticeRepository = noticeRepository;
        this.studentRequestRepository = studentRequestRepository;
        this.fileStorageService = fileStorageService;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
        this.projectLifecycleService = projectLifecycleService;
        this.projectHeadService = projectHeadService;
        this.guideService = guideService;
        this.projectDiaryEntryRepository = projectDiaryEntryRepository;
    }

    // =========================================================================
    // 1. STUDENT DASHBOARD
    // =========================================================================
    @Transactional(readOnly = true)
    public DashboardStatsDto getStudentDashboardStats(Long userId) {
        Student student = getStudentByUserId(userId);
        Optional<GroupMember> memberOpt = groupMemberRepository.findByStudentId(student.getId());

        DashboardStatsDto stats = new DashboardStatsDto();
        if (memberOpt.isEmpty()) {
            return stats;
        }

        ProjectGroup group = memberOpt.get().getGroup();
        Optional<Project> projectOpt = projectRepository.findByGroupId(group.getId());

        if (projectOpt.isPresent()) {
            Project project = projectOpt.get();
            List<ProjectMilestone> pms = projectMilestoneRepository.findByProjectIdOrderByMilestone_MilestoneOrderAsc(project.getId());

            stats.setTotalProjects(1);
            stats.setActiveProjects(project.getStatus() != ProjectStatus.COMPLETED ? 1 : 0);
            stats.setCompletedProjects(project.getStatus() == ProjectStatus.COMPLETED ? 1 : 0);
            stats.setDelayedProjects(project.getStatus() == ProjectStatus.DELAYED ? 1 : 0);

            List<Presentation> presentations = presentationRepository.findByProjectIdOrderByPresentationNumberAsc(project.getId());
            stats.setUpcomingPresentationsCount(presentations.stream().filter(p -> p.getStatus() == PresentationStatus.SCHEDULED).count());
            stats.setUpcomingPresentations(presentations.stream().filter(p -> p.getStatus() == PresentationStatus.SCHEDULED).map(guideService::mapPresentationToDto).collect(Collectors.toList()));
        }

        // Active notices targeted to student, student role, all, or specific group
        stats.setActiveNotices(noticeRepository.findActiveNoticesForStudent(LocalDate.now(), NoticeTarget.ROLE_STUDENT, group.getId()).stream()
                .limit(5)
                .map(projectHeadService::mapNoticeToDto)
                .collect(Collectors.toList()));

        return stats;
    }

    // =========================================================================
    // 2. MY GROUP & PROJECT
    // =========================================================================
    @Transactional(readOnly = true)
    public GroupDto getMyGroup(Long userId) {
        Student student = getStudentByUserId(userId);
        GroupMember member = groupMemberRepository.findByStudentId(student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("You have not been assigned to any project group yet."));
        return projectHeadService.mapGroupToDto(member.getGroup());
    }

    @Transactional(readOnly = true)
    public ProjectDto getMyProject(Long userId) {
        Student student = getStudentByUserId(userId);
        GroupMember member = groupMemberRepository.findByStudentId(student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("You have not been assigned to any project group yet."));

        Project project = projectRepository.findByGroupId(member.getGroup().getId())
                .orElseThrow(() -> new ResourceNotFoundException("No project has been registered for your group yet."));

        return projectHeadService.mapProjectToDto(project);
    }

    // =========================================================================
    // 3. SUBMISSIONS & FILE UPLOADS
    // =========================================================================
    @Transactional(readOnly = true)
    public List<SubmissionDto> getMySubmissions(Long userId) {
        Student student = getStudentByUserId(userId);
        GroupMember member = groupMemberRepository.findByStudentId(student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("You have not been assigned to any group."));

        return submissionRepository.findByGroupId(member.getGroup().getId()).stream()
                .map(guideService::mapSubmissionToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubmissionDto uploadSubmission(SubmitDocumentRequest request, MultipartFile file, Long userId, String username) {
        Student student = getStudentByUserId(userId);
        GroupMember member = groupMemberRepository.findByStudentId(student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("You have not been assigned to any group."));

        ProjectMilestone pm = projectMilestoneRepository.findById(request.getProjectMilestoneId())
                .orElseThrow(() -> new ResourceNotFoundException("Project milestone not found"));

        if (!pm.getProject().getGroup().getId().equals(member.getGroup().getId())) {
            throw new BadRequestException("You can only submit documents for your own assigned project group.");
        }

        Submission submission = submissionRepository.findByProjectMilestoneId(pm.getId())
                .orElseGet(() -> {
                    Submission newSub = new Submission(pm, pm.getProject(), member.getGroup(), pm.getMilestone().getTitle().toUpperCase().replaceAll(" ", "_"));
                    return submissionRepository.save(newSub);
                });
        if (submission.getId() == null) {
            submission = submissionRepository.save(submission);
        }

        boolean isResubmission = submission.getStatus() == SubmissionStatus.CORRECTION_REQUIRED || !submission.getVersions().isEmpty();
        int versionNumber = submission.getVersions().isEmpty() ? 1 : submission.getVersions().get(0).getVersionNumber() + 1;

        FileStorageService.StoredFileInfo fileInfo = fileStorageService.storeFile(file, member.getGroup().getId(), submission.getSubmissionType(), versionNumber);

        SubmissionVersion version = new SubmissionVersion(
                submission,
                versionNumber,
                SubmissionMode.ONLINE,
                fileInfo.getFilePath(),
                fileInfo.getOriginalFileName(),
                fileInfo.getFileSize(),
                request.getStudentNotes(),
                student.getUser()
        );
        submissionVersionRepository.save(version);

        submission.setCurrentVersion(versionNumber);
        submission.setStatus(isResubmission ? SubmissionStatus.RESUBMITTED : SubmissionStatus.ONLINE_SUBMITTED);
        submission.setLastSubmittedAt(LocalDateTime.now());
        submissionRepository.save(submission);

        pm.setStatus(MilestoneStatus.SUBMITTED);
        projectMilestoneRepository.save(pm);

        projectLifecycleService.recalculateProjectProgress(pm.getProject());

        // Notify Guide
        if (member.getGroup().getGuideAllocation() != null && member.getGroup().getGuideAllocation().isActive()) {
            Guide guide = member.getGroup().getGuideAllocation().getGuide();
            notificationService.sendNotification(guide.getUser(),
                    isResubmission ? "Resubmission Received" : "New Submission Received",
                    member.getGroup().getGroupNumber() + " submitted " + pm.getMilestone().getTitle() + " (Version " + versionNumber + ")",
                    "SUBMISSION", submission.getId());
        }

        auditLogService.log(userId, username, "ROLE_STUDENT",
                isResubmission ? "RESUBMISSION_UPLOAD" : "SUBMISSION_UPLOAD", "SUBMISSION", submission.getId(),
                "Uploaded " + pm.getMilestone().getTitle() + " Version " + versionNumber + " (" + fileInfo.getOriginalFileName() + ")");

        return guideService.mapSubmissionToDto(submissionRepository.findById(submission.getId()).get());
    }

    // =========================================================================
    // 4. PRESENTATIONS, MEETINGS, NOTICES & QUESTIONS
    // =========================================================================
    @Transactional(readOnly = true)
    public List<PresentationDto> getMyPresentations(Long userId) {
        Student student = getStudentByUserId(userId);
        GroupMember member = groupMemberRepository.findByStudentId(student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("You have not been assigned to any group."));

        Project project = projectRepository.findByGroupId(member.getGroup().getId())
                .orElseThrow(() -> new ResourceNotFoundException("No project found for your group."));

        return presentationRepository.findByProjectIdOrderByPresentationNumberAsc(project.getId()).stream()
                .map(guideService::mapPresentationToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MeetingDto> getMyMeetings(Long userId) {
        Student student = getStudentByUserId(userId);
        GroupMember member = groupMemberRepository.findByStudentId(student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("You have not been assigned to any group."));

        return meetingRepository.findByGroupIdOrderByMeetingDateDesc(member.getGroup().getId()).stream()
                .map(guideService::mapMeetingToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoticeDto> getMyNotices(Long userId) {
        Student student = getStudentByUserId(userId);
        Optional<GroupMember> memberOpt = groupMemberRepository.findByStudentId(student.getId());
        Long groupId = memberOpt.map(m -> m.getGroup().getId()).orElse(null);

        return noticeRepository.findActiveNoticesForStudent(LocalDate.now(), NoticeTarget.ROLE_STUDENT, groupId).stream()
                .map(projectHeadService::mapNoticeToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentRequestResponseDto sendPredefinedQuestion(StudentRequestDto dto, Long userId, String username) {
        Student student = getStudentByUserId(userId);
        GroupMember member = groupMemberRepository.findByStudentId(student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("You have not been assigned to any group."));

        if (member.getGroup().getGuideAllocation() == null || !member.getGroup().getGuideAllocation().isActive()) {
            throw new BadRequestException("No active Guide has been allocated to your group yet.");
        }

        Guide guide = member.getGroup().getGuideAllocation().getGuide();

        StudentRequest request = new StudentRequest(
                member.getGroup(),
                student,
                guide,
                dto.getPredefinedQuestion(),
                dto.getAdditionalNote()
        );
        studentRequestRepository.save(request);

        // Notify Guide
        notificationService.sendNotification(guide.getUser(), "Student Inquiry Received",
                member.getGroup().getGroupNumber() + " sent inquiry: " + dto.getPredefinedQuestion().getDisplayLabel(),
                "STUDENT_REQUEST", request.getId());

        auditLogService.log(userId, username, "ROLE_STUDENT",
                "SEND_STUDENT_REQUEST", "STUDENT_REQUEST", request.getId(),
                "Sent academic inquiry: " + dto.getPredefinedQuestion().getDisplayLabel());

        return guideService.mapStudentRequestToDto(request);
    }

    @Transactional(readOnly = true)
    public List<StudentRequestResponseDto> getMyRequests(Long userId) {
        Student student = getStudentByUserId(userId);
        return studentRequestRepository.findByStudent_UserIdOrderByCreatedAtDesc(userId).stream()
                .map(guideService::mapStudentRequestToDto)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // 5. PROJECT DIARY (STUDENT VIEW)
    // =========================================================================
    @Transactional(readOnly = true)
    public List<ProjectDiaryDto> getMyProjectDiary(Long userId) {
        Student student = getStudentByUserId(userId);
        GroupMember member = groupMemberRepository.findByStudentId(student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("You are not assigned to any group."));

        return projectDiaryEntryRepository.findByGroupIdOrderByMeetingDateDesc(member.getGroup().getId()).stream()
                .map(guideService::mapDiaryToDto)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // HELPER METHODS
    // =========================================================================
    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + userId));
    }
}
