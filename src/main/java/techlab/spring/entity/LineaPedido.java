package techlab.spring.entity;

public class LineaPedido {
    private Camiseta camiseta;
    private int cantidad;
    private double subtotal;

    public LineaPedido(Camiseta camiseta, int cantidad) {
        this.camiseta = camiseta;
        this.cantidad = cantidad;
        this.subtotal = camiseta.getPrecio() * cantidad;
    }
    public Camiseta getCamiseta() {
        return camiseta;
    }

    public void setCamiseta(Camiseta camiseta) {
        this.camiseta = camiseta;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
        this.subtotal = this.camiseta.getPrecio() * cantidad;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }
}
