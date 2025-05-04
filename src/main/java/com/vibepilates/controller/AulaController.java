package com.vibepilates.controller;

import com.vibepilates.model.Aula;
import com.vibepilates.repository.AulaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/aula")
public class AulaController {

    @Autowired
    private AulaRepository repository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Aula> aulas = repository.findAll();
        if (aulas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Nenhuma aula encontrada.");
        }
        return ResponseEntity.ok(aulas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Optional<Aula> aula = repository.findById(id);
        if (aula.isPresent()) {
            return ResponseEntity.ok(aula.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Aula com ID " + id + " não encontrada.");
        }
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody Aula aula) {
        repository.save(aula);
        return ResponseEntity.status(HttpStatus.CREATED).body("✅ Aula criada com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody Aula aula) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Aula com ID " + id + " não encontrada.");
        }
        aula.setIdAula(id);
        repository.save(aula);
        return ResponseEntity.ok("✅ Aula atualizada com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Aula com ID " + id + " não encontrada.");
        }
        repository.deleteById(id);
        return ResponseEntity.ok("✅ Aula deletada com sucesso!");
    }
}
