package techlab.spring.service;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import techlab.spring.dto.CamisetaResponseDTO;
import techlab.spring.entity.Camiseta;
import techlab.spring.entity.Deporte;
import techlab.spring.exception.CamisetaNotFoundException;
import techlab.spring.repository.CamisetaRepository;

@Service
public class CamisetaService {
    private final CamisetaRepository repository;


    public CamisetaService(CamisetaRepository repository) {
        this.repository = repository;
    }

    public CamisetaResponseDTO agregarCamiseta(Camiseta camiseta){
        String message = this.repository.agregarCamiseta(camiseta);
        CamisetaResponseDTO responseDTO = new CamisetaResponseDTO();
        responseDTO.setMessage(message);
        return responseDTO;
    }

    public List<Camiseta> listarCamisetas() {
        return this.repository.listarCamisetas();
    }

    // GET

    public Camiseta buscarPorId(Long id) {
        Camiseta encontrado = this.repository.buscarPorId(id);

        if (encontrado == null){
            throw new CamisetaNotFoundException(id.toString());
        }

        return encontrado;
    }
    public Camiseta buscarPorEquipo(String equipo) {
        Camiseta encontrada = this.repository.buscarPorEquipo(equipo);

        if (encontrada == null){
            throw new CamisetaNotFoundException(equipo);
        }

        return encontrada;
    }
    public List<Camiseta> buscarPorDeporte(Deporte deporte) {
        List<Camiseta> encontradas = new ArrayList<>();
        List<Camiseta> todasLasCamisetas = this.repository.listarCamisetas();

        for (Camiseta c : todasLasCamisetas) {
            if (c.getDeporte().equals(deporte)) {
                encontradas.add(c);
            }
        }

        if (encontradas.isEmpty()) {
            throw new CamisetaNotFoundException(deporte.getNombre());
        }

        return encontradas;
    }
    public List<Camiseta> buscarPorPrecioMenorOIgual(double precioMaximo) {
        List<Camiseta> encontradas = new ArrayList<>();
        List<Camiseta> todasLasCamisetas = this.repository.listarCamisetas();

        for (Camiseta c : todasLasCamisetas) {
            if (c.getPrecio() <= precioMaximo) {
                encontradas.add(c);
            }
        }

        if (encontradas.isEmpty()) {
            throw new CamisetaNotFoundException();
        }

        return encontradas;
    }


       //PUT
       public Camiseta editarCamiseta(String equipo, Double nuevoPrecio){
        Camiseta encontrado = this.repository.buscarPorEquipo(equipo);

        if (encontrado == null){
            throw new CamisetaNotFoundException(equipo.toString());
        }

        // esto funciona, porque todo se trabaja en memoria
        encontrado.setPrecio(nuevoPrecio);

        return encontrado;
    }

    // DELETE
    public Camiseta borrarCamiseta(String equipo) {
        Camiseta encontrada = this.repository.buscarPorEquipo(equipo);

        if (encontrada == null){
            throw new CamisetaNotFoundException(equipo.toString());
        }

        return this.repository.eliminarCamiseta(encontrada);
    }

}
