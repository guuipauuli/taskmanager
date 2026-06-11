package com.taskmanager.backend.domain;

import java.time.Instant;

public record Task(
        Long id,
        String title,
        String description,
        TaskStatus status,
        Instant createdAt
) {

    public static Task create(String title, String description) {
        return new Task(null, title, description, TaskStatus.PENDING, Instant.now());
    }

    public Task withId(Long newId) {
        return new Task(newId, title, description, status, createdAt);
    }

    public Task withStatus(TaskStatus newStatus) {
        return new Task(id, title, description, newStatus, createdAt);
    }

    public Task withTitleAndDescription(String newTitle, String newDescription) {
        return new Task(id, newTitle, newDescription, status, createdAt);
    }
}
