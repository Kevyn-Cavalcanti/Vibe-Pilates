package com.vibepilates.controller;

import com.vibepilates.model.Pagamento;
import com.vibepilates.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pagamento")
public class PagamentoController {

    @Autowired
    private PagamentoRepository repository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Pagamento> pagamentos = repository.findAll();
        if (pagamentos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Nenhum pagamento encontrado.");
        }
        return ResponseEntity.ok(pagamentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Optional<Pagamento> pagamento = repository.findById(id);
        if (pagamento.isPresent()) {
            return ResponseEntity.ok(pagamento.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Pagamento com ID " + id + " não encontrado.");
        }
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody Pagamento pagamento) {
        repository.save(pagamento);
        return ResponseEntity.status(HttpStatus.CREATED).body("✅ Pagamento criado com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody Pagamento pagamento) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Pagamento com ID " + id + " não encontrado.");
        }
        pagamento.setIdPagamento(id);
        repository.save(pagamento);
        return ResponseEntity.ok("✅ Pagamento atualizado com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Pagamento com ID " + id + " não encontrado.");
        }
        repository.deleteById(id);
        return ResponseEntity.ok("✅ Pagamento deletado com sucesso!");
    }
}
