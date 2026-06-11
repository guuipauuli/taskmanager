package com.taskmanager.backend.api;

import com.taskmanager.backend.api.dto.CreateTaskRequest;
import com.taskmanager.backend.api.dto.TaskResponse;
import com.taskmanager.backend.api.dto.UpdateTaskRequest;
import com.taskmanager.backend.application.port.in.CreateTaskUseCase;
import com.taskmanager.backend.application.port.in.UpdateTaskUseCase;
import com.taskmanager.backend.domain.Task;

public class TaskApiMapper {

    public CreateTaskUseCase.CreateTaskCommand toCreateCommand(CreateTaskRequest request) {
        return new CreateTaskUseCase.CreateTaskCommand(request.title(), request.description());
    }

    public UpdateTaskUseCase.UpdateTaskCommand toUpdateCommand(UpdateTaskRequest request) {
        return new UpdateTaskUseCase.UpdateTaskCommand(request.title(), request.description(), request.status());
    }

    public TaskResponse toResponse(Task task) {
        return new TaskResponse(task.id(), task.title(), task.description(), task.status(), task.createdAt());
    }
}
