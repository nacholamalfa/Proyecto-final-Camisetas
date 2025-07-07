package techlab.spring.exception;

public class PedidoNotFoundException extends TechlabException {
    public PedidoNotFoundException() {
        super("Pedido no encontrado");
    }

    public PedidoNotFoundException(String searchTerm) {
        super(String.format("No se encontró ningún pedido. Se buscó usando el siguiente término: %s", searchTerm));
    }
}