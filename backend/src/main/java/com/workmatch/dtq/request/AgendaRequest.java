package com.workmatch.dtq.request;

import java.util.List;

public class AgendaRequest {

    private String data;
    private List<String> horarios;

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public List<String> getHorarios() {
        return horarios;
    }

    public void setHorarios(List<String> horarios) {
        this.horarios = horarios;
    }
}
