package techlab.spring.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import techlab.spring.dto.PedidoResponseDTO;
import techlab.spring.entity.Pedido;
import techlab.spring.entity.Talle;
import techlab.spring.exception.PedidoNotFoundException;
import techlab.spring.service.PedidoService;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {
    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PostMapping("/")
    public ResponseEntity<PedidoResponseDTO> crearPedido(@RequestBody Pedido pedido) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.service.agregarPedido(pedido));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedidoPorId(@PathVariable Integer id) {
        try {
            Pedido pedido = this.service.buscarPorId(id);
            return ResponseEntity.status(HttpStatus.OK).body(pedido);
        } catch (PedidoNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pedido>> buscarPedidosPorUsuario(@PathVariable Integer usuarioId) {
        try {
            List<Pedido> pedidos = this.service.buscarPorUsuarioId(usuarioId);
            return ResponseEntity.status(HttpStatus.OK).body(pedidos);
        } catch (PedidoNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/buscarPorRangoTotal")
    public ResponseEntity<List<Pedido>> buscarPorRangoTotal(@RequestParam double minimo, @RequestParam double maximo) {
        try {
            List<Pedido> pedidos = this.service.buscarPorRangoTotal(minimo, maximo);
            return ResponseEntity.ok(pedidos);
        } catch (PedidoNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Pedido> eliminarPedido(@PathVariable Integer id) {
        try {
            Pedido pedido = this.service.borrarPedido(id);
            return ResponseEntity.ok(pedido);
        } catch (PedidoNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/list")
    public List<Pedido> listarPedidos() {
        return this.service.listarPedidos();
    }
}