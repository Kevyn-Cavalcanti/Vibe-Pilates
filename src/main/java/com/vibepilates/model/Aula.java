package com.vibepilates.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "aulas")
public class Aula {

    @Id
    private String idAula;

    private String idUsuarioAluno;
    private String idUsuarioProfessor;
    private Date data;
    private String status;

    public Aula() {
    }

    public String getIdAula() {
        return idAula;
    }

    public void setIdAula(String idAula) {
        this.idAula = idAula;
    }

    public String getIdUsuarioAluno() {
        return idUsuarioAluno;
    }

    public void setIdUsuarioAluno(String idUsuarioAluno) {
        this.idUsuarioAluno = idUsuarioAluno;
    }

    public String getIdUsuarioProfessor() {
        return idUsuarioProfessor;
    }

    public void setIdUsuarioProfessor(String idUsuarioProfessor) {
        this.idUsuarioProfessor = idUsuarioProfessor;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
