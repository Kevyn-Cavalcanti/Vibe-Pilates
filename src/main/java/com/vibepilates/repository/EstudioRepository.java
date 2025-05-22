package com.vibepilates.repository;

import com.vibepilates.model.Estudio;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstudioRepository extends MongoRepository<Estudio, String> {
    Optional<Estudio> findByNome(String nome);
}
