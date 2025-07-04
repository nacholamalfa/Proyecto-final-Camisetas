package techlab.spring.entity;

public enum Deporte {
    FUTBOL("Futbol"),
    NBA("Basquet"),
    NFL("Futbol americano");

    private final String nombre;

    Deporte(String nombre) {

        this.nombre = nombre;
    }
    public String getNombre() {

        return nombre;
    }
}
