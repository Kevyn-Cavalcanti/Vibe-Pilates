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
        if (aula.getIdUsuarioAluno() == null || aula.getIdUsuarioProfessor() == null ||
            aula.getDataInicio() == null || aula.getDataFim() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("❌ Aluno, professor, data de início e fim são obrigatórios.");
        }

        List<Aula> conflitos = repository.findAll().stream()
                .filter(a -> a.getIdUsuarioProfessor().equals(aula.getIdUsuarioProfessor()) &&
                        a.getDataFim().after(aula.getDataInicio()) &&
                        a.getDataInicio().before(aula.getDataFim()))
                .toList();

        if (!conflitos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("❌ Já existe uma aula marcada com esse professor nesse horário.");
        }

        if (aula.getStatus() == null || aula.getStatus().isEmpty()) {
            aula.setStatus("pendente");
        }

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