package com.vibepilates.controller;

import com.vibepilates.model.Polo;
import com.vibepilates.repository.PoloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/polo")
public class PoloController {

    @Autowired
    private PoloRepository repository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Polo> polos = repository.findAll();
        if (polos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Nenhum polo encontrado.");
        }
        return ResponseEntity.ok(polos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Optional<Polo> polos = repository.findById(id);
        if (polos.isPresent()) {
            return ResponseEntity.ok(polos.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ polo com ID " + id + " não encontrado.");
        }
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody Polo polo) {
        repository.save(polo);
        return ResponseEntity.status(HttpStatus.CREATED).body("Polo criado com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody Polo polo) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Polo com ID " + id + " não encontrado.");
        }
        polo.setIdPolo(id);
        repository.save(polo);
        return ResponseEntity.ok("✅ Polo atualizado com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Polo com ID " + id + " não encontrado.");
        }
        repository.deleteById(id);
        return ResponseEntity.ok("✅ Polo deletado com sucesso!");
    }
}
