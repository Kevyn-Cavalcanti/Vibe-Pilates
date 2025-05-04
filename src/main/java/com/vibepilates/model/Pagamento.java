package com.vibepilates.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.Decimal128;

import java.util.Date;

@Document(collection = "pagamentos")
public class Pagamento {

    @Id
    private String idPagamento;

    private String idUsuario;
    private Decimal128 valor;
    private String formaPagamento; 
    private String status; 
    private Date dataPag;

    public Pagamento() {
    }

    public String getIdPagamento() {
        return idPagamento;
    }

    public void setIdPagamento(String idPagamento) {
        this.idPagamento = idPagamento;
    }

    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Decimal128 getValor() {
        return valor;
    }

    public void setValor(Decimal128 valor) {
        this.valor = valor;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getDataPag() {
        return dataPag;
    }

    public void setDataPag(Date dataPag) {
        this.dataPag = dataPag;
    }
}
