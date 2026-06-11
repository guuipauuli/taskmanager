package com.taskmanager.backend.infrastructure.persistence;

import com.taskmanager.backend.application.port.out.TaskRepositoryPort;
import com.taskmanager.backend.domain.Task;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class JpaTaskRepositoryAdapter
        extends AbstractJpaRepositoryAdapter<Task, TaskEntity, Long>
        implements TaskRepositoryPort {

    public JpaTaskRepositoryAdapter(JpaTaskRepository repository, TaskPersistenceMapper mapper) {
        super(repository, mapper);
    }

    @Override
    public Task save(Task task) {
        return saveMapped(task);
    }

    @Override
    public Optional<Task> findById(Long id) {
        return findByIdMapped(id);
    }

    @Override
    public List<Task> findAll() {
        return findAllMapped();
    }

    @Override
    public void deleteById(Long id) {
        deleteByIdMapped(id);
    }
}
