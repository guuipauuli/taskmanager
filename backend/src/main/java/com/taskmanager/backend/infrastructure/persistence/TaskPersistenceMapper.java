package com.taskmanager.backend.infrastructure.persistence;

import com.taskmanager.backend.domain.Task;

public class TaskPersistenceMapper {

    public TaskEntity toEntity(Task task) {
        TaskEntity entity = new TaskEntity();
        entity.setId(task.id());
        entity.setTitle(task.title());
        entity.setDescription(task.description());
        entity.setStatus(task.status());
        entity.setCreatedAt(task.createdAt());
        return entity;
    }

    public Task toDomain(TaskEntity entity) {
        return new Task(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getStatus(),
                entity.getCreatedAt()
        );
    }
}
