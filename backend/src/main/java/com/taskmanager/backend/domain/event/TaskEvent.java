package com.taskmanager.backend.domain.event;

import com.taskmanager.backend.domain.TaskStatus;

import java.time.Instant;
import java.util.UUID;

public record TaskEvent(
        UUID eventId,
        TaskEventType eventType,
        Long taskId,
        String title,
        String description,
        TaskStatus status,
        Instant occurredAt
) {
}
