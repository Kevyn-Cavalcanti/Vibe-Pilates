package com.vibepilates.model.embedded;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonFormat;

public class HorarioDisponivel {
    private String periodo;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime horaInicio;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime horaFim;
    private String professor;

    public HorarioDisponivel() {}

    public HorarioDisponivel(String periodo, LocalTime horaInicio, LocalTime horaFim, String professor) {
        this.periodo = periodo;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.professor = professor;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }

    public String getProfessor() {
        return professor;
    }

    public void setProfessor(String professor) {
        this.professor = professor;
    }

    @Override
    public String toString() {
        return "HorarioDisponivel{" +
                "periodo='" + periodo + '\'' +
                ", horaInicio=" + horaInicio +
                ", horaFim=" + horaFim +
                ", professor='" + professor + '\'' +
                '}';
    }
}
