package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.dto.response.AuditLogDto;
import com.academic.projectmonitoring.entity.AuditLog;
import com.academic.projectmonitoring.entity.InAppNotification;
import com.academic.projectmonitoring.entity.User;
import com.academic.projectmonitoring.repository.AuditLogRepository;
import com.academic.projectmonitoring.repository.InAppNotificationRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void log(Long userId, String username, String role, String action, String entityName, Long entityId, String details) {
        String clientIp = "127.0.0.1";
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    clientIp = xForwardedFor.split(",")[0].trim();
                } else {
                    clientIp = request.getRemoteAddr();
                }
            }
        } catch (Exception ignored) {}

        AuditLog auditLog = new AuditLog(userId, username != null ? username : "SYSTEM",
                role != null ? role : "SYSTEM", action, entityName, entityId, details, clientIp);
        auditLogRepository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public List<AuditLogDto> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AuditLogDto mapToDto(AuditLog log) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());
        dto.setUserId(log.getUserId());
        dto.setUsername(log.getUsername());
        dto.setRole(log.getRole());
        dto.setAction(log.getAction());
        dto.setEntityName(log.getEntityName());
        dto.setEntityId(log.getEntityId());
        dto.setDetails(log.getDetails());
        dto.setIpAddress(log.getIpAddress());
        dto.setTimestamp(log.getTimestamp());
        return dto;
    }
}
