package techlab.spring.controller;
import techlab.spring.exception.CamisetaNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import techlab.spring.dto.CamisetaResponseDTO;
import org.springframework.web.bind.annotation.*;
import techlab.spring.entity.Camiseta;
import techlab.spring.entity.Deporte;
import java.util.List;
import java.util.ArrayList;
import techlab.spring.service.CamisetaService;


@RestController
@RequestMapping("/camisetas")
public class CamisetaController {
    private CamisetaService service;


    public CamisetaController(CamisetaService service) {
        this.service = service;
    }
//ENDPOINTS
    @PostMapping("/")
    public ResponseEntity<CamisetaResponseDTO> crearCamiseta(@RequestBody Camiseta camiseta){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.service.agregarCamiseta(camiseta));
    }

    @GetMapping("/{id}")
    public Camiseta obtenerCamisetaPorId(@PathVariable Long id){
        return this.service.buscarPorId(id);
    }

    @GetMapping("/buscarPorEquipo")
    public ResponseEntity<Camiseta> buscarCamisetaPorEquipo(@RequestParam String equipo){
        ResponseEntity<Camiseta> response;

        try {
            Camiseta camiseta = this.service.buscarPorEquipo(equipo);
            response = ResponseEntity.status(HttpStatus.OK).body(camiseta);
        } catch (CamisetaNotFoundException e) {
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return response;
    }
    @GetMapping("/buscarPorDeporte")
    public ResponseEntity<List<Camiseta>> buscarPorDeporte(@RequestParam Deporte deporte) {
        List<Camiseta> camisetas = service.buscarPorDeporte(deporte);
        return ResponseEntity.ok(camisetas);
    }
    @GetMapping("/buscarPorPrecio")
    public ResponseEntity<List<Camiseta>> buscarPorPrecio(@RequestParam double precio) {
        List<Camiseta> camisetas = service.buscarPorPrecioMenorOIgual(precio);
        return ResponseEntity.ok(camisetas);
    }

    @PutMapping("/{equipo}/modificarPrecio")
    public Camiseta editarPrecioCamiseta(@PathVariable String equipo,@RequestParam Double nuevoPrecio){
       return this.service.editarCamiseta(equipo, nuevoPrecio);
}

@DeleteMapping("/equipo/{equipo}")
public Camiseta eliminarCamiseta(@PathVariable String equipo){

        return this.service.borrarCamiseta(equipo);
}


    @GetMapping("/list")
    public List<Camiseta> listarCamisetas(){

        return this.service.listarCamisetas();
    }




}
