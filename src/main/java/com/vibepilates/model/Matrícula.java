package com.vibepilates.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.vibepilates.model.dto.MatriculaDTO.AulaSelecionadaDTO;
import com.vibepilates.model.embedded.PlanoPreco;

import java.util.List;

@Document(collection = "matricula")
public class Matrícula {

    @Id
    private String idMatricula;

    private String idUsuario;
    private String idPolo;
    private String frequencia;
    private PlanoPreco planoepreco;

    private List<AulaSelecionada> aulasSelecionadas;

    public Matrícula() {}

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

    public PlanoPreco getPlano() {
        return planoepreco;
    }

    public void setPlano(PlanoPreco planoepreco) {
        this.planoepreco = planoepreco;
    }
    
    public List<AulaSelecionada> getAulasSelecionadas() {
    	return aulasSelecionadas;
    }

    public void setAulasSelecionadas(List<AulaSelecionada> aulasSelecionadas) {
        this.aulasSelecionadas = aulasSelecionadas;
    }

    
    
    public static class AulaSelecionada {
        private String modalidade;
        private String diaSemana;
        private Horario horario;

        public String getModalidade() {
            return modalidade;
        }

        public void setModalidade(String modalidade) {
            this.modalidade = modalidade;
        }

        public String getDiaSemana() {
            return diaSemana;
        }

        public void setDiaSemana(String diaSemana) {
            this.diaSemana = diaSemana;
        }

        public Horario getHorario() {
            return horario;
        }

        public void setHorario(Horario horario) {
            this.horario = horario;
        }
    }

    
    
    public static class Horario {
        private String periodo;
        private String horaInicio;
        private String horaFim;
        private String professor;

        public String getPeriodo() {
            return periodo;
        }

        public void setPeriodo(String periodo) {
            this.periodo = periodo;
        }

        public String getHoraInicio() {
            return horaInicio;
        }

        public void setHoraInicio(String horaInicio) {
            this.horaInicio = horaInicio;
        }

        public String getHoraFim() {
            return horaFim;
        }

        public void setHoraFim(String horaFim) {
            this.horaFim = horaFim;
        }

        public String getProfessor() {
            return professor;
        }

        public void setProfessor(String professor) {
            this.professor = professor;
        }
    }
}
