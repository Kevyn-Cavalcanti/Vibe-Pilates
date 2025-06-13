package com.vibepilates.model;

public class PlanoPreco {
    private String nome;
    private String recorrencia;
    private String preco;

    public PlanoPreco() {}

    public PlanoPreco(String nome, String recorrencia, String preco) {
        this.nome = nome;
        this.recorrencia = recorrencia;
        this.preco = preco;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getRecorrencia() {
        return recorrencia;
    }

    public void setRecorrencia(String recorrencia) {
        this.recorrencia = recorrencia;
    }

    public String getPreco() {
        return preco;
    }

    public void setPreco(String preco) {
        this.preco = preco;
    }
}
