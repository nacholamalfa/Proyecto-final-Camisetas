  const API_BASE_URL = 'http://localhost:8080/camisetas';
  let pedidos = [];
  let cart = [];
  let allProducts = [];

    document.addEventListener('DOMContentLoaded', function () {
        loadProducts();
        updateCartUI();
        setupEventListeners();
    });

    function setupEventListeners() {
        document.getElementById('cart-toggle').addEventListener('click', toggleCart);
        document.getElementById('cart-close').addEventListener('click', closeCart);
        document.getElementById('overlay').addEventListener('click', closeCart);
        document.getElementById('search-team').addEventListener('input', debounce(handleSearch, 300));
        document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async function loadProducts() {
        showLoading(true);
        clearError();

        try {
            const response = await fetch(`${API_BASE_URL}/list`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const products = await response.json();
            allProducts = products;
            displayProducts(products);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            showError('Error al cargar los productos. Asegúde de que el servidor esté ejecutándose en http://localhost:8080');
        } finally {
            showLoading(false);
        }
    }

    function displayProducts(products) {
        const container = document.getElementById('productos-container');

        if (!products || products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        No se encontraron productos.
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="col-md-4 col-lg-3 mb-4 fade-in">
                <div class="product-card">
                    <img src="${product.imagenUrl || ''}"
                         alt="${product.equipo}"
                         class="product-image"
                         onerror="this.remove()">
                    <div class="product-info">
                        <h5 class="product-title">${product.equipo}</h5>
                        <span class="product-deporte">
                            <i class="fas fa-tag me-1"></i>${product.deporte.nombre || product.deporte}
                        </span>
                        <div class="product-price">$${product.precio.toFixed(2)}</div>
                        ${product.descripcion ? `<p class="text-muted small">${product.descripcion}</p>` : ''}
                        <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.equipo}', ${product.precio}, '${product.deporte.nombre || product.deporte}', '${product.imagenUrl || ''}')">
                            <i class="fas fa-cart-plus me-1"></i>Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

function mostrarFormularioDeporte() {
    document.getElementById('formulario-deporte').style.display = 'block';
    document.getElementById('otros-filtros').style.display = 'none';
}

function mostrarSoloFiltro(filtroId) {
    document.getElementById('filtro-equipo').style.display = 'none';
    document.getElementById('filtro-precio').style.display = 'none';
    document.getElementById('formulario-deporte').style.display = 'none';

    document.getElementById(filtroId).style.display = 'block';

    document.getElementById('botones-filtros').style.display = 'none';
    document.getElementById('volver-botones').style.display = 'block';
}

function volverAFiltros() {
    document.getElementById('filtro-equipo').style.display = 'none';
    document.getElementById('filtro-precio').style.display = 'none';
    document.getElementById('formulario-deporte').style.display = 'none';

    document.getElementById('botones-filtros').style.display = 'block';
    document.getElementById('volver-botones').style.display = 'none';
}





    async function buscarPorEquipo() {
        const equipo = document.getElementById('search-team').value.trim();
        if (!equipo) return showError('Por favor ingresa el nombre de un equipo');
        showLoading(true);
        clearError();

        try {
            const response = await fetch(`${API_BASE_URL}/buscarPorEquipo?equipo=${encodeURIComponent(equipo)}`);
            if (response.status === 404) {
                showError(`No se encontró ninguna camiseta del equipo "${equipo}"`);
                displayProducts([]);
                return;
            }
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const product = await response.json();
            displayProducts([product]);
        } catch (error) {
            console.error('Error al buscar por equipo:', error);
            showError('Error al buscar el equipo');
        } finally {
            showLoading(false);
        }
    }

    async function aplicarFiltroDeporte() {
        const deporte = document.getElementById('filter-sport').value;
        if (!deporte) return showError('Por favor selecciona un deporte');
        showLoading(true);
        clearError();

        try {
            const response = await fetch(`${API_BASE_URL}/buscarPorDeporte?deporte=${deporte}`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error al filtrar por deporte:', error);
            showError('Error al filtrar por deporte');
        } finally {
            showLoading(false);
        }
    }


    async function filtrarPorPrecio() {
        const precio = document.getElementById('max-price').value;
        if (!precio || precio <= 0) return showError('Por favor ingresa un precio válido');
        showLoading(true);
        clearError();

        try {
            const response = await fetch(`${API_BASE_URL}/buscarPorPrecio?precio=${precio}`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error al filtrar por precio:', error);
            showError('Error al filtrar por precio');
        } finally {
            showLoading(false);
        }
    }

    function mostrarTodos() {
        clearError();
      displayProducts(allProducts);
    }

    function handleSearch() {
        const searchTerm = document.getElementById('search-team').value.toLowerCase();
        if (!searchTerm) return displayProducts(allProducts);
        const filtered = allProducts.filter(p => p.equipo.toLowerCase().includes(searchTerm));
       displayProducts(filtered);
    }

    function addToCart(id, equipo, precio, deporte, imagenUrl) {
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.cantidad++;
        } else {
            cart.push({ id, equipo, precio, deporte, imagenUrl, cantidad: 1 });
        }
        updateCartUI();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    }

    function updateCartUI() {
        const cartContainer = document.getElementById('cart-content');
        const cartTotal = document.getElementById('cart-total');
        const itemCount = document.getElementById('cart-counter');
        const vaciarBtn = document.getElementById('vaciar-carrito');

        if (!cartContainer || !cartTotal || !itemCount || !vaciarBtn) return;

        cartContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
        }

        cart.forEach(item => {
            total += item.precio * item.cantidad;
            count += item.cantidad;

            cartContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.imagenUrl || ''}" alt="${item.equipo}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.equipo}</div>
                        <div class="cart-item-price">$${item.precio.toFixed(2)} x ${item.cantidad}</div>
                        <div class="cart-item-controls mt-1">
                            <button class="btn btn-sm btn-outline-danger me-1" onclick="decreaseQuantity(${item.id})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success" onclick="increaseQuantity(${item.id})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        });

        cartTotal.textContent = total.toFixed(2);
        itemCount.textContent = count;

        //Actualizar estado del botón "Vaciar Carrito"
        if (cart.length === 0) {
            vaciarBtn.disabled = true;
            vaciarBtn.classList.remove('btn-outline-danger');
            vaciarBtn.classList.add('btn-secondary');
        } else {
            vaciarBtn.disabled = false;
            vaciarBtn.classList.remove('btn-secondary');
            vaciarBtn.classList.add('btn-outline-danger');
        }
    }

    function vaciarCarrito() {
        cart = [];
        updateCartUI();
    }


    function increaseQuantity(id) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.cantidad++;
            updateCartUI();
        }
    }

    function decreaseQuantity(id) {
        const item = cart.find(i => i.id === id);
        if (!item) return;

        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            // Si tiene solo una unidad, la quitamos del carrito
            cart = cart.filter(i => i.id !== id);
        }

        updateCartUI();
    }
function updatePedidosUI() {
    const pedidosContainer = document.getElementById('pedidos-container');
    const pedidosSection = document.getElementById('pedidos');

    if (!pedidosContainer || pedidos.length === 0) {
        pedidosContainer.innerHTML = `
            <div class="col-12 text-center text-muted">
                <p>No se registraron pedidos todavía.</p>
            </div>`;
        pedidosSection.style.display = 'block';
        return;
    }

    pedidosContainer.innerHTML = pedidos.map(pedido => `
        <div class="col-12 mb-3">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    Pedido #${pedido.id} - ${pedido.fecha}
                </div>
                <ul class="list-group list-group-flush">
                    ${pedido.items.map(item => `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            ${item.equipo} (${item.deporte}) x${item.cantidad}
                            <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                        </li>`).join('')}
                    <li class="list-group-item text-end fw-bold">
                        Total: $${pedido.total.toFixed(2)}
                    </li>
                </ul>
            </div>
        </div>
    `).join('');

    pedidosSection.style.display = 'block';

    // Scroll hasta pedidos
    document.getElementById('pedidos').scrollIntoView({ behavior: 'smooth' });
}
function checkout() {
    if (cart.length === 0) return;

    // Crear un nuevo pedido simulado
    const nuevoPedido = {
        id: pedidos.length + 1,
        fecha: new Date().toLocaleString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    };

    pedidos.push(nuevoPedido);
    vaciarCarrito();
    updatePedidosUI();

    // Mostrar modal
    document.getElementById('modal-total').textContent = nuevoPedido.total.toFixed(2);
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}


    function toggleCart() {
        document.getElementById('cart-sidebar').classList.add('active');
        document.getElementById('overlay').classList.add('active');
    }

    function closeCart() {
        document.getElementById('cart-sidebar').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    }

    function showLoading(isLoading) {
        const loader = document.getElementById('loading');
        if (loader) loader.style.display = isLoading ? 'block' : 'none';
    }

    function showError(message) {
        const container = document.getElementById('error-container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>${message}
                </div>
            `;
        }
    }

    function clearError() {
        const container = document.getElementById('error-container');
        if (container) container.innerHTML = '';
    }

