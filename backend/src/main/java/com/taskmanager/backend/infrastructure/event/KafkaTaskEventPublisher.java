package com.taskmanager.backend.infrastructure.event;

import com.taskmanager.backend.application.port.out.TaskEventPublisherPort;
import com.taskmanager.backend.domain.Task;
import com.taskmanager.backend.domain.event.TaskEvent;
import com.taskmanager.backend.domain.event.TaskEventType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class KafkaTaskEventPublisher implements TaskEventPublisherPort {

    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaTaskEventPublisher.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final String topic;

    public KafkaTaskEventPublisher(
            KafkaTemplate<String, String> kafkaTemplate,
            @Value("${app.kafka.topics.task-events:task-events}") String topic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    @Override
    public void publishTaskCreated(Task task) {
        publish(TaskEventType.TASK_CREATED, task);
    }

    @Override
    public void publishTaskUpdated(Task task) {
        publish(TaskEventType.TASK_UPDATED, task);
    }

    private void publish(TaskEventType eventType, Task task) {
        TaskEvent event = new TaskEvent(
                UUID.randomUUID(),
                eventType,
                task.id(),
                task.title(),
                task.description(),
                task.status(),
                Instant.now()
        );

        String key = String.valueOf(task.id());
        try {
            String payload = toJson(event);
            kafkaTemplate.send(topic, key, payload);
            LOGGER.info("event_published type={} taskId={} topic={} eventId={}",
                event.eventType(), event.taskId(), topic, event.eventId());
        } catch (RuntimeException ex) {
            LOGGER.error("event_publish_failed type={} taskId={} topic={} reason={}",
                event.eventType(), event.taskId(), topic, ex.getMessage(), ex);
        }
    }

    private static String toJson(TaskEvent event) {
        return "{" +
                "\"eventId\":\"" + escape(event.eventId().toString()) + "\"," +
                "\"eventType\":\"" + escape(event.eventType().name()) + "\"," +
                "\"taskId\":" + event.taskId() + "," +
                "\"title\":\"" + escape(event.title()) + "\"," +
                "\"description\":\"" + escape(event.description()) + "\"," +
                "\"status\":\"" + escape(event.status().name()) + "\"," +
                "\"occurredAt\":\"" + escape(event.occurredAt().toString()) + "\"" +
                "}";
    }

    private static String escape(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }
}
