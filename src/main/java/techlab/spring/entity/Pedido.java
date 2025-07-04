package techlab.spring.entity;

import java.util.ArrayList;
import java.util.List;
public class Pedido {
    private static int contadorId = 1;

    private int id;
    private int usuarioId;
    private List<LineaPedido> lineasPedido;
    private double total;

    public Pedido() {
        this.id = contadorId++;
        this.lineasPedido = new ArrayList<>();
        this.total = 0.0;
    }
    public Pedido(int usuarioId) {
        this();
        this.usuarioId = usuarioId;
    }

    public void agregarLinea(LineaPedido linea) {
        this.lineasPedido.add(linea);
        calcularTotal();
    }
    public void calcularTotal() {
        double suma = 0.0;
        for (LineaPedido linea : lineasPedido) {
            suma += linea.getSubtotal();
        }
        this.total = suma;
    }
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    public List<LineaPedido> getLineasPedido() {
        return lineasPedido;
    }

    public void setLineasPedido(List<LineaPedido> lineasPedido) {
        this.lineasPedido = lineasPedido;
        calcularTotal();
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

}
