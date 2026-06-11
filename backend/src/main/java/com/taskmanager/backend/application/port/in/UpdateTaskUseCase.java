package com.taskmanager.backend.application.port.in;

import com.taskmanager.backend.domain.Task;
import com.taskmanager.backend.domain.TaskStatus;

public interface UpdateTaskUseCase {
    Task update(Long id, UpdateTaskCommand command);

    record UpdateTaskCommand(String title, String description, TaskStatus status) {}
}
