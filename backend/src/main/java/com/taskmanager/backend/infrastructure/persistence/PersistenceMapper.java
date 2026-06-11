package com.taskmanager.backend.infrastructure.persistence;

public interface PersistenceMapper<D, E> {

    E toEntity(D domain);

    D toDomain(E entity);
}