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
        camisetas.add(new Camiseta("Boca", 100, 5, "M", Deporte.FUTBOL, "https://templofutbol.vtexassets.com/arquivos/ids/20358268-1600-auto?v=638852427474800000&width=1600&height=auto&aspect=true" ));
        camisetas.add(new Camiseta("Lakers", 120, 10, "L", Deporte.NBA, "https://tirolibreuy.com/cdn/shop/files/d9aa1b6a-4385-4233-96b6-b03f5c83d1a6_600x.webp?v=1700661268"));
        camisetas.add(new Camiseta("Dolphins", 150, 3, "XL", Deporte.NFL,"https://acdn-us.mitiendanube.com/stores/005/277/143/products/img_8338-31d08c8c6695e0888417454427075310-640-0.jpeg"));

    }
}