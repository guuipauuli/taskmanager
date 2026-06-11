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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskApplicationService implements
        CreateTaskUseCase,
        ListTasksUseCase,
        GetTaskUseCase,
        UpdateTaskUseCase,
        DeleteTaskUseCase {

    private static final Logger log = LoggerFactory.getLogger(TaskApplicationService.class);

    private final TaskRepositoryPort taskRepository;
    private final TaskEventPublisherPort taskEventPublisher;

    public TaskApplicationService(TaskRepositoryPort taskRepository, TaskEventPublisherPort taskEventPublisher) {
        this.taskRepository = taskRepository;
        this.taskEventPublisher = taskEventPublisher;
    }

    @Override
    public Task create(CreateTaskCommand command) {
        log.info("Creating task with title='{}'", command.title());
        Task created = Task.create(command.title(), command.description());
        Task saved = taskRepository.save(created);
        taskEventPublisher.publishTaskCreated(saved);
        log.info("Task created with id={}", saved.id());
        return saved;
    }

    @Override
    public List<Task> list() {
        return taskRepository.findAll();
    }

    @Override
    public Task getById(Long id) {
        return findTaskOrThrow(id);
    }

    @Override
    public Task update(Long id, UpdateTaskCommand command) {
        log.info("Updating task id={} with status={}", id, command.status());
        Task existing = findTaskOrThrow(id);

        Task updated = existing
                .withTitleAndDescription(command.title(), command.description())
                .withStatus(command.status());

        Task saved = taskRepository.save(updated);
        taskEventPublisher.publishTaskUpdated(saved);
        log.info("Task updated id={}", saved.id());
        return saved;
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting task id={}", id);
        findTaskOrThrow(id);
        taskRepository.deleteById(id);
        log.info("Task deleted id={}", id);
    }

    private Task findTaskOrThrow(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> {
            log.warn("Task not found id={}", id);
            return new TaskNotFoundException(id);
        });
    }
}
