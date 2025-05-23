package com.vibepilates.repository;

import com.vibepilates.model.Polo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PoloRepository extends MongoRepository<Polo, String> {
}