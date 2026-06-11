package com.taskmanager.backend.infrastructure.persistence;

import com.taskmanager.backend.application.port.out.TaskRepositoryPort;
import com.taskmanager.backend.domain.Task;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class JpaTaskRepositoryAdapter implements TaskRepositoryPort {

    private final JpaTaskRepository repository;
    private final TaskPersistenceMapper mapper;

    public JpaTaskRepositoryAdapter(JpaTaskRepository repository) {
        this.repository = repository;
        this.mapper = new TaskPersistenceMapper();
    }

    @Override
    public Task save(Task task) {
        TaskEntity saved = repository.save(mapper.toEntity(task));
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Task> findById(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Task> findAll() {
        return repository.findAll().stream().map(mapper::toDomain).toList();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
