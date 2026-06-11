package com.taskmanager.backend.api.dto;

import com.taskmanager.backend.domain.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateTaskRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 1000) String description,
        @NotNull TaskStatus status
) {
}
