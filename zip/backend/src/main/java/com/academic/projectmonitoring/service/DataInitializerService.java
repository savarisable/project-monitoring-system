package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.entity.*;
import com.academic.projectmonitoring.entity.enums.*;
import com.academic.projectmonitoring.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class DataInitializerService implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializerService.class);

    private final RoleRepository roleRepository;
    private final AcademicYearRepository academicYearRepository;
    private final FeedbackTemplateRepository feedbackTemplateRepository;
    private final MilestoneRepository milestoneRepository;
    private final UserRepository userRepository;
    private final GuideRepository guideRepository;
    private final StudentRepository studentRepository;
    private final ProjectGroupRepository projectGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GuideAllocationRepository guideAllocationRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMilestoneRepository projectMilestoneRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionVersionRepository submissionVersionRepository;
    private final ReviewRepository reviewRepository;
    private final PresentationRepository presentationRepository;
    private final PresentationEvaluationRepository presentationEvaluationRepository;
    private final NoticeRepository noticeRepository;
    private final MeetingRepository meetingRepository;
    private final StudentRequestRepository studentRequestRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializerService(RoleRepository roleRepository,
                                  AcademicYearRepository academicYearRepository,
                                  FeedbackTemplateRepository feedbackTemplateRepository,
                                  MilestoneRepository milestoneRepository,
                                  UserRepository userRepository,
                                  GuideRepository guideRepository,
                                  StudentRepository studentRepository,
                                  ProjectGroupRepository projectGroupRepository,
                                  GroupMemberRepository groupMemberRepository,
                                  GuideAllocationRepository guideAllocationRepository,
                                  ProjectRepository projectRepository,
                                  ProjectMilestoneRepository projectMilestoneRepository,
                                  SubmissionRepository submissionRepository,
                                  SubmissionVersionRepository submissionVersionRepository,
                                  ReviewRepository reviewRepository,
                                  PresentationRepository presentationRepository,
                                  PresentationEvaluationRepository presentationEvaluationRepository,
                                  NoticeRepository noticeRepository,
                                  MeetingRepository meetingRepository,
                                  StudentRequestRepository studentRequestRepository,
                                  PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.academicYearRepository = academicYearRepository;
        this.feedbackTemplateRepository = feedbackTemplateRepository;
        this.milestoneRepository = milestoneRepository;
        this.userRepository = userRepository;
        this.guideRepository = guideRepository;
        this.studentRepository = studentRepository;
        this.projectGroupRepository = projectGroupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.guideAllocationRepository = guideAllocationRepository;
        this.projectRepository = projectRepository;
        this.projectMilestoneRepository = projectMilestoneRepository;
        this.submissionRepository = submissionRepository;
        this.submissionVersionRepository = submissionVersionRepository;
        this.reviewRepository = reviewRepository;
        this.presentationRepository = presentationRepository;
        this.presentationEvaluationRepository = presentationEvaluationRepository;
        this.noticeRepository = noticeRepository;
        this.meetingRepository = meetingRepository;
        this.studentRequestRepository = studentRequestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        logger.info("Initializing database with complete 38 real project batches data...");

        // 1. Roles
        Role headRole = roleRepository.findByName(RoleName.ROLE_PROJECT_HEAD)
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_PROJECT_HEAD)));
        Role guideRole = roleRepository.findByName(RoleName.ROLE_GUIDE)
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_GUIDE)));
        Role studentRole = roleRepository.findByName(RoleName.ROLE_STUDENT)
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_STUDENT)));

        // Ensure Demo Accounts are always active and have correct passwords
        userRepository.findByUsername("projecthead").ifPresent(head -> {
            head.setFullName("Prof. A. D. Chokhat (Project Head)");
            head.setPasswordHash(passwordEncoder.encode("Project@123"));
            head.setActive(true);
            userRepository.save(head);
        });

        userRepository.findByUsername("guide_jawandhiya").ifPresent(guide -> {
            guide.setPasswordHash(passwordEncoder.encode("Guide@123"));
            guide.setActive(true);
            userRepository.save(guide);
        });

        userRepository.findByUsername("student01").ifPresent(stud -> {
            stud.setPasswordHash(passwordEncoder.encode("Student@123"));
            stud.setActive(true);
            userRepository.save(stud);
        });

        // 2. Academic Year
        AcademicYear currentYear = academicYearRepository.findByYearName("2026-27")
                .orElseGet(() -> academicYearRepository.save(new AcademicYear("2026-27", true)));

        // 3. Feedback Templates
        if (feedbackTemplateRepository.count() == 0) {
            feedbackTemplateRepository.saveAll(Arrays.asList(
                    new FeedbackTemplate("APPROVED", "Good, Approved", "Your submission has been reviewed and approved. Excellent work."),
                    new FeedbackTemplate("CORRECTION", "Need Some Changes", "Please make the required corrections as noted and resubmit the document."),
                    new FeedbackTemplate("MEETING", "Please Meet Me for Discussion", "Please schedule a meeting with me to discuss the document formatting and architecture."),
                    new FeedbackTemplate("DETAILS", "More Details Required", "The technical specifications and system methodology need more detailed diagrams and explanation."),
                    new FeedbackTemplate("RESUBMIT", "Resubmit After Correction", "Please resubmit the corrected version after addressing the highlighted remarks."),
                    new FeedbackTemplate("GOOD", "Approved for Next Stage", "Good work. You are approved to proceed to the next development and reporting stage.")
            ));
        }

        // 4. Milestone Templates
        List<Milestone> templateMilestones = milestoneRepository.findByAcademicYearIdOrderByMilestoneOrderAsc(currentYear.getId());
        if (templateMilestones.isEmpty()) {
            templateMilestones = milestoneRepository.saveAll(Arrays.asList(
                    new Milestone(currentYear, 1, "Guide Allocation", "Assignment of faculty project guide to student group", 7, true),
                    new Milestone(currentYear, 2, "Synopsis Submission", "Submission of project synopsis with problem statement, scope and architecture", 21, true),
                    new Milestone(currentYear, 3, "Synopsis Verification", "Faculty review and verification of submitted project synopsis", 7, true),
                    new Milestone(currentYear, 4, "Project Development - Phase 1", "Core architectural setup, database design and initial module implementation", 45, true),
                    new Milestone(currentYear, 5, "Presentation 1", "First stage review: Problem definition, SRS, and initial prototype demonstration", 10, true),
                    new Milestone(currentYear, 6, "Progress Report 1", "Submission of midterm progress documentation and testing reports", 14, true),
                    new Milestone(currentYear, 7, "Presentation 2", "Second stage review: Advanced features, integration and testing evaluation", 20, true),
                    new Milestone(currentYear, 8, "Progress Report 2", "Comprehensive project progress and preliminary deployment report", 14, true),
                    new Milestone(currentYear, 9, "Final Report", "Complete project dissertation, test logs, user manuals and source code documentation", 21, true),
                    new Milestone(currentYear, 10, "Final Presentation", "Final project evaluation, live demo, viva voce and exhibition marks", 10, true),
                    new Milestone(currentYear, 11, "Project Completion", "Final sign-off by Guide and Project Head", 7, true)
            ));
        }

        // 5. Seed Users & Data if Blank
        if (userRepository.count() == 0) {
            String defaultPassword = passwordEncoder.encode("Password@123");
            String guidePassword = passwordEncoder.encode("Guide@123");
            String studentPassword = passwordEncoder.encode("Student@123");
            String headPassword = passwordEncoder.encode("Project@123");

            // Project Head
            User headUser = userRepository.save(new User("projecthead", headPassword, "Prof. A. D. Chokhat (Project Head)", "head.project@college.edu", "9876543200", headRole));

            // Faculty Guides Map
            String[][] facultyGuides = {
                    {"Dr. P. M. Jawandhiya", "guide_jawandhiya", "Professor & HOD", "Machine Learning & AI", "8"},
                    {"Dr. V. B. Gadicha", "guide_gadicha", "Professor", "Cyber Forensics & Information Security", "8"},
                    {"Dr. A. D. Raut", "guide_raut", "Associate Professor", "Data Science & Cloud", "8"},
                    {"Dr. Z. I. Khan", "guide_khan", "Associate Professor", "Information Security & AI", "8"},
                    {"Prof. M. S. Burange", "guide_burange", "Assistant Professor", "Software Engineering & IoT", "8"},
                    {"Dr. A. A. Tayade", "guide_tayade", "Associate Professor", "Data Analytics & Networks", "8"},
                    {"Prof. A. D. Chokhat", "guide_chokhat", "Assistant Professor", "Web Systems & Cloud", "8"},
                    {"Prof. S. R. Kale", "guide_kale", "Assistant Professor", "Enterprise Systems & AI", "8"},
                    {"Prof. M. K. Nichat", "guide_nichat", "Assistant Professor", "Mobile Apps & Agriculture Tech", "8"},
                    {"Prof. J. C. Bambal", "guide_bambal", "Assistant Professor", "Natural Language Processing", "8"},
                    {"Prof. S. S. Mamarde", "guide_mamarde", "Assistant Professor", "FinTech & Banking AI", "8"},
                    {"Prof. P. S. Yawale", "guide_yawale", "Assistant Professor", "CRM & Sales Automation", "8"},
                    {"Prof. B. V. Kasar", "guide_kasar", "Assistant Professor", "Full Stack Development", "8"},
                    {"Prof. A. M. Bhoyar", "guide_bhoyar", "Assistant Professor", "Digital Media & Branding Tech", "8"},
                    {"Prof. J. S. Wankhade", "guide_wankhade", "Assistant Professor", "Smart IoT & Embedded Systems", "8"},
                    {"Prof. V. B. Bambode", "guide_bambode", "Assistant Professor", "LLMs & Knowledge Engineering", "8"},
                    {"Prof. P. G. Nemade", "guide_nemade", "Assistant Professor", "Workforce Analytics & HR Tech", "8"},
                    {"Prof. H. D. Gujar", "guide_gujar", "Assistant Professor", "Emergency Rescue & Disaster Tech", "8"},
                    {"Prof. S. S. Solanke", "guide_solanke", "Assistant Professor", "EdTech & Admission Portals", "8"},
                    {"Prof. S. M. Choudhari", "guide_choudhari", "Assistant Professor", "Predictive Analytics & Safety", "8"},
                    {"Prof. D. D. Mehare", "guide_mehare", "Assistant Professor", "Cloud Computing & GCP", "8"}
            };

            Map<String, Guide> guideMap = new HashMap<>();
            for (String[] gData : facultyGuides) {
                String name = gData[0];
                String username = gData[1];
                String designation = gData[2];
                String domain = gData[3];
                int cap = Integer.parseInt(gData[4]);

                User u = userRepository.save(new User(username, guidePassword, name, username + "@college.edu", "9876543" + (100 + guideMap.size()), guideRole));
                Guide g = guideRepository.save(new Guide(u, "Computer Science & Engineering", designation, domain, cap));
                guideMap.put(name, g);
            }

            // Real 38 Projects Data
            // [GroupNumber, Title, Domain, Technologies, GuideName, LeaderName, OtherMembers...]
            String[][] allGroupsData = {
                    {"Group 01", "Forensic FaceTrack: A Forensic Video Analysis System", "Computer Vision & Forensics", "Python, OpenCV, PyTorch, React, Spring Boot", "Dr. P. M. Jawandhiya", "Govind Prashant Panajkar", "Parth Shrikant Bobade", "Sumet Rajesh Sonone", "Harshal Anil Makode", "Yash Madhav Bhopale", "Prashant Diliprao Kadu"},
                    {"Group 02", "Intelligence Browser Forensics Platform For Financial Fraud Investigation", "Cyber Forensics & FinTech", "React, Node.js, Spring Boot, SQLite, Python", "Dr. V. B. Gadicha", "Tejas Rajeshrao Tulaskar", "Vedant Ganeshrao Bondare", "Suraj Premsing Gothwad", "Nakul Ravindra Wakode", "Amit Praful Deshmukh", "Shivam Deshmukh"},
                    {"Group 03", "Data driven approach for crop yield prediction using machine learning techniques", "Agricultural Informatics", "Python, Scikit-learn, Pandas, React, Flask", "Dr. A. D. Raut", "Janhvi jawarkar", "Janhvi jari", "Arpita Solanke", "Tejeshwini ghule", "Atharv sune"},
                    {"Group 04", "An AI Security Copilot for Monitoring & Recommendation from various Security Threats for Small and Medium Scale Businesses (SMBs)", "Cyber Security & LLMs", "React, Spring Boot, LangChain, Python, MySQL", "Dr. Z. I. Khan", "Yashowardhan Thakare", "Rutuja Ghongade", "Anisha Kaware", "Radha Mankar", "Payal Pawar"},
                    {"Group 05", "AI-Powered Smart Inventory and Procurement System", "Supply Chain & Predictive Analytics", "React, Spring Boot, MySQL, TensorFlow", "Prof. M. S. Burange", "Aarti Dinkar Chopade", "Rishika Kause", "Vaibhavi Banarase", "Sanket Chothe", "Roshni Ganesar", "Pratik Hore"},
                    {"Group 06", "AI-Driven Real Time Density Monitoring and Dynamic Signal Regulation System", "Smart Traffic & Computer Vision", "YOLOv8, Python, OpenCV, IoT, React, MySQL", "Dr. A. A. Tayade", "Yash Haridas Warhade", "Sarthak Rajendra Solav", "Shantanu Sanjay Wanare", "Nikunj Mukesh Pandya"},
                    {"Group 07", "Cloud Based Interior Design and Resource Management System", "Cloud Architecture & Graphics", "Three.js, React, Spring Boot, AWS/GCP, MySQL", "Prof. A. D. Chokhat", "Hariom Pradip Gujarkar", "Krish Shailesh Gupta", "Sakshi Suresh Dhurde", "Devyani Shekhar Bharare", "Janhavi Sudhir Kandalkar", "Prachi Subhash Bhade"},
                    {"Group 08", "ResortSync: Smart Resort Management with AI Business Intelligence", "Hospitality Informatics & BI", "React, Spring Boot, MySQL, PowerBI/ChartJS", "Prof. S. R. Kale", "Mohan Rameshwar Barde", "Khushi Umanath Sharma", "Krupa G. Lonare", "Harsh Ambadas Nawle", "Ankit Manoj Raut"},
                    {"Group 09", "Crop Vision - AI Powered Smart Farming Assistant", "Smart Agriculture & AI", "Mobile/React, Python, PyTorch, Spring Boot", "Prof. M. K. Nichat", "Aniket Wankhade", "Meher Ishwar Gautam", "Dweep Gadge", "Rushikesh Pilantre", "Ajay Pawar", "Vedant khanke", "Swaraj Arvind Kalane"},
                    {"Group 10", "AI-Powered Member Matchmaking Agent", "Recommendation Systems & Agents", "React, Spring Boot, LangChain, MySQL", "Prof. J. C. Bambal", "Vedansh Rotale", "Aryan Tekade", "Soham Bobade", "Shashank Dudhe", "Mayur Agrawal"},
                    {"Group 11", "BankMate: An AI Agent for Banking Operations", "FinTech & Conversational AI", "React, Spring Boot, Rasa/LLM, MySQL", "Prof. S. S. Mamarde", "Komal Kuyte", "Ishwari Wankhade", "Aachal Tayde", "Deep Yadav", "Anuj Kuralkar"},
                    {"Group 12", "OutreacheIQ : AI Powered Sales Automation & Lead Engagement Platform", "CRM & Sales Intelligence", "React, Spring Boot, Python, MySQL", "Prof. P. S. Yawale", "Kunal Raju Ganeshkar", "Ananya Pradip Sahare", "Shreya Narendra Kale", "Mohammed yaseen", "Om Sanjayrao Belsare", "Pranav Ravindra Chandane"},
                    {"Group 13", "Dev hub - Internal portal Developer", "Enterprise Developer Portals", "React, Spring Boot, Docker, Git Integration", "Prof. B. V. Kasar", "Minakshi Santosh Bobade", "Sakshi Ganesh Rathod", "Gayatri Anil kanake", "Rashmi Kaware", "Shravani Bire"},
                    {"Group 14", "BizBloom – Digital Branding & Creative Solutions", "Digital Media & MarTech", "React, Node/Spring Boot, MySQL", "Prof. A. M. Bhoyar", "Manjiri Bharat Raut", "Prachi Vijay Kalamkar", "Sanjivani Subhash Gedekar", "Saiyad Naved", "Suhani Vinod Bhoyar"},
                    {"Group 15", "Smart School Bus", "IoT Tracking & Child Safety", "GPS/GSM, React, Spring Boot, Mobile, MySQL", "Prof. J. S. Wankhade", "Samiksha Tejrao Chavan", "Rajshri Dhumane", "Krutika Warthi", "Chaitanya Ladole", "Gorakh Tapadiya"},
                    {"Group 16", "An AI-Powered Organizational Knowledge Management Platform Using Large Language Models for Intelligent Meeting Understanding and Semantic Knowledge Retrieval", "Knowledge Engineering & LLMs", "Whisper, LangChain, ChromaDB, React, Spring Boot", "Prof. V. B. Bambode", "Tushar Deshmukh", "Vyankatesh Talokar", "Huzefa Khan", "Ankita Bharat Rathod", "Rajnandini S. Ingle", "Vaishnavi Ther"},
                    {"Group 17", "Advance Workforce Performance Analytics for Employee and Organizational Intelligence", "HR Analytics & BI", "React, Spring Boot, Python, Chart.js, MySQL", "Prof. P. G. Nemade", "Janhavi Raut", "Arpita Gavhale", "Shruti Mohitkar", "Sejal Basantwani"},
                    {"Group 18", "Disaster Response Platform for Emergency Rescue and Public Safety", "Public Safety & Geospatial Tech", "React, Spring Boot, Leaflet/Mapbox, WebSockets, MySQL", "Prof. H. D. Gujar", "Hemant Yeul", "Harish Bodkhe", "Hrushikesh Sonule", "Shubham Gawai", "Sarwadnya Pawar", "Sanket Anil Chandankhede"},
                    {"Group 19", "CampusFlow : Campus Flow:EdTech Training & Admission Management Portal", "EdTech & Institutional Automation", "React, Spring Boot, REST API, MySQL", "Prof. S. S. Solanke", "Ishika sandip gangan", "Vaibhav kisanrao Gawande", "Atharva Arvind Dethe", "Vansh sanjay Zade", "Hrushikesh pradeep Dhore"},
                    {"Group 20", "VIRA: Vital Incident Response App – An AI-Powered Predictive Women Safety and Emergency Response Platform", "Women Safety & Emergency Tech", "Flutter/React, Spring Boot, Geolocation, SMS/Alerts", "Prof. S. M. Choudhari", "Gagan Santosh Dave", "Om S. Wadurkar", "Achal M. Pande", "Vaishnavi J. Katare", "Ashutosh R. Parde"},
                    {"Group 21", "Household Electricity Consumption Analytics using GCP Services", "Cloud Analytics & Smart Metering", "GCP BigQuery, Looker, React, Spring Boot, Python", "Prof. D. D. Mehare", "Astha Ravindra Fulzele", "Aditi Vilasrao Tikhe", "Mahir Dipak Kalawate", "Purva Baburao Ghatol", "Udaykiran Prabhakar Chukkalwar"},
                    {"Group 22", "Electronic Health Record Companion for ASHA Workers", "Healthcare Informatics & Public Health", "Offline-first React PWA, Spring Boot, MySQL", "Dr. P. M. Jawandhiya", "Siddhant Kailas Taywade", "Bhumika Vinay Chandak", "Bhumika Mohan Bhalerao", "Sayali Gajanan Tayade", "Gauri Gajanan Modak"},
                    {"Group 23", "HealthGuardain- AI Powered Preventive Healthcare Platform", "Healthcare & Predictive Diagnostics", "React, Spring Boot, Python, Scikit-learn, MySQL", "Dr. V. B. Gadicha", "Pranav Santosh Kedar", "Nishant Ganesh Mahalle", "Shekh Sameer Shekh Salim", "Kaushal Surendra Boharupi", "Deepansh Chandrakant Dharmik"},
                    {"Group 24", "Next Gen Hiring", "Recruitment Tech & Resume AI", "React, Spring Boot, Python NLP, MySQL", "Dr. A. D. Raut", "Ritesh Gajanan Ubarhande", "Vikas Sitaram Adhe", "Sujal Anil Manwar", "Ayush Kolhe", "Saurabh Ranotkar"},
                    {"Group 25", "Virtual Cosmetic Try-On System Integrated with an E-Commerce Website", "AR & E-Commerce Tech", "WebAssembly, OpenCV/WebGL, React, Spring Boot", "Dr. Z. I. Khan", "Ved Shirish Sawarkar", "Gaurang Moharle", "Arnav Taley", "Ninad Ghodmare", "Swaraj Mahalle"},
                    {"Group 26", "CI/CD pipeline Dashboard", "DevOps & Cloud Monitoring", "React, Spring Boot, GitHub/GitLab APIs, Docker", "Prof. M. S. Burange", "Dhiraj Vinod Chaudhari", "Pranav Liladhar Kute", "Tanmay Zile", "Sanchit Sarode", "Taterao Dongardive", "Ayush Kohale"},
                    {"Group 27", "AI-Powered Alumni Mentorship& Career Networking Platform", "Alumni Relations & Networking", "React, Spring Boot, Machine Learning, MySQL", "Dr. A. A. Tayade", "Gauri Avinash Wadatkar", "Gauri Rajendra Kalbande", "Vedika Umesh Indorkar", "Poonam Ingole", "Pradnya Sahebrao Sirsat"},
                    {"Group 28", "My Career Path: An AI-Driven Smart Journey Towards Career Achievement", "Career Guidance & AI Recommendation", "React, Spring Boot, Python, MySQL", "Prof. A. D. Chokhat", "Divya Gunvant Khodankar", "Anushka Mohan Yeole", "Shrutika Sandip Uke", "Prachi Pradip Bhute", "Shravani Rameshwar Kolhe", "Sonali Subhash Agarkar"},
                    {"Group 29", "Employix HRM CRM – Human Resource & Employee Management System", "HRM & Enterprise Operations", "React, Spring Boot, JPA, MySQL", "Prof. S. R. Kale", "Pranjal Narendra Pandav", "Dnyaneshwari Vijay Wankhade", "Ankita Ashok Niwalkar", "Shravani Gajendra Lahane", "Samiksha Tikaram Dewase"},
                    {"Group 30", "Career Link – Online Job Posting & Recruitment Management System", "Job Portals & Recruitment", "React, Spring Boot, MySQL", "Prof. M. K. Nichat", "Prayas Omprakash Bansod", "Pranav Dinesh Tayade", "Adesh Ashok Kapse", "Vedant Anilrao Silaskar", "Aditya Ashish Mishra"},
                    {"Group 31", "NutriCare – Smart Nutrition & Wellness System", "Healthcare & Dietetics", "React, Spring Boot, Nutrition APIs, MySQL", "Prof. J. C. Bambal", "Ishwari Romdeo Kale", "Humera Sadaf Syed Noor", "Prajakta Dipak Patil", "Sharvari Gajendra Kalbande", "Sania Vinod Santani", "Amisha Shyam Bharaskar"},
                    {"Group 32", "Hireflow : Enterprise Campus Placement Tracker", "Placement Management & Analytics", "React, Spring Boot, MySQL, Excel Reports", "Prof. S. S. Mamarde", "Shreya Lavhale", "Yadarthi Pund", "Shruti Lende", "Tanushree wagh", "Kartik Tawalare", "Gayatri Sanjay Thakare"},
                    {"Group 33", "Employee Reimbursement Management Portal", "FinTech & Corporate Operations", "React, Spring Boot, JPA, OCR, MySQL", "Prof. P. S. Yawale", "Sanika Gajanan Kadu", "Khushi Dangda", "Shravan Kharad", "Prasad Ganorkar"},
                    {"Group 34", "Examination Portal", "Assessment & Examination Tech", "React, Spring Boot, Anti-Cheating APIs, MySQL", "Prof. B. V. Kasar", "Rushikesh Kankale", "Pranav Rase", "Pratik Bhatkar", "Sanket pachpol", "Shreyash Deshmukh"},
                    {"Group 35", "SmartAgri - Fertilizer Sales & Inventory Management System", "AgriTech & Supply Chain", "React, Spring Boot, MySQL, Analytics", "Prof. A. M. Bhoyar", "Sneha Pravin Sahu", "Khushi Gajanan Rewatkar", "Shraddha Narendra Bhuyar", "Vedanti Jaykumar Dhote", "Shreya Nandurkar", "Swarangi Vijay Pokale"},
                    {"Group 36", "Neocube Realty – Smart Real Estate Management & Property Consultation Platform", "Real Estate & PropTech", "React, Spring Boot, GIS/Leaflet, MySQL", "Prof. J. S. Wankhade", "Pranjal Najukrao Rane", "Muskan Madhwani", "Vaishnavi Sawarkar", "Kajal Gawande", "Achal Pande", "Chanchal Karwa"},
                    {"Group 37", "AI-Based Phishing Email Detection System", "Cyber Security & NLP", "React, Spring Boot, Python, Scikit-learn, BERT, MySQL", "Prof. V. B. Bambode", "Shrutika Piprikar", "Vaibhavi Nirgude", "Sanskruti Tayde", "Lavanya Mendhe", "Bhavana Makode"},
                    {"Group 38", "Smart Bussiness Analytics", "Business Intelligence & Predictive Analytics", "React, Spring Boot, Python, BI Dashboards, MySQL", "Prof. P. G. Nemade", "Tanvi Vijay Badge", "Shravani Ganeshrao Bhange", "Vaishanavi Sanjay Solav", "Jaya Santosh Dhule", "Vaishanavi Sunil Lande"}
            };

            int rollCounter = 1;
            int studentUserIdx = 1;

            for (int i = 0; i < allGroupsData.length; i++) {
                String[] gData = allGroupsData[i];
                String groupNum = gData[0];
                String projTitle = gData[1];
                String domain = gData[2];
                String tech = gData[3];
                String guideName = gData[4];
                String leaderName = gData[5];

                // 1. Create Group
                ProjectGroup group = projectGroupRepository.save(new ProjectGroup(groupNum, currentYear));

                // 2. Create Leader Student
                String leaderUsername = "student" + String.format("%02d", studentUserIdx++);
                String rollNo = "CS2026-" + String.format("%03d", rollCounter++);
                User uLead = userRepository.save(new User(leaderUsername, studentPassword, leaderName, leaderUsername + "@student.college.edu", "98765" + String.format("%05d", rollCounter), studentRole));
                Student sLead = studentRepository.save(new Student(uLead, rollNo, "Computer Science & Engineering", 7, currentYear));
                groupMemberRepository.save(new GroupMember(group, sLead, true));

                // 3. Create Other Members
                for (int m = 6; m < gData.length; m++) {
                    String memberName = gData[m];
                    String memberUsername = "student" + String.format("%02d", studentUserIdx++);
                    String mRollNo = "CS2026-" + String.format("%03d", rollCounter++);
                    User uMem = userRepository.save(new User(memberUsername, studentPassword, memberName, memberUsername + "@student.college.edu", "98765" + String.format("%05d", rollCounter), studentRole));
                    Student sMem = studentRepository.save(new Student(uMem, mRollNo, "Computer Science & Engineering", 7, currentYear));
                    groupMemberRepository.save(new GroupMember(group, sMem, false));
                }

                // 4. Allocate Guide
                Guide guide = guideMap.get(guideName);
                if (guide != null) {
                    guideAllocationRepository.save(new GuideAllocation(group, guide, headUser));
                }

                // 5. Create Project
                Project proj = new Project(group, currentYear, projTitle,
                        "Capstone academic project on " + projTitle + " incorporating advanced software architectural design, lifecycle reporting and testing.",
                        domain, tech, LocalDate.now().minusMonths(2), LocalDate.now().plusMonths(6));
                proj.setStatus(i == 0 ? ProjectStatus.ON_TRACK : (i % 3 == 0 ? ProjectStatus.IN_PROGRESS : ProjectStatus.ON_TRACK));
                projectRepository.save(proj);

                // 6. Populate Project Milestones
                LocalDate rollingDate = proj.getStartDate();
                for (int mIdx = 0; mIdx < templateMilestones.size(); mIdx++) {
                    Milestone tm = templateMilestones.get(mIdx);
                    rollingDate = rollingDate.plusDays(tm.getDefaultDeadlineDays());
                    ProjectMilestone pm = new ProjectMilestone(proj, tm, rollingDate);

                    if (mIdx < 2) {
                        pm.setStatus(MilestoneStatus.COMPLETED);
                        pm.setCompletedAt(LocalDateTime.now().minusDays(30 - mIdx * 5L));
                    } else if (mIdx == 2 && i < 5) {
                        pm.setStatus(MilestoneStatus.COMPLETED);
                        pm.setCompletedAt(LocalDateTime.now().minusDays(10));
                    } else {
                        pm.setStatus(MilestoneStatus.PENDING);
                    }
                    projectMilestoneRepository.save(pm);

                    if (mIdx == 1 && i < 10) { // Synopsis submission for first 10 groups
                        Submission sub = new Submission(pm, proj, group, "SYNOPSIS");
                        sub.setStatus(SubmissionStatus.VERIFIED);
                        sub.setCurrentVersion(1);
                        sub.setLastSubmittedAt(LocalDateTime.now().minusDays(20));
                        submissionRepository.save(sub);

                        SubmissionVersion sv = new SubmissionVersion(sub, 1, SubmissionMode.ONLINE,
                                "uploads/" + groupNum.replace(" ", "_") + "_Synopsis_v1.pdf",
                                groupNum.replace(" ", "_") + "_Synopsis_v1.pdf", 1048576L,
                                "Initial project synopsis with problem statement and architecture diagram.", uLead);
                        submissionVersionRepository.save(sv);

                        FeedbackTemplate approvedTemplate = feedbackTemplateRepository.findByCode("APPROVED").orElse(null);
                        Review review = new Review(sv, sub, guide, "VERIFIED", approvedTemplate,
                                "Your submission has been reviewed and approved. Excellent work.",
                                "Synopsis is clear, methodology is viable and technical requirements are well specified.");
                        reviewRepository.save(review);
                    }
                }

                // 7. Presentations
                Presentation pres1 = new Presentation(currentYear, proj, 1, "Presentation 1 (Problem & SRS)",
                        LocalDate.now().minusDays(15), LocalTime.of(10, 0), LocalTime.of(10, 30),
                        "Seminar Hall " + ((i % 3) + 1), "Problem statement, SRS analysis, and basic prototype walkthrough");
                pres1.setStatus(i < 8 ? PresentationStatus.COMPLETED : PresentationStatus.SCHEDULED);
                presentationRepository.save(pres1);

                if (i < 8 && guide != null) {
                    presentationEvaluationRepository.save(new PresentationEvaluation(pres1, guide,
                            new BigDecimal(String.valueOf(42 + (i % 8))),
                            new BigDecimal("50.00"),
                            "Strong teamwork, clear explanation of module interfaces, and good domain clarity.",
                            "PRESENT"));
                }

                Presentation pres2 = new Presentation(currentYear, proj, 2, "Presentation 2 (Mid-Term Progress)",
                        LocalDate.now().plusWeeks(3), LocalTime.of(11, 0), LocalTime.of(11, 30),
                        "Seminar Hall " + ((i % 3) + 1), "Midterm demonstration of working features and database integration");
                pres2.setStatus(PresentationStatus.SCHEDULED);
                presentationRepository.save(pres2);

                Presentation pres3 = new Presentation(currentYear, proj, 3, "Final Presentation & Viva",
                        LocalDate.now().plusMonths(3), LocalTime.of(9, 30), LocalTime.of(10, 15),
                        "Auditorium", "Final project exhibition, test results, code walkthrough and viva voce");
                pres3.setStatus(PresentationStatus.SCHEDULED);
                presentationRepository.save(pres3);
            }

            // Notices
            noticeRepository.save(new Notice("Academic Year 2026-27 Major Project Guidelines Released",
                    "All 38 project groups must strictly review the official departmental formatting guidelines for Synopsis, SRS, and Progress Reports.",
                    NoticePriority.HIGH, NoticeTarget.ALL, null, LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(6), headUser));

            noticeRepository.save(new Notice("Presentation 1 Evaluation Schedule",
                    "First stage reviews for all groups are underway. Please verify your scheduled seminar hall and arrive 10 minutes prior with slides.",
                    NoticePriority.HIGH, NoticeTarget.ROLE_STUDENT, null, LocalDate.now().minusDays(15), LocalDate.now().plusDays(30), headUser));

            logger.info("Successfully seeded all 38 groups, students, guides, projects, and allocations!");
        }
    }
}
