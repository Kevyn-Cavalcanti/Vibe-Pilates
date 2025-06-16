package com.vibepilates.chat.history;

import com.vibepilates.chat.history.ChatMessageDocument;
import com.vibepilates.chat.history.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/mensagemchat")
public class ChatMessageRestController {

    @Autowired
    private ChatMessageRepository repository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<ChatMessageDocument> mensagens = repository.findAll();
        if (mensagens.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Nenhuma mensagem encontrada.");
        }
        return ResponseEntity.ok(mensagens);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Optional<ChatMessageDocument> mensagem = repository.findById(id);
        if (mensagem.isPresent()) {
            return ResponseEntity.ok(mensagem.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Mensagem com ID " + id + " não encontrada.");
        }
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody ChatMessageDocument mensagemChat) {
        repository.save(mensagemChat);
        return ResponseEntity.status(HttpStatus.CREATED).body("✅ Mensagem enviada com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody ChatMessageDocument mensagemChat) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Mensagem com ID " + id + " não encontrada.");
        }
        mensagemChat.setIdMensagemChat(id);
        repository.save(mensagemChat);
        return ResponseEntity.ok("✅ Mensagem atualizada com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Mensagem com ID " + id + " não encontrada.");
        }
        repository.deleteById(id);
        return ResponseEntity.ok("✅ Mensagem deletada com sucesso!");
    }
}
