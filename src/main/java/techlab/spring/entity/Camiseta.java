package techlab.spring.entity;


import java.util.Collection;
import java.util.List;

public class Camiseta {
    private static int contadorId = 1;
   private long id;
    private String equipo;
    private double precio;
    private Talle talle;
    private Deporte deporte;
    private String imagenUrl;
    private String descripcion;
    private List<StockPorTalle> stockPorTalle;

    public Camiseta() {
        this.id = contadorId++;;
    }

    public Camiseta(String equipo, double precio, Deporte deporte, String imagenUrl, List<StockPorTalle> stockPorTalle) {
        this.id = contadorId++;
        this.equipo = equipo;
        this.precio = precio;
        this.deporte = deporte;
        this.imagenUrl = imagenUrl;
        this.stockPorTalle = stockPorTalle;
    }


    public boolean contieneNombre(String busqueda){
String nombreMinuscula = this.equipo.toLowerCase();
return nombreMinuscula.contains(busqueda.toLowerCase());
    }
    public String getEquipo() {

        return equipo;
    }


    public double getPrecio() {

        return precio;
    }

    public void setPrecio(double precio) {

        this.precio = precio;
    }

    public Long getId() {

        return id;
    }
    public Deporte getDeporte() {

        return deporte;
    }
    public String getImagenUrl() {
        return imagenUrl; }
    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl; }

    public String getDescripcion() {
        return descripcion; }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<StockPorTalle> getStockPorTalle() {
        return stockPorTalle;
    }
}