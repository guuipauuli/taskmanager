package com.taskmanager.backend.application;

import com.taskmanager.backend.application.port.in.CreateTaskUseCase;
import com.taskmanager.backend.application.port.in.UpdateTaskUseCase;
import com.taskmanager.backend.application.port.out.TaskEventPublisherPort;
import com.taskmanager.backend.application.port.out.TaskRepositoryPort;
import com.taskmanager.backend.domain.Task;
import com.taskmanager.backend.domain.TaskNotFoundException;
import com.taskmanager.backend.domain.TaskStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskApplicationServiceTest {

    @Mock
    private TaskRepositoryPort taskRepository;

    @Mock
    private TaskEventPublisherPort taskEventPublisher;

    @InjectMocks
    private TaskApplicationService service;

    @Test
    void createShouldPersistTaskAndPublishCreatedEvent() {
        CreateTaskUseCase.CreateTaskCommand command = new CreateTaskUseCase.CreateTaskCommand("Title", "Description");
        Task persisted = new Task(1L, "Title", "Description", TaskStatus.PENDING, Instant.now());
        when(taskRepository.save(any(Task.class))).thenReturn(persisted);

        Task result = service.create(command);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.status()).isEqualTo(TaskStatus.PENDING);
        verify(taskRepository).save(any(Task.class));
        verify(taskEventPublisher).publishTaskCreated(persisted);
    }

    @Test
    void updateShouldPersistUpdatedTaskAndPublishUpdatedEvent() {
        Long taskId = 10L;
        Task existing = new Task(taskId, "Old title", "Old description", TaskStatus.PENDING, Instant.now());
        Task saved = new Task(taskId, "New title", "New description", TaskStatus.DONE, existing.createdAt());

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(existing));
        when(taskRepository.save(any(Task.class))).thenReturn(saved);

        UpdateTaskUseCase.UpdateTaskCommand command =
                new UpdateTaskUseCase.UpdateTaskCommand("New title", "New description", TaskStatus.DONE);

        Task result = service.update(taskId, command);

        assertThat(result.title()).isEqualTo("New title");
        assertThat(result.description()).isEqualTo("New description");
        assertThat(result.status()).isEqualTo(TaskStatus.DONE);
        verify(taskRepository).save(any(Task.class));
        verify(taskEventPublisher).publishTaskUpdated(saved);
    }

    @Test
    void deleteShouldThrowWhenTaskDoesNotExist() {
        Long missingId = 999L;
        when(taskRepository.findById(missingId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete(missingId)).isInstanceOf(TaskNotFoundException.class);

        verify(taskRepository, never()).deleteById(any());
    }

    @Test
    void listShouldReturnAllTasks() {
        List<Task> tasks = List.of(
                new Task(1L, "T1", "D1", TaskStatus.PENDING, Instant.now()),
                new Task(2L, "T2", "D2", TaskStatus.IN_PROGRESS, Instant.now())
        );
        when(taskRepository.findAll()).thenReturn(tasks);

        List<Task> result = service.list();

        assertThat(result).hasSize(2);
        verify(taskRepository).findAll();
    }
}