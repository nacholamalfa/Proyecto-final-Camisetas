package techlab.spring.entity;

public class Camiseta {
    private static int contadorId = 1;
   private long id;
    private String equipo;
    private double precio;
    private int stock;
    private String talle;
    private Deporte deporte;
    private String imagenUrl;
    private String descripcion;

    public Camiseta() {
        this.id = contadorId++;;
    }
    public Camiseta(String equipo, double precio, int stock, String talle, Deporte deporte) {
        this.equipo = equipo;
        this.precio = precio;
        this.stock = stock;
        this.talle = talle;
        this.deporte = deporte;
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
        this.descripcion = descripcion; }

}