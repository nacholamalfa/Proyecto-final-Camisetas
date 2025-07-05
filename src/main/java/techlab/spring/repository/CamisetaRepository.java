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
        camisetas.add(new Camiseta("PSG", 135, 8, "M", Deporte.FUTBOL,"https://media.foot-store.es/catalog/product/cache/image/1800x/9df78eab33525d08d6e5fb8d27136e95/2/0/2025_nike_hj4593-411_1.jpg"));
        camisetas.add(new Camiseta("Barcelona", 140, 12, "M", Deporte.FUTBOL,"https://acdn-us.mitiendanube.com/stores/001/312/744/products/b0lpydvv_dnm-27a5c9ef6aa2705e2117248800265244-240-0.png"));
        camisetas.add(new Camiseta("Chicago Bulls", 135, 8, "S", Deporte.NBA,"https://basketballjerseyarchive.com/image/2023/11/03/eSZoGARANtoXVXL/chicago-bulls-2023-25-statement-jersey.jpg"));
        camisetas.add(new Camiseta("Buffalo Bills", 95, 15, "M", Deporte.NFL,"https://http2.mlstatic.com/D_NQ_NP_837508-MLA82679990461_022025-O.webp"));
        camisetas.add(new Camiseta("Real Madrid", 140, 8, "M", Deporte.FUTBOL,"https://acdn-us.mitiendanube.com/stores/001/312/744/products/whatsapp-image-2024-08-28-at-16-46-06-58aedd5642472c897a17248748739201-240-0.jpeg"));
        camisetas.add(new Camiseta("Golden State", 100, 8, "XL", Deporte.NBA,"https://www.basketballemotion.com/imagesarticulos/217149/grandes/camiseta-nike-golden-state-warriors-icon-edition-2023-2024-black-0.webp"));
        camisetas.add(new Camiseta("Patriots", 110, 8, "L", Deporte.NFL,"https://www.disasterskateshop.com/52828-large_default/camiseta-nike-nfl-patriots-mac-jones-10-white.jpg"));
        camisetas.add(new Camiseta("Kansas", 115, 8, "L", Deporte.NFL,"https://images.footballfanatics.com/kansas-city-chiefs/mens-nike-chris-roland-wallace-red-kansas-city-chiefs-game-jersey_ss5_p-202221098+pv-2+u-rtlpamadpygi70tixvz4+v-spplx9ktza2dye1idiu4.jpg?_hv=2&w=600"));
        camisetas.add(new Camiseta("Clippers", 105, 8, "S", Deporte.NBA,"https://basketballjerseyarchive.com/image/2024/08/16/DKbMCKfmnb5RoNC/los-angeles-clippers-2024-26-association-jersey.jpg"));
    }
}