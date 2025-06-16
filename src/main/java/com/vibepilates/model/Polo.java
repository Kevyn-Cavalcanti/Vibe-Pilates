package com.vibepilates.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.vibepilates.model.embedded.AulaDisponivel;
import com.vibepilates.model.embedded.Endereco;
import com.vibepilates.model.embedded.PlanoPreco;

@Document(collection = "polo")
public class Polo {

    @Id
    private String idPolo;
    private String idUsuario;
    private String nome; 
    private Endereco endereco;
    private List<AulaDisponivel> aulasDisponiveis;
    private List<PlanoPreco> planosDisponiveis;

    public Polo() {
    }

    public String getIdPolo() {
        return idPolo;
    }

    public void setIdPolo(String idPolo) {
        this.idPolo = idPolo;
    }
    
    public String getIdUsuario() {
        return idUsuario;
    }
    
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }
    
    public Endereco getEndereco() {
        return endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }
    
    public List<AulaDisponivel> getAulasDisponiveis() {
        return aulasDisponiveis;
    }

    public void setAulasDisponiveis(List<AulaDisponivel> aulasDisponiveis) {
        this.aulasDisponiveis = aulasDisponiveis;
    }

    public List<PlanoPreco> getPlanosDisponiveis() {
        return planosDisponiveis;
    }

    public void setPlanosDisponiveis(List<PlanoPreco> planosDisponiveis) {
        this.planosDisponiveis = planosDisponiveis;
    }
}