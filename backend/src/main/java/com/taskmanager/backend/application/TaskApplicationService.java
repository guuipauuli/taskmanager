package com.taskmanager.backend.application;

import com.taskmanager.backend.application.port.in.CreateTaskUseCase;
import com.taskmanager.backend.application.port.in.DeleteTaskUseCase;
import com.taskmanager.backend.application.port.in.GetTaskUseCase;
import com.taskmanager.backend.application.port.in.ListTasksUseCase;
import com.taskmanager.backend.application.port.in.UpdateTaskUseCase;
import com.taskmanager.backend.application.port.out.TaskEventPublisherPort;
import com.taskmanager.backend.application.port.out.TaskRepositoryPort;
import com.taskmanager.backend.domain.Task;
import com.taskmanager.backend.domain.TaskNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskApplicationService implements
        CreateTaskUseCase,
        ListTasksUseCase,
        GetTaskUseCase,
        UpdateTaskUseCase,
        DeleteTaskUseCase {

    private final TaskRepositoryPort taskRepository;
    private final TaskEventPublisherPort taskEventPublisher;

    public TaskApplicationService(TaskRepositoryPort taskRepository, TaskEventPublisherPort taskEventPublisher) {
        this.taskRepository = taskRepository;
        this.taskEventPublisher = taskEventPublisher;
    }

    @Override
    public Task create(CreateTaskCommand command) {
        Task created = Task.create(command.title(), command.description());
        Task saved = taskRepository.save(created);
        taskEventPublisher.publishTaskCreated(saved);
        return saved;
    }

    @Override
    public List<Task> list() {
        return taskRepository.findAll();
    }

    @Override
    public Task getById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
    }

    @Override
    public Task update(Long id, UpdateTaskCommand command) {
        Task existing = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));

        Task updated = existing
                .withTitleAndDescription(command.title(), command.description())
                .withStatus(command.status());

        Task saved = taskRepository.save(updated);
        taskEventPublisher.publishTaskUpdated(saved);
        return saved;
    }

    @Override
    public void delete(Long id) {
        taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        taskRepository.deleteById(id);
    }
}
