package com.vibepilates.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "matricula")
public class Matrícula {

    @Id
    private String idMatricula;

    private String idUsuario;
    private String idPolo;

    private String frequencia;//"2x por semana", "3x por semana"
    private List<String> datahorapreferida;//["Segunda", "Terça"]
    private String planoepreco;//"Mensal", "Trimestral", "Semestral", "Anual".

    public Matrícula() {
    }

    public String getIdMatricula() {
        return idMatricula;
    }

    public void setIdMatricula(String idMatricula) {
        this.idMatricula = idMatricula;
    }

    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getIdPolo() {
        return idPolo;
    }

    public void setIdPolo(String idPolo) {
        this.idPolo = idPolo;
    }

    public String getFrequencia() {
        return frequencia;
    }

    public void setFrequencia(String frequencia) {
        this.frequencia = frequencia;
    }

    public List<String> getDiasPreferidos() {
        return datahorapreferida;
    }

    public void setDiasPreferidos(List<String> datahorapreferida) {
        this.datahorapreferida = datahorapreferida;
    }

    public String getPlano() {
        return planoepreco;
    }

    public void setPlano(String plano) {
        this.planoepreco = plano;
    }
}
