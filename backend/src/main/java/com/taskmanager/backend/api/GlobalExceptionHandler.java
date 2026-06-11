package com.taskmanager.backend.api;

import com.taskmanager.backend.domain.TaskNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TaskNotFoundException.class)
    public ProblemDetail handleTaskNotFound(TaskNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Task not found");
        problem.setProperty("code", "TASK_NOT_FOUND");
        problem.setProperty("userSafe", true);
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        GlobalExceptionHandler::fieldErrorMessage,
                        (first, second) -> first
                ));

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Existem campos invalidos no formulario.");
        problem.setTitle("Validation error");
        problem.setProperty("code", "VALIDATION_ERROR");
        problem.setProperty("userSafe", true);
        problem.setProperty("fieldErrors", fieldErrors);
        return problem;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneric(Exception ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocorreu um erro inesperado. Tente novamente."
        );
        problem.setTitle("Unexpected error");
        problem.setProperty("code", "UNEXPECTED_ERROR");
        problem.setProperty("userSafe", true);
        return problem;
    }

    private static String fieldErrorMessage(FieldError error) {
        return error.getDefaultMessage() != null ? error.getDefaultMessage() : "Campo invalido.";
    }
}
