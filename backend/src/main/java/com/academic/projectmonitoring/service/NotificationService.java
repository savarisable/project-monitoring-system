package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.dto.response.NotificationDto;
import com.academic.projectmonitoring.entity.InAppNotification;
import com.academic.projectmonitoring.entity.User;
import com.academic.projectmonitoring.exception.ResourceNotFoundException;
import com.academic.projectmonitoring.repository.InAppNotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final InAppNotificationRepository notificationRepository;

    public NotificationService(InAppNotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public void sendNotification(User user, String title, String message, String category, Long referenceId) {
        if (user == null) return;
        InAppNotification notif = new InAppNotification(user, title, message, category, referenceId);
        notificationRepository.save(notif);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        InAppNotification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (notif.getUser().getId().equals(userId)) {
            notif.setRead(true);
            notificationRepository.save(notif);
        }
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<InAppNotification> unread = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    private NotificationDto mapToDto(InAppNotification notif) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notif.getId());
        dto.setTitle(notif.getTitle());
        dto.setMessage(notif.getMessage());
        dto.setCategory(notif.getCategory());
        dto.setRead(notif.isRead());
        dto.setReferenceId(notif.getReferenceId());
        dto.setCreatedAt(notif.getCreatedAt());
        return dto;
    }
}
