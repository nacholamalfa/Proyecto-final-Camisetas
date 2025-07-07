package techlab.spring.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Repository;
import techlab.spring.entity.Pedido;
import techlab.spring.entity.LineaPedido;
import techlab.spring.entity.Camiseta;

@Repository
public class PedidoRepository {
    private final ArrayList<Pedido> pedidos;
    private final CamisetaRepository camisetaRepository;

    public PedidoRepository(CamisetaRepository camisetaRepository) {
        this.pedidos = new ArrayList<>();
        this.camisetaRepository = camisetaRepository;
    }

    public String agregarPedido(Pedido pedido) {
        pedidos.add(pedido);
        return "Pedido creado exitosamente! ID del pedido: " + pedido.getId();
    }

    public List<Pedido> listarPedidos() {
        return this.pedidos;
    }

    public Pedido buscarPorId(Integer id) {
        for (Pedido pedido : pedidos) {
            if (pedido.getId() == id) {
                return pedido;
            }
        }
        return null;
    }

    public List<Pedido> buscarPorUsuarioId(Integer usuarioId) {
        List<Pedido> pedidosUsuario = new ArrayList<>();
        for (Pedido pedido : pedidos) {
            if (pedido.getUsuarioId() == usuarioId) {
                pedidosUsuario.add(pedido);
            }
        }
        return pedidosUsuario;
    }

    public Pedido eliminarPedido(Pedido pedido) {
        this.pedidos.remove(pedido);
        return pedido;
    }

    public List<Pedido> buscarPorRangoTotal(double minimo, double maximo) {
        List<Pedido> pedidosEnRango = new ArrayList<>();
        for (Pedido pedido : pedidos) {
            if (pedido.getTotal() >= minimo && pedido.getTotal() <= maximo) {
                pedidosEnRango.add(pedido);
            }
        }
        return pedidosEnRango;
    }
}