package com.taskmanager.backend.application.port.in;

import com.taskmanager.backend.domain.Task;

public interface CreateTaskUseCase {
    Task create(CreateTaskCommand command);

    record CreateTaskCommand(String title, String description) {}
}
