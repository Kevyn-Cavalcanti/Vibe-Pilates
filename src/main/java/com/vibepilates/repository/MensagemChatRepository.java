package com.vibepilates.repository;

import com.vibepilates.model.MensagemChat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MensagemChatRepository extends MongoRepository<MensagemChat, String> {
}