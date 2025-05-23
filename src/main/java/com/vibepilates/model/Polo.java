package com.vibepilates.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "polo")
public class Polo {

    @Id
    private String idPolo;
    private String idUsuario;
    private String nome; 
    private Endereco endereco;
    private List<String> datahoradisponiveis;//["Segunda", "Terça"]
    private String planoeprecodisponiveis;//"Mensal", "Trimestral", "Semestral", "Anual".

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
    
    public List<String> getDiasDisponiveis() {
        return datahoradisponiveis;
    }

    public void setDiasDisponiveis(List<String> datahorapreferida) {
        this.datahoradisponiveis = datahorapreferida;
    }

    public String getPlano() {
        return planoeprecodisponiveis;
    }

    public void setPlano(String plano) {
        this.planoeprecodisponiveis = plano;
    }
}