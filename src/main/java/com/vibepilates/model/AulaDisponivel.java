package com.vibepilates.model;
import java.util.List;

public class AulaDisponivel {
	private String modalidade;
	private String diadasemana;
    private List<HorarioDisponivel> horarios;

    public AulaDisponivel() {}

    public AulaDisponivel(String modalidade, List<HorarioDisponivel> horarios) {
    	this.modalidade = modalidade;
        this.horarios = horarios;
    }

    public String getModalidade() {
        return modalidade;
    }

    public void setModalidade(String modalidade) {
        this.modalidade = modalidade;
    }
    
    public String getDiadasemana() {
        return diadasemana;
    }

    public void setDiadasemana(String diadasemana) {
        this.diadasemana = diadasemana;
    }

    public List<HorarioDisponivel> getHorarios() {
        return horarios;
    }

    public void setHorarios(List<HorarioDisponivel> horarios) {
        this.horarios = horarios;
    }
}
