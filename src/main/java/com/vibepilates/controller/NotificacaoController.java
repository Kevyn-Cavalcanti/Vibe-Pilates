package com.vibepilates.controller;

import com.vibepilates.model.Notificacao;
import com.vibepilates.repository.NotificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notificacao")
public class NotificacaoController {

    @Autowired
    private NotificacaoRepository repository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Notificacao> notificacoes = repository.findAll();
        if (notificacoes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Nenhuma notificação encontrada.");
        }
        return ResponseEntity.ok(notificacoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Optional<Notificacao> notificacao = repository.findById(id);
        if (notificacao.isPresent()) {
            return ResponseEntity.ok(notificacao.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Notificação com ID " + id + " não encontrada.");
        }
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody Notificacao notificacao) {
        repository.save(notificacao);
        return ResponseEntity.status(HttpStatus.CREATED).body("✅ Notificação criada com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody Notificacao notificacao) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Notificação com ID " + id + " não encontrada.");
        }
        notificacao.setIdNotificacao(id);
        repository.save(notificacao);
        return ResponseEntity.ok("✅ Notificação atualizada com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Notificação com ID " + id + " não encontrada.");
        }
        repository.deleteById(id);
        return ResponseEntity.ok("✅ Notificação deletada com sucesso!");
    }
}
