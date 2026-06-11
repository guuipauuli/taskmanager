package com.taskmanager.backend.api;

import com.taskmanager.backend.api.dto.CreateTaskRequest;
import com.taskmanager.backend.api.dto.TaskResponse;
import com.taskmanager.backend.api.dto.UpdateTaskRequest;
import com.taskmanager.backend.application.port.in.CreateTaskUseCase;
import com.taskmanager.backend.application.port.in.DeleteTaskUseCase;
import com.taskmanager.backend.application.port.in.GetTaskUseCase;
import com.taskmanager.backend.application.port.in.ListTasksUseCase;
import com.taskmanager.backend.application.port.in.UpdateTaskUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final CreateTaskUseCase createTaskUseCase;
    private final ListTasksUseCase listTasksUseCase;
    private final GetTaskUseCase getTaskUseCase;
    private final UpdateTaskUseCase updateTaskUseCase;
    private final DeleteTaskUseCase deleteTaskUseCase;
    private final TaskApiMapper mapper;

    public TaskController(
            CreateTaskUseCase createTaskUseCase,
            ListTasksUseCase listTasksUseCase,
            GetTaskUseCase getTaskUseCase,
            UpdateTaskUseCase updateTaskUseCase,
            DeleteTaskUseCase deleteTaskUseCase
    ) {
        this.createTaskUseCase = createTaskUseCase;
        this.listTasksUseCase = listTasksUseCase;
        this.getTaskUseCase = getTaskUseCase;
        this.updateTaskUseCase = updateTaskUseCase;
        this.deleteTaskUseCase = deleteTaskUseCase;
        this.mapper = new TaskApiMapper();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@Valid @RequestBody CreateTaskRequest request) {
        return mapper.toResponse(createTaskUseCase.create(mapper.toCreateCommand(request)));
    }

    @GetMapping
    public List<TaskResponse> list() {
        return listTasksUseCase.list().stream().map(mapper::toResponse).toList();
    }

    @GetMapping("/{id}")
    public TaskResponse getById(@PathVariable Long id) {
        return mapper.toResponse(getTaskUseCase.getById(id));
    }

    @PutMapping("/{id}")
    public TaskResponse update(@PathVariable Long id, @Valid @RequestBody UpdateTaskRequest request) {
        return mapper.toResponse(updateTaskUseCase.update(id, mapper.toUpdateCommand(request)));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        deleteTaskUseCase.delete(id);
    }
}
