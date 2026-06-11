package com.taskmanager.backend.api;

import com.taskmanager.backend.application.port.in.CreateTaskUseCase;
import com.taskmanager.backend.application.port.in.DeleteTaskUseCase;
import com.taskmanager.backend.application.port.in.GetTaskUseCase;
import com.taskmanager.backend.application.port.in.ListTasksUseCase;
import com.taskmanager.backend.application.port.in.UpdateTaskUseCase;
import com.taskmanager.backend.domain.Task;
import com.taskmanager.backend.domain.TaskNotFoundException;
import com.taskmanager.backend.domain.TaskStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
@Import(GlobalExceptionHandler.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CreateTaskUseCase createTaskUseCase;

    @MockitoBean
    private ListTasksUseCase listTasksUseCase;

    @MockitoBean
    private GetTaskUseCase getTaskUseCase;

    @MockitoBean
    private UpdateTaskUseCase updateTaskUseCase;

    @MockitoBean
    private DeleteTaskUseCase deleteTaskUseCase;

    @Test
    void createShouldReturn201AndTaskPayload() throws Exception {
        Task created = new Task(1L, "Title", "Description", TaskStatus.PENDING, Instant.parse("2026-01-01T10:00:00Z"));
        when(createTaskUseCase.create(any(CreateTaskUseCase.CreateTaskCommand.class))).thenReturn(created);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                                                .content("""
                                                                {
                                                                    "title": "Title",
                                                                    "description": "Description"
                                                                }
                                                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Title"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void listShouldReturnTasks() throws Exception {
        List<Task> tasks = List.of(
                new Task(1L, "T1", "D1", TaskStatus.PENDING, Instant.parse("2026-01-01T10:00:00Z")),
                new Task(2L, "T2", "D2", TaskStatus.DONE, Instant.parse("2026-01-01T11:00:00Z"))
        );
        when(listTasksUseCase.list()).thenReturn(tasks);

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].status").value("DONE"));
    }

    @Test
    void getByIdShouldReturn404WithProblemDetailContract() throws Exception {
        when(getTaskUseCase.getById(99L)).thenThrow(new TaskNotFoundException(99L));

        mockMvc.perform(get("/api/tasks/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Task not found"))
                .andExpect(jsonPath("$.code").value("TASK_NOT_FOUND"))
                .andExpect(jsonPath("$.userSafe").value(true));
    }

    @Test
    void updateShouldReturn400WithFieldErrorsWhenValidationFails() throws Exception {
        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                                                .content("""
                                                                {
                                                                    "title": "",
                                                                    "description": "Description",
                                                                    "status": null
                                                                }
                                                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Validation error"))
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.userSafe").value(true))
                .andExpect(jsonPath("$.fieldErrors.title").exists())
                .andExpect(jsonPath("$.fieldErrors.status").exists());
    }

    @Test
    void deleteShouldReturn204() throws Exception {
        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteShouldReturn404WhenTaskDoesNotExist() throws Exception {
        doThrow(new TaskNotFoundException(500L)).when(deleteTaskUseCase).delete(500L);

        mockMvc.perform(delete("/api/tasks/500"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("TASK_NOT_FOUND"));
    }

}