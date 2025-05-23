package com.vibepilates.repository;

import com.vibepilates.model.Matrícula;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MatriculaRepository extends MongoRepository<Matrícula, String> {
}
