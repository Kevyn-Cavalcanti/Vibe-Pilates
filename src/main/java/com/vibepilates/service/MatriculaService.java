package com.vibepilates.service;

import com.vibepilates.model.Matrícula;
import com.vibepilates.model.dto.MatriculaDTO;
import com.vibepilates.repository.MatriculaRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;

    public MatriculaService(MatriculaRepository matriculaRepository) {
        this.matriculaRepository = matriculaRepository;
    }

    public Matrícula salvar(Matrícula matricula) {
        return matriculaRepository.save(matricula);
    }

    public Matrícula converterDtoParaEntidade(MatriculaDTO dto) {
        Matrícula matricula = new Matrícula();

        matricula.setIdUsuario(dto.getIdUsuario());
        matricula.setIdPolo(dto.getIdPolo());
        matricula.setFrequencia(dto.getFrequencia());
        matricula.setPlano(dto.getPlano()); 

        if (dto.getAulasSelecionadas() != null) {
            List<Matrícula.AulaSelecionada> aulas = dto.getAulasSelecionadas().stream().map(dtoAula -> {
                Matrícula.AulaSelecionada aula = new Matrícula.AulaSelecionada();
                aula.setModalidade(dtoAula.getModalidade());
                aula.setDiaSemana(dtoAula.getDiaSemana());

                MatriculaDTO.HorarioDTO dtoHorario = dtoAula.getHorario();
                if (dtoHorario != null) {
                    Matrícula.Horario horario = new Matrícula.Horario();
                    horario.setPeriodo(dtoHorario.getPeriodo());
                    horario.setHoraInicio(dtoHorario.getHoraInicio());
                    horario.setHoraFim(dtoHorario.getHoraFim());
                    horario.setProfessor(dtoHorario.getProfessor());
                    aula.setHorario(horario);
                }

                return aula;
            }).toList();

            matricula.setAulasSelecionadas(aulas);
        }

        return matricula;
    }
}
