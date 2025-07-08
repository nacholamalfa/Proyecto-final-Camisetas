  const API_BASE_URL = 'http://localhost:8080/camisetas';
const API_PEDIDOS = 'http://localhost:8080/pedidos';
const detalleContainer = document.getElementById('producto-detalle-container');

  let pedidos = [];
  let cart = [];
  let allProducts = [];

    document.addEventListener('DOMContentLoaded', function () {
        loadProducts();
        updateCartUI();
        setupEventListeners();
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
                       <!-- <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.equipo}', ${product.precio}, '${product.deporte.nombre || product.deporte}', '${product.imagenUrl || ''}')">
                            <i class="fas fa-cart-plus me-1"></i>Agregar al Carrito
                        </button>-->
                        <button class="add-to-cart-btn" onclick="mostrarDetalleProducto(${product.id})">
                          Ver detalles
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


function mostrarDetalle(id) {
  const producto = allProducts.find(p => p.id === id);
  if (!producto) return;

  // Ocultar listado y mostrar detalle + botón volver
  document.getElementById('productos-container').style.display = 'none';
  document.getElementById('producto-detalle-container').style.display = 'block';
  document.getElementById('btn-volver-listado').style.display = 'inline-block';

  // Construir HTML detalle (ajustalo a tus necesidades)
  const html = `
    <div class="card">
      <img src="${producto.imagenUrl || ''}" class="detalle-img mx-auto d-block" alt="${producto.equipo}" onerror="this.remove()">
      <div class="card-body">
        <h5 class="card-title">${producto.equipo}</h5>
        <p class="card-text">${producto.descripcion || ''}</p>
        <p><strong>Deporte:</strong> ${producto.deporte.nombre || producto.deporte}</p>
        <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
        <p><strong>Stock disponible:</strong> ${producto.stock || 'Sin info'}</p>
        <label for="cantidad-detalle">Cantidad:</label>
        <input type="number" id="cantidad-detalle" value="1" min="1" max="${producto.stock || 10}" class="form-control" style="width: 100px;">
        <button class="add-to-cart-btn mt-2" onclick="agregarDesdeDetalle(${producto.id})">
          <i class="fas fa-cart-plus me-1"></i>Agregar al Carrito
        </button>

      </div>
    </div>
  `;

  document.getElementById('producto-detalle-container').innerHTML = html;
}
function agregarDesdeDetalle(id) {
  const cantidadInput = document.getElementById('cantidad-input');
  let cantidad = parseInt(cantidadInput.value);
  if (isNaN(cantidad) || cantidad < 1) {
    alert('Ingrese una cantidad válida');
    return;
  }

  const producto = allProducts.find(p => p.id === id);
  if (!producto) return;

  const talle = document.getElementById('talle-select').value;

  if (producto.stockPorTalle && producto.stockPorTalle.length > 0) {
    const stockTalle = producto.stockPorTalle.find(sp => sp.talle === talle)?.cantidad || 0;
    if (cantidad > stockTalle) {
      alert(`Sólo hay ${stockTalle} unidades disponibles para talle ${talle}`);
      return;
    }
  } else {
    if (producto.stock && cantidad > producto.stock) {
      alert(`Sólo hay ${producto.stock} unidades disponibles.`);
      return;
    }
  }

  addToCartConCantidad(producto.id, producto.equipo, producto.precio, producto.deporte.nombre || producto.deporte, producto.imagenUrl || '', cantidad, talle);

  alert('Producto agregado al carrito');

  volverAlListado();
}

function addToCartConCantidad(id, equipo, precio, deporte, imagenUrl, cantidad, talle) {
  const existing = cart.find(item => item.id === id && item.talle === talle);
  if (existing) {
    existing.cantidad += cantidad;
  } else {
    cart.push({ id, equipo, precio, deporte, imagenUrl, cantidad, talle });
  }
  updateCartUI();
}

function volverAlListado() {

    document.getElementById('productos-container').style.display = 'flex';
    document.getElementById('botones-filtros').style.display = 'block';

    document.querySelector('.filters').style.display = 'block';

    document.getElementById('producto-detalle-container').style.display = 'none';

    volverAFiltros();
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

    function removeFromCart(id, talle) {
      cart = cart.filter(item => !(item.id === id && item.talle === talle));
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
                  <div class="cart-item-title">
                    ${item.equipo} <span class="badge bg-secondary ms-1">Talle: ${item.talle}</span>
                  </div>

                  <div class="cart-item-price">$${item.precio.toFixed(2)} x ${item.cantidad}</div>
                  <div class="cart-item-controls mt-1">
                      <button class="btn btn-sm btn-outline-danger me-1" onclick="decreaseQuantity(${item.id}, '${item.talle}')">
                          <i class="fas fa-minus"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-success" onclick="increaseQuantity(${item.id}, '${item.talle}')">
                          <i class="fas fa-plus"></i>
                      </button>
                  </div>
              </div>
              <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id}, '${item.talle}')">
                  <i class="fas fa-trash-alt"></i>
              </button>
          </div>
        `;
      });

      cartTotal.textContent = total.toFixed(2);
      itemCount.textContent = count;

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


    function increaseQuantity(id, talle) {
      const item = cart.find(i => i.id === id && i.talle === talle);
      if (item) {
        item.cantidad++;
        updateCartUI();
      }
    }

    function decreaseQuantity(id, talle) {
      const item = cart.find(i => i.id === id && i.talle === talle);
      if (!item) return;

      if (item.cantidad > 1) {
        item.cantidad--;
      } else {
        // Eliminar si queda 0
        cart = cart.filter(i => !(i.id === id && i.talle === talle));
      }

      updateCartUI();
    }

detalleContainer.innerHTML = `
  <div class="row justify-content-center">
    <div class="col-md-5 text-center">
      <img src="${producto.imagenUrl}" class="img-fluid detalle-img mb-3" alt="${producto.equipo}" onerror="this.remove()">
    </div>
    <div class="col-md-6">
      <h2>${producto.equipo}</h2>
      <p class="text-muted">${producto.descripcion || ''}</p>
      <h4 class="text-primary">$${producto.precio.toFixed(2)}</h4>

      <div class="mb-3">
        <label for="talle-select" class="form-label">Talles</label>
        <select id="talle-select" class="form-select">
          <option value="S">S</option>
          <option value="M" selected>M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="cantidad-input" class="form-label">Cantidad</label>
        <input type="number" id="cantidad-input" class="form-control" value="1" min="1">
      </div>

      <div class="d-grid gap-2">
        <button class="btn btn-dark" onclick="agregarDetalleAlCarrito(${producto.id})">
          <i class="fas fa-cart-plus me-1"></i> Agregar al carrito
        </button>
        <button class="btn btn-outline-secondary" onclick="volverAlListado()">Volver al listado</button>
      </div>
    </div>
  </div>
`;
function agregarDetalleAlCarrito(productId) {
  const producto = allProducts.find(p => p.id === productId);
  if (!producto) return;

  const cantidad = parseInt(document.getElementById('cantidad-input').value);
  const talle = document.getElementById('talle-select').value;

  if (isNaN(cantidad) || cantidad <= 0) {
    return showDetalleAlert('Cantidad inválida', 'danger');
  }

  if (producto.stockPorTalle && producto.stockPorTalle.length > 0) {
    const stockTalle = producto.stockPorTalle.find(sp => sp.talle === talle)?.cantidad || 0;
    if (cantidad > stockTalle) {
      return showDetalleAlert(`Hay ${stockTalle} unidades disponibles para talle ${talle}`, 'danger');
    }
  } else {
    if (producto.stock && cantidad > producto.stock) {
      return showDetalleAlert(`Hay ${producto.stock} unidades disponibles`, 'danger');
    }
  }


  addToCartConCantidad(
    producto.id,
    producto.equipo,
    producto.precio,
    producto.deporte.nombre || producto.deporte,
    producto.imagenUrl || '',
    cantidad,
    talle
  );


showDetalleAlert('Producto agregado al carrito', 'success');
}

function showDetalleAlert(message, type = 'success') {
  const alertDiv = document.getElementById('detalle-alert');
  if (!alertDiv) return;

  alertDiv.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2"></i>
      ${message}
    </div>
  `;
  alertDiv.style.display = 'block';

  setTimeout(() => {
    alertDiv.style.display = 'none';
    alertDiv.innerHTML = '';
  }, 3000);
}


function mostrarDetalleProducto(productId) {
  const producto = allProducts.find(p => p.id === productId);
  if (!producto) return;


  document.getElementById('productos-container').style.display = 'none';
  document.getElementById('botones-filtros').style.display = 'none';
  document.querySelector('.filters').style.display = 'none';

  const container = document.getElementById('producto-detalle-container');
  container.style.display = 'block';


  let talleOptions = '';
  if (producto.stockPorTalle && producto.stockPorTalle.length > 0) {
    talleOptions = producto.stockPorTalle.map(sp =>
      `<option value="${sp.talle}">${sp.talle} (${sp.cantidad} disponibles)</option>`
    ).join('');
  } else {

    talleOptions = `
      <option value="S">S</option>
      <option value="M" selected>M</option>
      <option value="L">L</option>
      <option value="XL">XL</option>
    `;
  }

  container.innerHTML = `
    <div class="detalle-producto-box">
      <div class="text-center">
        <img src="${producto.imagenUrl || ''}" class="detalle-img" alt="${producto.equipo}" onerror="this.remove()">
      </div>
      <div class="detalle-info">
        <h2>${producto.equipo}</h2>
        <p class="text-muted">${producto.descripcion || ''}</p>
        <h4 class="text-primary">$${producto.precio.toFixed(2)}</h4>

        <div class="mb-3">
          <label for="talle-select" class="form-label">Talle</label>
          <select id="talle-select" class="form-select">
            ${talleOptions}
          </select>
        </div>

        <div class="mb-3">
          <label for="cantidad-input" class="form-label">Cantidad</label>
          <input type="number" id="cantidad-input" class="form-control" value="1" min="1" max="${producto.stock || 10}">
        </div>
        <div id="detalle-alert" style="display:none;"></div>

        <div class="d-grid gap-2">
          <button class="add-to-cart-btn" onclick="agregarDetalleAlCarrito(${producto.id})">
            <i class="fas fa-cart-plus me-1"></i> Agregar al carrito
          </button>
          <button class="add-to-cart-btn" onclick="volverAlListado()">
            <i class="fas fa-arrow-left me-1"></i> Volver al listado
          </button>
        </div>
      </div>
    </div>
  `;


  const talleSelect = document.getElementById('talle-select');
  const cantidadInput = document.getElementById('cantidad-input');

  if (producto.stockPorTalle && producto.stockPorTalle.length > 0) {
    talleSelect.addEventListener('change', () => {
      const selectedTalle = talleSelect.value;
      const stockTalle = producto.stockPorTalle.find(sp => sp.talle === selectedTalle)?.cantidad || 1;
      cantidadInput.max = stockTalle;
      if (parseInt(cantidadInput.value) > stockTalle) {
        cantidadInput.value = stockTalle;
      }
    });
  }
}
function actualizarStockLocal(productId, talleComprado, cantidadComprada) {
  const producto = allProducts.find(p => p.id === productId);
  if (!producto) return;

  if (producto.stockPorTalle && producto.stockPorTalle.length > 0) {
    const stockTalleObj = producto.stockPorTalle.find(sp => sp.talle === talleComprado);
    if (stockTalleObj) {
      stockTalleObj.cantidad = Math.max(0, stockTalleObj.cantidad - cantidadComprada);
    }
  } else if (producto.stock !== undefined) {
    producto.stock = Math.max(0, producto.stock - cantidadComprada);
  }


  const talleSelect = document.getElementById('talle-select');
  const cantidadInput = document.getElementById('cantidad-input');

  if (talleSelect && cantidadInput) {
    if (producto.stockPorTalle && producto.stockPorTalle.length > 0) {

      talleSelect.innerHTML = producto.stockPorTalle.map(sp =>
        `<option value="${sp.talle}">${sp.talle} (${sp.cantidad} disponibles)</option>`
      ).join('');

      const selectedTalle = talleSelect.value;
      const stockTalle = producto.stockPorTalle.find(sp => sp.talle === selectedTalle)?.cantidad || 0;
      cantidadInput.max = stockTalle;
      if (parseInt(cantidadInput.value) > stockTalle) {
        cantidadInput.value = stockTalle;
      }
    } else {

      cantidadInput.max = producto.stock;
      if (parseInt(cantidadInput.value) > producto.stock) {
        cantidadInput.value = producto.stock;
      }
    }
  }
}





/*async function checkout() {
    if (cart.length === 0) return;

    try {
        const response = await fetch(`${API_PEDIDOS}/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                usuarioId: 1,
                lineasPedido: cart.map(item => ({
                    camiseta: { id: item.id },
                    cantidad: item.cantidad
                }))
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            // Mostramos modal de error en vez de alert
            showError('No se pudo procesar el pedido');
            return;
        }

        await listarPedidos();
        vaciarCarrito();

        // Mostramos modal de éxito
        document.getElementById('modal-total').textContent = data.pedido.total.toFixed(2);
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
    } catch (e) {
        console.error('Error al procesar pedido:', e);
        showError('Error inesperado al procesar pedido');
    }
}*/
async function checkout() {
  if (cart.length === 0) return;

  try {
    const pedidoData = {
      usuarioId: 1,
      lineasPedido: cart.map(item => ({
        camiseta: { equipo: item.equipo },
        talle: item.talle,
        cantidad: item.cantidad
      }))
    };

    console.log('Enviando pedido:', JSON.stringify(pedidoData, null, 2));

    const response = await fetch(`${API_PEDIDOS}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    if (data.pedido && data.pedido.total > 0) {
      cart.forEach(item => {
        actualizarStockLocal(item.id, item.talle, item.cantidad);
      });

      await listarPedidos();
      vaciarCarrito();

      document.getElementById('modal-total').textContent = data.pedido.total.toFixed(2);
      const modal = new bootstrap.Modal(document.getElementById('successModal'));
      modal.show();
    } else {
      throw new Error('El pedido se creó pero con total 0');
    }
  } catch (e) {
    console.error('Error al procesar pedido:', e);
    showError('Error al procesar pedido: ' + e.message);
  }
}


async function listarPedidos() {
  try {
    const res = await fetch(`${API_PEDIDOS}/list`);
    pedidos = await res.json();
    renderPedidos(pedidos);
  } catch(e){ console.error(e); }
}
async function buscarPedido() {
  const id = document.getElementById('pedido-id-input').value;
  if (!id) return alert('Ingresa un ID válido');
  try {
    const res = await fetch(`${API_PEDIDOS}/${id}`);
    if (res.status === 404) return alert('Pedido no encontrado');
    const p = await res.json();
    renderPedidos([p]);
  } catch(e){ console.error(e); }
}

async function eliminarPedido(id) {
  if (!confirm(`Eliminar pedido #${id}?`)) return;
  try {
    const res = await fetch(`${API_PEDIDOS}/${id}`, { method: 'DELETE' });
    if (res.status === 404) alert('Pedido no existe');
    else {
      alert('Pedido eliminado');
      await listarPedidos();
    }
  } catch(e){ console.error(e); }
}
function renderPedidos(lista) {
  document.getElementById('pedidos').style.display = 'block';
  const container = document.getElementById('pedidos-container');
  container.innerHTML = lista.map(p => `
    <div class="col-12 mb-3">
      <div class="card">
        <div class="card-header bg-primary text-white d-flex justify-content-between">
          <span>Pedido #${p.id} — Total $${p.total.toFixed(2)}</span>
          <button class="btn btn-sm btn-danger" onclick="eliminarPedido(${p.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <ul class="list-group list-group-flush">
          ${p.lineasPedido.map(lp => `
            <li class="list-group-item d-flex justify-content-between">
              ${lp.camiseta.equipo} x${lp.cantidad}
              <span>$${(lp.camiseta.precio * lp.cantidad).toFixed(2)}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `).join('');
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

function mostrarFormularioAgregarCamiseta() {
    // Ocultar el listado de productos
    document.getElementById('productos-container').style.display = 'none';
    document.getElementById('botones-filtros').style.display = 'none';
    document.querySelector('.filters').style.display = 'none';

    // Mostrar el formulario
    const container = document.getElementById('producto-detalle-container');
    container.style.display = 'block';

    container.innerHTML = `
        <div class="agregar-camiseta-box">
            <h2><i class="fas fa-plus-circle me-2"></i>Agregar Nueva Camiseta</h2>

            <form id="form-agregar-camiseta">
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="equipo-input" class="form-label">Nombre del Equipo *</label>
                            <input type="text" id="equipo-input" class="form-control" placeholder="Ej: Real Madrid" required>
                        </div>

                        <div class="mb-3">
                            <label for="precio-input" class="form-label">Precio *</label>
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input type="number" id="precio-input" class="form-control" placeholder="0.00" step="0.01" min="0" required>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="deporte-select" class="form-label">Deporte *</label>
                            <select id="deporte-select" class="form-select" required>
                                <option value="">Selecciona un deporte</option>
                                <option value="FUTBOL">Fútbol</option>
                                <option value="NBA">Básquet</option>
                                <option value="NFL">Fútbol Americano</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="imagen-input" class="form-label">URL de la Imagen</label>
                            <input type="url" id="imagen-input" class="form-control" placeholder="https://ejemplo.com/imagen.jpg">
                            <div class="form-text">Opcional: URL de la imagen del producto</div>
                        </div>

                        <div class="mb-3">
                            <label for="descripcion-input" class="form-label">Descripción</label>
                            <textarea id="descripcion-input" class="form-control" rows="3" placeholder="Descripción del producto (opcional)"></textarea>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Stock por Talle *</label>
                            <div class="stock-container">
                                <div class="row mb-2">
                                    <div class="col-3">
                                        <label for="stock-s" class="form-label">Talle S</label>
                                        <input type="number" id="stock-s" class="form-control" min="0" value="0">
                                    </div>
                                    <div class="col-3">
                                        <label for="stock-m" class="form-label">Talle M</label>
                                        <input type="number" id="stock-m" class="form-control" min="0" value="0">
                                    </div>
                                    <div class="col-3">
                                        <label for="stock-l" class="form-label">Talle L</label>
                                        <input type="number" id="stock-l" class="form-control" min="0" value="0">
                                    </div>
                                    <div class="col-3">
                                        <label for="stock-xl" class="form-label">Talle XL</label>
                                        <input type="number" id="stock-xl" class="form-control" min="0" value="0">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Vista previa de la imagen -->
                        <div class="mb-3">
                            <label class="form-label">Vista Previa</label>
                            <div id="imagen-preview" class="border rounded p-3 text-center" style="min-height: 200px;">
                                <i class="fas fa-image text-muted" style="font-size: 3rem;"></i>
                                <p class="text-muted mt-2">La imagen aparecerá aquí</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="form-alert" style="display:none;"></div>

                <div class="d-flex gap-2 mt-4">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save me-1"></i>Guardar Camiseta
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="volverAlListado()">
                        <i class="fas fa-arrow-left me-1"></i>Cancelar
                    </button>
                </div>
            </form>
        </div>
    `;

    // Agregar event listeners
    setupFormularioEventListeners();
}

// Configurar event listeners para el formulario
function setupFormularioEventListeners() {
    // Preview de imagen
    document.getElementById('imagen-input').addEventListener('input', function() {
        const url = this.value;
        const preview = document.getElementById('imagen-preview');

        if (url) {
            preview.innerHTML = `<img src="${url}" class="img-fluid" style="max-height: 180px;" alt="Preview" onerror="this.style.display='none';">`;
        } else {
            preview.innerHTML = `
                <i class="fas fa-image text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-2">La imagen aparecerá aquí</p>
            `;
        }
    });

    // Submit del formulario
    document.getElementById('form-agregar-camiseta').addEventListener('submit', function(e) {
        e.preventDefault();
        agregarNuevaCamiseta();
    });
}

// Función para agregar nueva camiseta
async function agregarNuevaCamiseta() {
    const equipo = document.getElementById('equipo-input').value.trim();
    const precio = parseFloat(document.getElementById('precio-input').value);
    const deporte = document.getElementById('deporte-select').value;
    const imagenUrl = document.getElementById('imagen-input').value.trim();
    const descripcion = document.getElementById('descripcion-input').value.trim();

    // Obtener stock por talle
    const stockS = parseInt(document.getElementById('stock-s').value) || 0;
    const stockM = parseInt(document.getElementById('stock-m').value) || 0;
    const stockL = parseInt(document.getElementById('stock-l').value) || 0;
    const stockXL = parseInt(document.getElementById('stock-xl').value) || 0;

    // Validaciones
    if (!equipo || !precio || !deporte) {
        showFormAlert('Por favor completa todos los campos obligatorios', 'danger');
        return;
    }

    if (precio <= 0) {
        showFormAlert('El precio debe ser mayor a 0', 'danger');
        return;
    }

    if (stockS + stockM + stockL + stockXL <= 0) {
        showFormAlert('Debe haber al menos 1 unidad en stock', 'danger');
        return;
    }

    // Crear objeto stockPorTalle
    const stockPorTalle = [
        { talle: 'S', cantidad: stockS },
        { talle: 'M', cantidad: stockM },
        { talle: 'L', cantidad: stockL },
        { talle: 'XL', cantidad: stockXL }
    ];

    // Crear objeto camiseta
    const nuevaCamiseta = {
        equipo: equipo,
        precio: precio,
        deporte: deporte,
        imagenUrl: imagenUrl || '',
        descripcion: descripcion || '',
        stockPorTalle: stockPorTalle
    };

    try {
        showFormAlert('Guardando camiseta...', 'info');

        const response = await fetch(`${API_BASE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaCamiseta)
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        showFormAlert('¡Camiseta agregada exitosamente!', 'success');

        // Recargar productos y volver al listado después de 2 segundos
        setTimeout(async () => {
            await loadProducts();
            volverAlListado();
        }, 2000);

    } catch (error) {
        console.error('Error al agregar camiseta:', error);
        showFormAlert('Error al agregar la camiseta: ' + error.message, 'danger');
    }
}

// Función para mostrar alertas en el formulario
function showFormAlert(message, type = 'success') {
    const alertDiv = document.getElementById('form-alert');
    if (!alertDiv) return;

    alertDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'danger' ? 'fa-exclamation-triangle' : 'fa-info-circle'} me-2"></i>
            ${message}
            ${type !== 'info' ? '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' : ''}
        </div>
    `;
    alertDiv.style.display = 'block';

    if (type === 'info') {
        setTimeout(() => {
            alertDiv.style.display = 'none';
            alertDiv.innerHTML = '';
        }, 3000);
    }
}

// Modificar la función setupEventListeners() existente para agregar el botón
function setupEventListeners() {
    document.getElementById('cart-toggle').addEventListener('click', toggleCart);
    document.getElementById('cart-close').addEventListener('click', closeCart);
    document.getElementById('overlay').addEventListener('click', closeCart);
    document.getElementById('search-team').addEventListener('input', debounce(handleSearch, 300));
    document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);

    // Agregar event listener para el botón de agregar camiseta
    const btnAgregarCamiseta = document.getElementById('btn-agregar-camiseta');
    if (btnAgregarCamiseta) {
        btnAgregarCamiseta.addEventListener('click', mostrarFormularioAgregarCamiseta);
    }
}