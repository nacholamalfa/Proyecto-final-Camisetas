package techlab.spring.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Repository;
import techlab.spring.entity.Camiseta;
import techlab.spring.entity.Deporte;

@Repository
// Hacemos operaciones principalmente de:
// * filtrado
// * ordenamiento
// * paginado
// * modificaciones de datos
public class CamisetaRepository {
    // "BASE DE DATOS" en memoria
    private final ArrayList<Camiseta> camisetas;

    public CamisetaRepository() {
        this.camisetas = new ArrayList<>();
        this.agregarCamisetasDeEjemplo();
    }

    public String agregarCamiseta(Camiseta camiseta){
        camisetas.add(camiseta);

        return " Camiseta cargada exitosamente!  \n Equipo de la camiseta: " + camiseta.getEquipo();
    }

    public List<Camiseta> listarCamisetas() {
        return this.camisetas;
    }

    public Camiseta buscarPorId(Long id) {
        Camiseta camisetaEncontrada = null;

        for (Camiseta camiseta : camisetas) {
            if (camiseta.getId() == id) {
                camisetaEncontrada = camiseta;
            }
        }

        return camisetaEncontrada;
    }

    public Camiseta buscarPorEquipo(String equipo) {
      Camiseta camisetaEncontrada = null;

        for (Camiseta camiseta : camisetas){
            if (camiseta.contieneNombre(equipo) && camisetaEncontrada == null){
                camisetaEncontrada=camiseta;
            }
        }

        return camisetaEncontrada;
    }
    public Camiseta eliminarCamiseta(Camiseta camiseta) {
        this.camisetas.remove(camiseta);

        return camiseta;
    }

    private void agregarCamisetasDeEjemplo() {
        camisetas.add(new Camiseta("Boca", 100, 5, "M", Deporte.FUTBOL ));
        camisetas.add(new Camiseta("Lakers", 120, 10, "L", Deporte.NBA));
        camisetas.add(new Camiseta("Dolphins", 150, 3, "XL", Deporte.NFL));

    }
}