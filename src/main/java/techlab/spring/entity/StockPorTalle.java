package techlab.spring.entity;

public class StockPorTalle {
    private Talle talle;
    private int cantidad;

    public StockPorTalle() {}

    public StockPorTalle(Talle talle, int cantidad) {
        this.talle = talle;
        this.cantidad = cantidad;
    }

    public Talle getTalle() {
        return talle;
    }

    public void setTalle(Talle talle) {
        this.talle = talle;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}
