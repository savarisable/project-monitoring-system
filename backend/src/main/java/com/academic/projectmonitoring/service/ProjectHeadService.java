package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.dto.request.*;
import com.academic.projectmonitoring.dto.response.*;
import com.academic.projectmonitoring.entity.*;
import com.academic.projectmonitoring.entity.enums.*;
import com.academic.projectmonitoring.exception.BadRequestException;
import com.academic.projectmonitoring.exception.ResourceNotFoundException;
import com.academic.projectmonitoring.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectHeadService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final GuideRepository guideRepository;
    private final StudentRepository studentRepository;
    private final AcademicYearRepository academicYearRepository;
    private final ProjectGroupRepository projectGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GuideAllocationRepository guideAllocationRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;
    private final ProjectMilestoneRepository projectMilestoneRepository;
    private final PresentationRepository presentationRepository;
    private final SubmissionRepository submissionRepository;
    private final NoticeRepository noticeRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final ProjectLifecycleService projectLifecycleService;

    public ProjectHeadService(UserRepository userRepository,
                              RoleRepository roleRepository,
                              GuideRepository guideRepository,
                              StudentRepository studentRepository,
                              AcademicYearRepository academicYearRepository,
                              ProjectGroupRepository projectGroupRepository,
                              GroupMemberRepository groupMemberRepository,
                              GuideAllocationRepository guideAllocationRepository,
                              ProjectRepository projectRepository,
                              MilestoneRepository milestoneRepository,
                              ProjectMilestoneRepository projectMilestoneRepository,
                              PresentationRepository presentationRepository,
                              SubmissionRepository submissionRepository,
                              NoticeRepository noticeRepository,
                              PasswordEncoder passwordEncoder,
                              AuditLogService auditLogService,
                              NotificationService notificationService,
                              ProjectLifecycleService projectLifecycleService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.guideRepository = guideRepository;
        this.studentRepository = studentRepository;
        this.academicYearRepository = academicYearRepository;
        this.projectGroupRepository = projectGroupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.guideAllocationRepository = guideAllocationRepository;
        this.projectRepository = projectRepository;
        this.milestoneRepository = milestoneRepository;
        this.projectMilestoneRepository = projectMilestoneRepository;
        this.presentationRepository = presentationRepository;
        this.submissionRepository = submissionRepository;
        this.noticeRepository = noticeRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
        this.projectLifecycleService = projectLifecycleService;
    }

    // =========================================================================
    // 1. DASHBOARD & STATS
    // =========================================================================
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(Long academicYearId) {
        AcademicYear academicYear = getAcademicYearOrDefault(academicYearId);
        Long yearId = academicYear.getId();

        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalProjects(projectRepository.countByAcademicYearId(yearId));
        stats.setActiveProjects(projectRepository.countByAcademicYearIdAndStatus(yearId, ProjectStatus.IN_PROGRESS) +
                projectRepository.countByAcademicYearIdAndStatus(yearId, ProjectStatus.ON_TRACK) +
                projectRepository.countByAcademicYearIdAndStatus(yearId, ProjectStatus.CORRECTION_REQUIRED));
        stats.setCompletedProjects(projectRepository.countByAcademicYearIdAndStatus(yearId, ProjectStatus.COMPLETED));
        stats.setDelayedProjects(projectRepository.countByAcademicYearIdAndStatus(yearId, ProjectStatus.DELAYED));

        stats.setTotalGuides(guideRepository.count());
        stats.setTotalStudents(studentRepository.findByAcademicYearId(yearId).size());
        stats.setTotalGroups(projectGroupRepository.findByAcademicYearId(yearId).size());

        List<Submission> pendingSubs = submissionRepository.findAllPendingSubmissions();
        stats.setPendingSubmissions(pendingSubs.size());
        stats.setPendingReviews(pendingSubs.size());

        List<Presentation> presentations = presentationRepository.findByAcademicYearId(yearId);
        stats.setUpcomingPresentationsCount(presentations.stream().filter(p -> p.getStatus() == PresentationStatus.SCHEDULED).count());

        // Distributions
        Map<String, Long> statusDist = new HashMap<>();
        for (ProjectStatus s : ProjectStatus.values()) {
            statusDist.put(s.name(), projectRepository.countByAcademicYearIdAndStatus(yearId, s));
        }
        stats.setProjectStatusDistribution(statusDist);

        Map<String, Long> guideWorkload = new HashMap<>();
        guideRepository.findAll().forEach(g -> {
            guideWorkload.put(g.getUser().getFullName(), guideAllocationRepository.countByGuideIdAndActiveTrue(g.getId()));
        });
        stats.setGuideWorkloadDistribution(guideWorkload);

        // Recent Projects
        stats.setRecentProjects(projectRepository.findByAcademicYearId(yearId).stream()
                .limit(5)
                .map(this::mapProjectToDto)
                .collect(Collectors.toList()));

        // Active Notices
        stats.setActiveNotices(noticeRepository.findActiveNotices(LocalDate.now()).stream()
                .limit(5)
                .map(this::mapNoticeToDto)
                .collect(Collectors.toList()));

        return stats;
    }

    // =========================================================================
    // 2. USER MANAGEMENT
    // =========================================================================
    @Transactional
    public UserDto createUser(CreateUserRequest request, Long currentUserId, String currentUsername) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username '" + request.getUsername() + "' is already taken.");
        }

        RoleName roleName;
        try {
            roleName = RoleName.valueOf(request.getRole());
        } catch (Exception e) {
            throw new BadRequestException("Invalid role specified. Must be ROLE_GUIDE or ROLE_STUDENT.");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getInitialPassword()),
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                role
        );
        userRepository.save(user);

        if (roleName == RoleName.ROLE_GUIDE) {
            Guide guide = new Guide(
                    user,
                    request.getDepartment() != null ? request.getDepartment() : "Computer Science & Engineering",
                    request.getDesignation() != null ? request.getDesignation() : "Assistant Professor",
                    request.getSpecialization(),
                    request.getMaxGroupsCapacity() != null ? request.getMaxGroupsCapacity() : 5
            );
            guideRepository.save(guide);
        } else if (roleName == RoleName.ROLE_STUDENT) {
            AcademicYear year = getAcademicYearOrDefault(request.getAcademicYearId());
            Student student = new Student(
                    user,
                    request.getRollNumber() != null ? request.getRollNumber() : ("CS" + System.currentTimeMillis() % 10000),
                    request.getDepartment() != null ? request.getDepartment() : "Computer Science & Engineering",
                    request.getSemester() != null ? request.getSemester() : 7,
                    year
            );
            studentRepository.save(student);
        }

        auditLogService.log(currentUserId, currentUsername, "ROLE_PROJECT_HEAD",
                "CREATE_USER", "USER", user.getId(),
                "Created user '" + user.getUsername() + "' with role " + roleName);

        return mapUserToDto(user);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers(String roleFilter, String searchQuery) {
        List<User> users;
        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            users = userRepository.searchUsers(searchQuery.trim());
        } else if (roleFilter != null && !roleFilter.trim().isEmpty()) {
            try {
                users = userRepository.findByRole_Name(RoleName.valueOf(roleFilter.trim()));
            } catch (Exception e) {
                users = userRepository.findAll();
            }
        } else {
            users = userRepository.findAll();
        }
        return users.stream().map(this::mapUserToDto).collect(Collectors.toList());
    }

    @Transactional
    public void toggleUserActive(Long targetUserId, Long currentUserId, String currentUsername) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);

        auditLogService.log(currentUserId, currentUsername, "ROLE_PROJECT_HEAD",
                "TOGGLE_USER_STATUS", "USER", user.getId(),
                "Changed active status of '" + user.getUsername() + "' to " + user.isActive());
    }

    @Transactional
    public void resetUserPassword(Long targetUserId, String newPassword, Long currentUserId, String currentUsername) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        auditLogService.log(currentUserId, currentUsername, "ROLE_PROJECT_HEAD",
                "ADMIN_RESET_PASSWORD", "USER", user.getId(),
                "Manually reset password for user '" + user.getUsername() + "'");
    }

    // =========================================================================
    // 3. GUIDES & STUDENTS MANAGEMENT
    // =========================================================================
    @Transactional(readOnly = true)
    public List<GuideDto> getAllGuides() {
        return guideRepository.findAll().stream().map(this::mapGuideToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents(Long academicYearId) {
        AcademicYear year = getAcademicYearOrDefault(academicYearId);
        return studentRepository.findByAcademicYearId(year.getId()).stream()
                .map(this::mapStudentToDto)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // 4. GROUP MANAGEMENT & GUIDE ALLOCATION
    // =========================================================================
    @Transactional
    public GroupDto createGroup(CreateGroupRequest request, Long currentUserId, String currentUsername) {
        AcademicYear year = getAcademicYearOrDefault(request.getAcademicYearId());

        if (projectGroupRepository.findByGroupNumberAndAcademicYearId(request.getGroupNumber(), year.getId()).isPresent()) {
            throw new BadRequestException("Group with number '" + request.getGroupNumber() + "' already exists for academic year " + year.getYearName());
        }

        ProjectGroup group = new ProjectGroup(request.getGroupNumber(), year);
        projectGroupRepository.save(group);

        // Add students
        for (Long studentId : request.getStudentIds()) {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

            if (groupMemberRepository.findByStudentId(studentId).isPresent()) {
                throw new BadRequestException("Student '" + student.getUser().getFullName() + "' is already assigned to a group.");
            }

            boolean isLeader = request.getLeaderStudentId() != null && request.getLeaderStudentId().equals(studentId);
            GroupMember member = new GroupMember(group, student, isLeader);
            groupMemberRepository.save(member);
        }

        // Optional immediate guide allocation
        if (request.getGuideId() != null) {
            allocateGuideInternal(group.getId(), request.getGuideId(), currentUserId, currentUsername);
        }

        auditLogService.log(currentUserId, currentUsername, "ROLE_PROJECT_HEAD",
                "CREATE_GROUP", "PROJECT_GROUP", group.getId(),
                "Created group '" + group.getGroupNumber() + "' with " + request.getStudentIds().size() + " members.");

        return mapGroupToDto(projectGroupRepository.findById(group.getId()).get());
    }

    @Transactional
    public void allocateGuide(AllocateGuideRequest request, Long currentUserId, String currentUsername) {
        allocateGuideInternal(request.getGroupId(), request.getGuideId(), currentUserId, currentUsername);
    }

    private void allocateGuideInternal(Long groupId, Long guideId, Long currentUserId, String currentUsername) {
        ProjectGroup group = projectGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        Guide guide = guideRepository.findById(guideId)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found"));

        User headUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<GuideAllocation> existingOpt = guideAllocationRepository.findByGroupIdAndActiveTrue(groupId);
        if (existingOpt.isPresent()) {
            GuideAllocation existing = existingOpt.get();
            existing.setActive(false);
            guideAllocationRepository.save(existing);
        }

        GuideAllocation allocation = new GuideAllocation(group, guide, headUser);
        guideAllocationRepository.save(allocation);

        // Notify Students and Guide
        group.getMembers().forEach(m -> {
            notificationService.sendNotification(m.getStudent().getUser(), "Guide Allocated",
                    "Prof. " + guide.getUser().getFullName() + " has been allocated as your project guide.",
                    "ALLOCATION", group.getId());
        });

        notificationService.sendNotification(guide.getUser(), "New Group Allocated",
                group.getGroupNumber() + " has been allocated to you for project guidance.",
                "ALLOCATION", group.getId());

        auditLogService.log(currentUserId, currentUsername, "ROLE_PROJECT_HEAD",
                "ALLOCATE_GUIDE", "PROJECT_GROUP", group.getId(),
                "Allocated guide '" + guide.getUser().getFullName() + "' to group '" + group.getGroupNumber() + "'");
    }

    @Transactional(readOnly = true)
    public List<GroupDto> getAllGroups(Long academicYearId) {
        AcademicYear year = getAcademicYearOrDefault(academicYearId);
        return projectGroupRepository.findByAcademicYearId(year.getId()).stream()
                .map(this::mapGroupToDto)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // 5. PROJECT MANAGEMENT
    // =========================================================================
    @Transactional
    public ProjectDto createProject(CreateProjectRequest request, Long currentUserId, String currentUsername) {
        ProjectGroup group = projectGroupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        if (projectRepository.findByGroupId(group.getId()).isPresent()) {
            throw new BadRequestException("A project is already registered for " + group.getGroupNumber());
        }

        AcademicYear year = getAcademicYearOrDefault(request.getAcademicYearId());

        Project project = new Project(
                group,
                year,
                request.getTitle(),
                request.getProjectAbstract(),
                request.getDomain(),
                request.getTechnologies(),
                request.getStartDate() != null ? request.getStartDate() : LocalDate.now(),
                request.getExpectedEndDate() != null ? request.getExpectedEndDate() : LocalDate.now().plusMonths(9)
        );
        projectRepository.save(project);

        // Initialize project milestones from academic year template milestones
        List<Milestone> templateMilestones = milestoneRepository.findByAcademicYearIdAndActiveTrueOrderByMilestoneOrderAsc(year.getId());
        LocalDate rollingDeadline = project.getStartDate();
        for (Milestone tm : templateMilestones) {
            rollingDeadline = rollingDeadline.plusDays(tm.getDefaultDeadlineDays());
            ProjectMilestone pm = new ProjectMilestone(project, tm, rollingDeadline);
            projectMilestoneRepository.save(pm);

            // Create initial submission record placeholder for submissions-based milestones
            if (tm.getTitle().toLowerCase().contains("synopsis") || tm.getTitle().toLowerCase().contains("report")) {
                Submission submission = new Submission(pm, project, group, tm.getTitle().toUpperCase().replaceAll(" ", "_"));
                submissionRepository.save(submission);
            }
        }

        // Initialize default presentations for this project if configured
        List<Presentation> existingPres = presentationRepository.findByProjectIdOrderByPresentationNumberAsc(project.getId());
        if (existingPres.isEmpty()) {
            for (int i = 1; i <= 3; i++) {
                Presentation pres = new Presentation(
                        year,
                        project,
                        i,
                        "Presentation " + i + (i == 3 ? " (Final Demo & Viva)" : ""),
                        project.getStartDate().plusMonths(i * 2L),
                        java.time.LocalTime.of(10, 0),
                        java.time.LocalTime.of(10, 30),
                        "Seminar Hall " + (i % 2 + 1),
                        "Stage " + i + " project evaluation and progress review."
                );
                presentationRepository.save(pres);
            }
        }

        projectLifecycleService.recalculateProjectProgress(project);

        auditLogService.log(currentUserId, currentUsername, "ROLE_PROJECT_HEAD",
                "CREATE_PROJECT", "PROJECT", project.getId(),
                "Created project '" + project.getTitle() + "' for group " + group.getGroupNumber());

        return mapProjectToDto(projectRepository.findById(project.getId()).get());
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects(Long academicYearId) {
        AcademicYear year = getAcademicYearOrDefault(academicYearId);
        return projectRepository.findByAcademicYearId(year.getId()).stream()
                .map(this::mapProjectToDto)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // 6. DYNAMIC MILESTONES & PRESENTATION CONFIGURATION
    // =========================================================================
    @Transactional(readOnly = true)
    public List<MilestoneDto> getMilestonesConfig(Long academicYearId) {
        AcademicYear year = getAcademicYearOrDefault(academicYearId);
        return milestoneRepository.findByAcademicYearIdOrderByMilestoneOrderAsc(year.getId()).stream()
                .map(m -> {
                    MilestoneDto dto = new MilestoneDto();
                    dto.setId(m.getId());
                    dto.setMilestoneId(m.getId());
                    dto.setOrder(m.getMilestoneOrder());
                    dto.setTitle(m.getTitle());
                    dto.setDescription(m.getDescription());
                    dto.setRequired(m.isRequired());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void saveMilestoneConfig(MilestoneConfigRequest request, Long currentUserId, String currentUsername) {
        AcademicYear year = getAcademicYearOrDefault(request.getAcademicYearId());
        Milestone milestone;
        if (request.getId() != null) {
            milestone = milestoneRepository.findById(request.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));
            milestone.setTitle(request.getTitle());
            milestone.setDescription(request.getDescription());
            milestone.setMilestoneOrder(request.getMilestoneOrder());
            milestone.setDefaultDeadlineDays(request.getDefaultDeadlineDays());
            milestone.setRequired(request.isRequired());
            milestone.setActive(request.isActive());
        } else {
            milestone = new Milestone(
                    year,
                    request.getMilestoneOrder(),
                    request.getTitle(),
                    request.getDescription(),
                    request.getDefaultDeadlineDays(),
                    request.isRequired()
            );
        }
        milestoneRepository.save(milestone);

        auditLogService.log(currentUserId, currentUsername, "ROLE_PROJECT_HEAD",
                "CONFIGURE_MILESTONES", "MILESTONE", milestone.getId(),
                "Configured milestone '" + milestone.getTitle() + "' for academic year " + year.getYearName());
    }

    @Transactional
    public void configurePresentations(PresentationConfigRequest request, Long currentUserId, String currentUsername) {
        AcademicYear year = getAcademicYearOrDefault(request.getAcademicYearId());
        int count = request.getPresentationCount();

        List<Project> projects = projectRepository.findByAcademicYearId(year.getId());
        for (Project project : projects) {
            List<Presentation> currentPres = presentationRepository.findByProjectIdOrderByPresentationNumberAsc(project.getId());
            int currentCount = currentPres.size();

            if (count > currentCount) {
                for (int i = currentCount + 1; i <= count; i++) {
                    Presentation pres = new Presentation(
                            year,
                            project,
                            i,
                            "Presentation " + i + (i == count ? " (Final Evaluation)" : ""),
                            LocalDate.now().plusWeeks(i * 3L),
                            java.time.LocalTime.of(10, 0),
                            java.time.LocalTime.of(10, 30),
                            "Seminar Hall 1",
                            "Configured Stage " + i + " Presentation"
                    );
                    presentationRepository.save(pres);
                }
            }
        }

        auditLogService.log(currentUserId, currentUsername, "ROLE_PROJECT_HEAD",
                "CONFIGURE_PRESENTATIONS", "ACADEMIC_YEAR", year.getId(),
                "Configured " + count + " presentations for academic year " + year.getYearName());
    }

    // =========================================================================
    // 7. NOTICES MANAGEMENT
    // =========================================================================
    @Transactional
    public NoticeDto createNotice(CreateNoticeRequest request, Long currentUserId, String currentUsername) {
        User creator = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ProjectGroup targetGroup = null;
        if (request.getTargetGroupId() != null) {
            targetGroup = projectGroupRepository.findById(request.getTargetGroupId()).orElse(null);
        }

        Notice notice = new Notice(
                request.getTitle(),
                request.getDescription(),
                NoticePriority.valueOf(request.getPriority()),
                NoticeTarget.valueOf(request.getTargetRole()),
                targetGroup,
                request.getFromDate(),
                request.getToDate(),
                creator
        );
        noticeRepository.save(notice);

        auditLogService.log(currentUserId, currentUsername, "ROLE_PROJECT_HEAD",
                "CREATE_NOTICE", "NOTICE", notice.getId(),
                "Published notice '" + notice.getTitle() + "' to " + notice.getTargetRole());

        return mapNoticeToDto(notice);
    }

    @Transactional(readOnly = true)
    public List<NoticeDto> getAllNotices() {
        return noticeRepository.findAll().stream().map(this::mapNoticeToDto).collect(Collectors.toList());
    }

    // =========================================================================
    // HELPER MAPPERS
    // =========================================================================
    public AcademicYear getAcademicYearOrDefault(Long academicYearId) {
        if (academicYearId != null) {
            return academicYearRepository.findById(academicYearId)
                    .orElseGet(() -> academicYearRepository.findByCurrentTrue()
                            .orElseGet(() -> academicYearRepository.findAll().stream().findFirst()
                                    .orElseThrow(() -> new ResourceNotFoundException("No Academic Year found."))));
        }
        return academicYearRepository.findByCurrentTrue()
                .orElseGet(() -> academicYearRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("No Academic Year found.")));
    }

    public UserDto mapUserToDto(User user) {
        UserDto dto = new UserDto(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().getName().name(),
                user.isActive(),
                user.getCreatedAt()
        );
        if (user.getRole().getName() == RoleName.ROLE_GUIDE) {
            guideRepository.findByUserId(user.getId()).ifPresent(g -> dto.setProfileDetails(mapGuideToDto(g)));
        } else if (user.getRole().getName() == RoleName.ROLE_STUDENT) {
            studentRepository.findByUserId(user.getId()).ifPresent(s -> dto.setProfileDetails(mapStudentToDto(s)));
        }
        return dto;
    }

    public GuideDto mapGuideToDto(Guide guide) {
        GuideDto dto = new GuideDto();
        dto.setId(guide.getId());
        dto.setUserId(guide.getUser().getId());
        dto.setUsername(guide.getUser().getUsername());
        dto.setFullName(guide.getUser().getFullName());
        dto.setEmail(guide.getUser().getEmail());
        dto.setPhone(guide.getUser().getPhone());
        dto.setDepartment(guide.getDepartment());
        dto.setDesignation(guide.getDesignation());
        dto.setSpecialization(guide.getSpecialization());
        dto.setMaxGroupsCapacity(guide.getMaxGroupsCapacity());

        List<GuideAllocation> allocations = guideAllocationRepository.findByGuideIdAndActiveTrue(guide.getId());
        dto.setAllocatedGroupsCount(allocations.size());
        dto.setAllocatedGroups(allocations.stream().map(a -> {
            Optional<Project> proj = projectRepository.findByGroupId(a.getGroup().getId());
            return new GuideDto.GroupSummaryDto(
                    a.getGroup().getId(),
                    a.getGroup().getGroupNumber(),
                    proj.map(Project::getTitle).orElse("No Project Registered"),
                    proj.map(p -> p.getStatus().name()).orElse("NOT_STARTED")
            );
        }).collect(Collectors.toList()));

        return dto;
    }

    public StudentDto mapStudentToDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setUserId(student.getUser().getId());
        dto.setUsername(student.getUser().getUsername());
        dto.setFullName(student.getUser().getFullName());
        dto.setEmail(student.getUser().getEmail());
        dto.setPhone(student.getUser().getPhone());
        dto.setRollNumber(student.getRollNumber());
        dto.setDepartment(student.getDepartment());
        dto.setSemester(student.getSemester());
        dto.setAcademicYearId(student.getAcademicYear().getId());
        dto.setAcademicYearName(student.getAcademicYear().getYearName());

        Optional<GroupMember> memberOpt = groupMemberRepository.findByStudentId(student.getId());
        if (memberOpt.isPresent()) {
            dto.setGroupId(memberOpt.get().getGroup().getId());
            dto.setGroupNumber(memberOpt.get().getGroup().getGroupNumber());
            dto.setLeader(memberOpt.get().isLeader());
        }
        return dto;
    }

    public GroupDto mapGroupToDto(ProjectGroup group) {
        GroupDto dto = new GroupDto();
        dto.setId(group.getId());
        dto.setGroupNumber(group.getGroupNumber());
        dto.setAcademicYearId(group.getAcademicYear().getId());
        dto.setAcademicYearName(group.getAcademicYear().getYearName());
        dto.setCreatedAt(group.getCreatedAt());

        Optional<GuideAllocation> allocOpt = guideAllocationRepository.findByGroupIdAndActiveTrue(group.getId());
        allocOpt.ifPresent(guideAllocation -> dto.setGuide(mapGuideToDto(guideAllocation.getGuide())));

        dto.setMembers(group.getMembers().stream().map(m -> mapStudentToDto(m.getStudent())).collect(Collectors.toList()));

        Optional<Project> projOpt = projectRepository.findByGroupId(group.getId());
        projOpt.ifPresent(project -> dto.setProject(mapProjectToDto(project)));

        return dto;
    }

    public ProjectDto mapProjectToDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setGroupId(project.getGroup().getId());
        dto.setGroupNumber(project.getGroup().getGroupNumber());
        dto.setAcademicYearId(project.getAcademicYear().getId());
        dto.setAcademicYearName(project.getAcademicYear().getYearName());
        dto.setTitle(project.getTitle());
        dto.setProjectAbstract(project.getProjectAbstract());
        dto.setDomain(project.getDomain());
        dto.setTechnologies(project.getTechnologies());
        dto.setStartDate(project.getStartDate());
        dto.setExpectedEndDate(project.getExpectedEndDate());
        dto.setStatus(project.getStatus());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        Optional<GuideAllocation> allocOpt = guideAllocationRepository.findByGroupIdAndActiveTrue(project.getGroup().getId());
        allocOpt.ifPresent(guideAllocation -> dto.setGuide(mapGuideToDto(guideAllocation.getGuide())));

        dto.setMembers(project.getGroup().getMembers().stream()
                .map(m -> mapStudentToDto(m.getStudent()))
                .collect(Collectors.toList()));

        List<ProjectMilestone> pms = projectMilestoneRepository.findByProjectIdOrderByMilestone_MilestoneOrderAsc(project.getId());
        dto.setTotalMilestonesCount(pms.size());
        dto.setCompletedMilestonesCount((int) pms.stream().filter(pm -> pm.getStatus() == MilestoneStatus.COMPLETED).count());
        dto.setProgressPercentage(projectLifecycleService.calculateProgressPercentage(pms));
        dto.setCurrentStage(projectLifecycleService.determineCurrentStage(pms));
        dto.setNextDeadline(projectLifecycleService.getNextUpcomingDeadline(pms));

        dto.setMilestones(pms.stream().map(pm -> {
            MilestoneDto mDto = new MilestoneDto();
            mDto.setId(pm.getId());
            mDto.setMilestoneId(pm.getMilestone().getId());
            mDto.setProjectId(project.getId());
            mDto.setOrder(pm.getMilestone().getMilestoneOrder());
            mDto.setTitle(pm.getMilestone().getTitle());
            mDto.setDescription(pm.getMilestone().getDescription());
            mDto.setDeadline(pm.getDeadline());
            mDto.setStatus(pm.getStatus());
            mDto.setRequired(pm.getMilestone().isRequired());
            mDto.setDelayed(pm.getStatus() == MilestoneStatus.DELAYED);
            mDto.setCompletedAt(pm.getCompletedAt());
            return mDto;
        }).collect(Collectors.toList()));

        return dto;
    }

    public NoticeDto mapNoticeToDto(Notice notice) {
        NoticeDto dto = new NoticeDto();
        dto.setId(notice.getId());
        dto.setTitle(notice.getTitle());
        dto.setDescription(notice.getDescription());
        dto.setPriority(notice.getPriority());
        dto.setTargetRole(notice.getTargetRole());
        if (notice.getTargetGroup() != null) {
            dto.setTargetGroupId(notice.getTargetGroup().getId());
            dto.setTargetGroupNumber(notice.getTargetGroup().getGroupNumber());
        }
        dto.setFromDate(notice.getFromDate());
        dto.setToDate(notice.getToDate());
        dto.setCreatedById(notice.getCreatedBy().getId());
        dto.setCreatedByName(notice.getCreatedBy().getFullName());
        dto.setCreatedAt(notice.getCreatedAt());
        dto.setActive(notice.isActive());
        return dto;
    }
}
