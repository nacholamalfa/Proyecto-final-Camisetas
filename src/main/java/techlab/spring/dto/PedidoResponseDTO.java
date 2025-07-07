package techlab.spring.dto;
import techlab.spring.entity.Pedido;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PedidoResponseDTO {
    private String message;
    private Pedido pedido;

    public PedidoResponseDTO(String message, Pedido pedido) {
        this.message = message;
        this.pedido = pedido;
    }

    public String getMessage() {
        return message;
    }

    public Pedido getPedido() {
        return pedido;
    }
}
