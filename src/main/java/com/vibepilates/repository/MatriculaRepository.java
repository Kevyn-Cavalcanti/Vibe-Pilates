package com.vibepilates.repository;

import com.vibepilates.model.Matrícula;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface MatriculaRepository extends MongoRepository<Matrícula, String> {
	List<Matrícula> findByIdUsuario(String idUsuario);
}
