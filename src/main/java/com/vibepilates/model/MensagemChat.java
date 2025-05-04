package com.vibepilates.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "mensagens_chat")
public class MensagemChat {

    @Id
    private String idMensagemChat;

    private String idUsuarioRemetente;
    private String idUsuarioDestinatario; 
    private String mensagem;
    private Date dataHora;

    public MensagemChat() {
    }

    public String getIdMensagemChat() {
        return idMensagemChat;
    }

    public void setIdMensagemChat(String idMensagemChat) {
        this.idMensagemChat = idMensagemChat;
    }

    public String getIdUsuarioRemetente() {
        return idUsuarioRemetente;
    }

    public void setIdUsuarioRemetente(String idUsuarioRemetente) {
        this.idUsuarioRemetente = idUsuarioRemetente;
    }

    public String getIdUsuarioDestinatario() {
        return idUsuarioDestinatario;
    }

    public void setIdUsuarioDestinatario(String idUsuarioDestinatario) {
        this.idUsuarioDestinatario = idUsuarioDestinatario;
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
}
