package techlab.spring;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/producto")
public class ProductController {
// -> /producto/*

    @PostMapping ("/")
    public String crearProducto(){
        return "creando producto...";

    }
    @GetMapping("/list")
    public String listarProductos(){
        return "productos";
    }
    //el @PathVariable se usa principalmente pasar pasar IDs
    @GetMapping("/find/{productId}/price")
    public String buscarProductoPorId(@PathVariable Long productId) {
        return "buscando..." + productId;
    }
    @GetMapping("/find")
    public String buscarProductoPorNombre(){
        return "buscando...";
    }
}
