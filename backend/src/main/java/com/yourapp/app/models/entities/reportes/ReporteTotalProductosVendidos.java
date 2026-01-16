package com.yourapp.app.models.entities.reportes;

public class ReporteTotalProductosVendidos implements ReporteVenta {
    private int totalProductosVendidos;

    public ReporteTotalProductosVendidos(int totalProductosVendidos) {
        this.totalProductosVendidos = totalProductosVendidos;
    }

    public int getTotalProductosVendidos() {

        //TODO calcular total de productos vendidos
        return totalProductosVendidos;
    }
}
