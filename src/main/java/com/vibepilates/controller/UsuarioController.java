package com.vibepilates.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vibepilates.model.Usuario;
import com.vibepilates.repository.UsuarioRepository;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Usuario> usuarios = repository.findAll();
        if (usuarios.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Nenhum usuário encontrado.");
        }
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Optional<Usuario> usuario = repository.findById(id);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Usuário com ID " + id + " não encontrado.");
        }
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        repository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body("✅ Usuário criado com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody Usuario usuario) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Usuário com ID " + id + " não encontrado.");
        }
        usuario.setIdUsuario(id);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        repository.save(usuario);
        return ResponseEntity.ok("✅ Usuário atualizado com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Usuário com ID " + id + " não encontrado.");
        }
        repository.deleteById(id);
        return ResponseEntity.ok("✅ Usuário deletado com sucesso!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String senha = data.get("senha");

        if (email == null || senha == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email e senha são necessários para o login."));
        }

        Optional<Usuario> optionalUsuario = repository.findByEmail(email);
        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Email inválido."));
        }

        Usuario usuario = optionalUsuario.get();

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Senha incorreta."));
        }
        
        Map<String, Object> response = Map.of(
            "message", "Login bem-sucedido.",
            "usuario", Map.of(
                "idUsuario", usuario.getIdUsuario(),
                "nome", usuario.getNome(),
                "email", usuario.getEmail()
            )
        );

        return ResponseEntity.ok(response);
    }
}
