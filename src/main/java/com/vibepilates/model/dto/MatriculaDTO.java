package com.vibepilates.model.dto;
import java.util.List;

import com.vibepilates.model.embedded.PlanoPreco;

public class MatriculaDTO {

    private String idUsuario;
    private String idPolo;
    private String frequencia;
    private PlanoPreco plano;
    private List<AulaSelecionadaDTO> aulasSelecionadas;
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
        return plano;
    }

    public void setPlano(PlanoPreco plano) {
        this.plano = plano;
    }

    public List<AulaSelecionadaDTO> getAulasSelecionadas() {
        return aulasSelecionadas;
    }

    public void setAulasSelecionadas(List<AulaSelecionadaDTO> aulasSelecionadas) {
        this.aulasSelecionadas = aulasSelecionadas;
    }

    public static class AulaSelecionadaDTO {
        private String modalidade;
        private String diaSemana;
        private HorarioDTO horario;

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

        public HorarioDTO getHorario() {
            return horario;
        }

        public void setHorario(HorarioDTO horario) {
            this.horario = horario;
        }
    }

    public static class HorarioDTO {
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
