package com.taskmanager.backend.application.port.in;

import com.taskmanager.backend.domain.Task;

public interface GetTaskUseCase {
    Task getById(Long id);
}
