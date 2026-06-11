package com.taskmanager.backend.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public abstract class AbstractJpaRepositoryAdapter<D, E, ID> {

    private final JpaRepository<E, ID> repository;
    private final PersistenceMapper<D, E> mapper;

    protected AbstractJpaRepositoryAdapter(JpaRepository<E, ID> repository, PersistenceMapper<D, E> mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    protected D saveMapped(D domain) {
        E saved = repository.save(mapper.toEntity(domain));
        return mapper.toDomain(saved);
    }

    protected Optional<D> findByIdMapped(ID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    protected List<D> findAllMapped() {
        return repository.findAll().stream().map(mapper::toDomain).toList();
    }

    protected void deleteByIdMapped(ID id) {
        repository.deleteById(id);
    }
}