package com.taskmanager.backend.application.port.in;

import com.taskmanager.backend.domain.Task;

import java.util.List;

public interface ListTasksUseCase {
    List<Task> list();
}
