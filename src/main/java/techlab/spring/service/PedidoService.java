package techlab.spring.service;

import java.util.List;
import org.springframework.stereotype.Service;
import techlab.spring.dto.PedidoResponseDTO;
import techlab.spring.entity.Pedido;
import techlab.spring.entity.Camiseta;
import techlab.spring.entity.LineaPedido;
import techlab.spring.entity.Talle;
import techlab.spring.entity.StockPorTalle;
import techlab.spring.exception.PedidoNotFoundException;
import techlab.spring.repository.PedidoRepository;
import techlab.spring.repository.CamisetaRepository;

@Service
public class PedidoService {
    private final PedidoRepository repository;
    private final CamisetaRepository camisetaRepository;

    public PedidoService(PedidoRepository repository, CamisetaRepository camisetaRepository) {
        this.repository = repository;
        this.camisetaRepository = camisetaRepository;
    }

    /*public PedidoResponseDTO agregarPedido(Pedido pedido) {
        String message = this.repository.agregarPedido(pedido);
        PedidoResponseDTO responseDTO = new PedidoResponseDTO("¡Pedido creado exitosamente!", pedido);
        responseDTO.setMessage(message);
        return responseDTO;
    }*/
    public PedidoResponseDTO agregarPedido(Pedido pedido) {
        // Procesar las líneas de pedido antes de guardar
        if (pedido.getLineasPedido() != null && !pedido.getLineasPedido().isEmpty()) {
            for (LineaPedido linea : pedido.getLineasPedido()) {
                Camiseta camiseta = camisetaRepository.buscarPorEquipo(linea.getCamiseta().getEquipo());
                if (camiseta == null) {
                    throw new RuntimeException("Camiseta no encontrada con equipo: " + linea.getCamiseta().getEquipo());
                }

                // Buscar stock por talle
                StockPorTalle stock = camiseta.getStockPorTalle().stream()
                        .filter(s -> s.getTalle() == linea.getTalle())
                        .findFirst()
                        .orElse(null);

                if (stock == null || stock.getCantidad() < linea.getCantidad()) {
                    throw new RuntimeException("Stock insuficiente para el talle " + linea.getTalle() + " de " + camiseta.getEquipo());
                }

                // Descontar stock
                stock.setCantidad(stock.getCantidad() - linea.getCantidad());

                linea.setCamiseta(camiseta);
                linea.setSubtotal(camiseta.getPrecio() * linea.getCantidad());
            }
        }
        pedido.calcularTotal();

        String message = this.repository.agregarPedido(pedido);
        PedidoResponseDTO responseDTO = new PedidoResponseDTO("¡Pedido creado exitosamente!", pedido);
        responseDTO.setMessage(message);
        return responseDTO;
    }


    public List<Pedido> listarPedidos() {

        return this.repository.listarPedidos();
    }

    public Pedido buscarPorId(Integer id) {
        Pedido encontrado = this.repository.buscarPorId(id);
        if (encontrado == null) {
            throw new PedidoNotFoundException(id.toString());
        }
        return encontrado;
    }

    public List<Pedido> buscarPorUsuarioId(Integer usuarioId) {
        List<Pedido> encontrados = this.repository.buscarPorUsuarioId(usuarioId);
        if (encontrados.isEmpty()) {
            throw new PedidoNotFoundException("Usuario ID: " + usuarioId);
        }
        return encontrados;
    }

    public List<Pedido> buscarPorRangoTotal(double minimo, double maximo) {
        List<Pedido> encontrados = this.repository.buscarPorRangoTotal(minimo, maximo);
        if (encontrados.isEmpty()) {
            throw new PedidoNotFoundException("Rango de precio: " + minimo + " - " + maximo);
        }
        return encontrados;
    }

    public Pedido agregarLineaPedido(Integer pedidoId, String equipoCamiseta, Talle talle, int cantidad) {
        Pedido pedido = this.repository.buscarPorId(pedidoId);
        if (pedido == null) {
            throw new PedidoNotFoundException(pedidoId.toString());
        }

        var camiseta = this.camisetaRepository.buscarPorEquipo(equipoCamiseta);
        if (camiseta == null) {
            throw new RuntimeException("Camiseta no encontrada: " + equipoCamiseta);
        }

        LineaPedido nuevaLinea = new LineaPedido(camiseta, cantidad, talle);
        pedido.agregarLinea(nuevaLinea);
        return pedido;
    }

    public Pedido borrarPedido(Integer id) {
        Pedido encontrado = this.repository.buscarPorId(id);
        if (encontrado == null) {
            throw new PedidoNotFoundException(id.toString());
        }
        return this.repository.eliminarPedido(encontrado);
    }
}