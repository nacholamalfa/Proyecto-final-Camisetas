package techlab.spring.exception;

public class CamisetaNotFoundException extends TechlabException{
    public CamisetaNotFoundException() {
        super("Camiseta no encontrada");
    }

    public CamisetaNotFoundException(String searchTerm) {
        super(String.format("No se encontro ninguna camiseta. se busco usando el siguiente termino: %s", searchTerm));
    }

}