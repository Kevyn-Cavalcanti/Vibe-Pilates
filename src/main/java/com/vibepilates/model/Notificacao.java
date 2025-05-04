package com.vibepilates.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "notificacoes")
public class Notificacao {

    @Id
    private String idNotificacao;

    private String idUsuario;
    private String mensagem;
    private Date dataHora;
    private String status;

    public Notificacao() {
    }

    public String getIdNotificacao() {
        return idNotificacao;
    }

    public void setIdNotificacao(String idNotificacao) {
        this.idNotificacao = idNotificacao;
    }

    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public Date getDataHora() {
        return dataHora;
    }

    public void setDataHora(Date dataHora) {
        this.dataHora = dataHora;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
