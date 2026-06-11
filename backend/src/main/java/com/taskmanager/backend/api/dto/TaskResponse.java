package com.taskmanager.backend.api.dto;

import com.taskmanager.backend.domain.TaskStatus;

import java.time.Instant;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        Instant createdAt
) {
}
