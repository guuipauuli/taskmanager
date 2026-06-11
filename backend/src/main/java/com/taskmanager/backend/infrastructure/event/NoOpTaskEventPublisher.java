package com.taskmanager.backend.infrastructure.event;

import com.taskmanager.backend.application.port.out.TaskEventPublisherPort;
import com.taskmanager.backend.domain.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class NoOpTaskEventPublisher implements TaskEventPublisherPort {

    private static final Logger LOGGER = LoggerFactory.getLogger(NoOpTaskEventPublisher.class);

    @Override
    public void publishTaskCreated(Task task) {
        LOGGER.debug("No-op event publisher for task created: {}", task.id());
    }

    @Override
    public void publishTaskUpdated(Task task) {
        LOGGER.debug("No-op event publisher for task updated: {}", task.id());
    }
}
