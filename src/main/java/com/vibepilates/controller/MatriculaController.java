package com.vibepilates.controller;

import com.vibepilates.model.MatriculaDTO;
import com.vibepilates.model.Matrícula;
import com.vibepilates.model.Usuario;
import com.vibepilates.repository.MatriculaRepository;
import com.vibepilates.repository.UsuarioRepository;
import com.vibepilates.service.MatriculaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/matricula")
public class MatriculaController {

    @Autowired
    private MatriculaRepository repository;
    @Autowired
    private MatriculaService service;
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Matrícula> matriculas = repository.findAll();
        if (matriculas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Nenhuma matrícula encontrada.");
        }
        return ResponseEntity.ok(matriculas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Optional<Matrícula> matricula = repository.findById(id);
        if (matricula.isPresent()) {
            return ResponseEntity.ok(matricula.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Matrícula com ID " + id + " não encontrada.");
        }
    }
    
    @GetMapping("/usuario/{id}")
    public ResponseEntity<?> getMatriculasPorId(@PathVariable String id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Usuário com nome " + id + " não encontrado.");
        }

        List<Matrícula> matriculas = repository.findByIdUsuario(usuario.get().getIdUsuario());
        if (matriculas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Nenhuma matrícula encontrada para o usuário " + id + ".");
        }

        return ResponseEntity.ok(matriculas);
    }

    @PostMapping
    public ResponseEntity<String> criarMatricula(@RequestBody MatriculaDTO matriculaDTO) {
    	System.out.println(matriculaDTO.getAulasSelecionadas());
        Matrícula matricula = service.converterDtoParaEntidade(matriculaDTO);
        service.salvar(matricula);
        return ResponseEntity.ok("Matrícula criada com sucesso!");
    }


    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody Matrícula matricula) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Matrícula com ID " + id + " não encontrada.");
        }
        matricula.setIdMatricula(id);
        repository.save(matricula);
        return ResponseEntity.ok("✅ Matrícula atualizada com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Matrícula com ID " + id + " não encontrada.");
        }
        repository.deleteById(id);
        return ResponseEntity.ok("✅ Matrícula deletada com sucesso!");
    }
    
    @DeleteMapping("/limparTodos")
    public ResponseEntity<String> apagarTodasMatriculas() {
    	repository.deleteAll();
        return ResponseEntity.ok("Todas as matrículas foram apagadas.");
    }
}
