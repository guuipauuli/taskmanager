package com.taskmanager.backend.infrastructure.event;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class TaskEventConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskEventConsumer.class);

    @KafkaListener(topics = "${app.kafka.topics.task-events:task-events}", groupId = "${spring.kafka.consumer.group-id}")
    public void onTaskEvent(String rawEvent) {
        LOGGER.info("event_consumed payload={}", rawEvent);
    }
}
