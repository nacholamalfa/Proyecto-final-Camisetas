package techlab.spring.entity;

public class LineaPedido {
    private Camiseta camiseta;
    private int cantidad;
    private double subtotal;
    private Talle talle;

    public LineaPedido() {

    }
    public LineaPedido(Camiseta camiseta, int cantidad, Talle talle) {
        this.camiseta = camiseta;
        this.cantidad = cantidad;
        this.talle = talle;
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

    public Talle getTalle() {
        return talle;
    }
}
