package com.vibepilates.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vibepilates.model.Estudio;
import com.vibepilates.repository.EstudioRepository;

@RestController
@RequestMapping("/estudio")
public class EstudioController {

    @Autowired
    private EstudioRepository repository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Estudio> estudios = repository.findAll();
        if (estudios.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "❌ Nenhum estúdio encontrado."));
        }
        return ResponseEntity.ok(estudios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Optional<Estudio> estudios = repository.findById(id);
        if (estudios.isPresent()) {
            return ResponseEntity.ok(estudios.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "❌ Estúdio com ID " + id + " não encontrado."));
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> create(@RequestBody Estudio estudio) {
        repository.save(estudio);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensagem", "✅ Estúdio criado com sucesso!"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> update(@PathVariable String id, @RequestBody Estudio estudio) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "❌ Estúdio com ID " + id + " não encontrado."));
        }
        estudio.setIdEstudio(id);
        repository.save(estudio);
        return ResponseEntity.ok(Map.of("mensagem", "✅ Estúdio atualizado com sucesso!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "❌ Estúdio com ID " + id + " não encontrado."));
        }
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensagem", "✅ Estúdio deletado com sucesso!"));
    }
}
