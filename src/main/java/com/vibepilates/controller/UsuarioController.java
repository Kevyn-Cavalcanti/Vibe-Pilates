package com.vibepilates.controller;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
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
                    .body(Map.of("error", "❌ Nenhum usuário encontrado."));
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
                    .body(Map.of("error", "❌ Usuário com ID " + id + " não encontrado."));
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> create(@RequestBody Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setDataCad(new Date());
        usuario.setEstado(true); // Garante que o estado seja true ao criar
        repository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensagem", "✅ Usuário criado com sucesso!"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> update(@PathVariable String id, @RequestBody Usuario usuario) {
        Optional<Usuario> usuarioExistenteOpt = repository.findById(id);
        if (usuarioExistenteOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "❌ Usuário com ID " + id + " não encontrado."));
        }

        Usuario usuarioExistente = usuarioExistenteOpt.get();

        // Copia propriedades, ignorando nulas, mas permitindo que 'estado' e 'permissao' sejam atualizados mesmo se forem false/null no request, se o usuário mandar
        BeanUtils.copyProperties(usuario, usuarioExistente, getNullPropertyNames(usuario));

        // Se a senha for enviada no payload, ela é atualizada. Caso contrário, mantém a antiga.
        if (usuario.getSenha() != null && !usuario.getSenha().isEmpty()) { // Adicionado verificação para senha não vazia
            usuarioExistente.setSenha(passwordEncoder.encode(usuario.getSenha()));
        }

        repository.save(usuarioExistente);
        return ResponseEntity.ok(Map.of("mensagem", "✅ Usuário atualizado com sucesso!"));
    }

    private String[] getNullPropertyNames(Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);
        return Arrays.stream(src.getPropertyDescriptors())
                .map(pd -> pd.getName())
                .filter(propertyName -> src.getPropertyValue(propertyName) == null)
                .toArray(String[]::new);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "❌ Usuário com ID " + id + " não encontrado."));
        }
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensagem", "✅ Usuário deletado com sucesso!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String senha = data.get("senha");

        if (email == null || senha == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "❌ Email e senha são necessários para o login."));
        }

        Optional<Usuario> optionalUsuario = repository.findByEmail(email);
        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "❌ Email inválido."));
        }

        Usuario usuario = optionalUsuario.get();

        // Verifica o estado do usuário antes de verificar a senha
        if (!usuario.isEstado()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Sua conta está inativa. Por favor, entre em contato conosco para reativá-la!"));
        }

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "❌ Senha incorreta."));
        }
        
        Map<String, Object> response = Map.of(
                "message", "✅ Login bem-sucedido.",
                "usuario", Map.of(
                        "idUsuario", usuario.getIdUsuario(),
                        "nome", usuario.getNome(),
                        "email", usuario.getEmail(),
                        "permissao", usuario.getPermissao()
                )
        );

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/recuperar-senha")
    public ResponseEntity<?> recuperarSenha(@RequestBody Map<String, String> dados) {
        String email = dados.get("email");
        String novaSenha = dados.get("novaSenha");

        if (email == null || novaSenha == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "❌ Email e nova senha são obrigatórios."));
        }

        Optional<Usuario> optionalUsuario = repository.findByEmail(email);
        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "❌ Usuário com email " + email + " não encontrado."));
        }

        Usuario usuario = optionalUsuario.get();
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        repository.save(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "✅ Senha atualizada com sucesso."));
    }
}