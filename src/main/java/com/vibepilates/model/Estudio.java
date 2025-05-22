package com.vibepilates.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "estudios")
public class Estudio {

    @Id
    private String idEstudio;
    private String nome;
    private String idUsuario;

    public Estudio() {
    }

    public String getIdEstudio() {
        return idEstudio;
    }

    public void setIdEstudio(String idEstudio) {
        this.idEstudio = idUsuario;
    }
    
    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
