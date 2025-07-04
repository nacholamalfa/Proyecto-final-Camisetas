
// Variables globales
let camisetasData = [];
let currentFilter = 'all';

// Mapeo de deportes para obtener imágenes
const deporteImages = {
  'FUTBOL': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop',
  'NBA': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop',
  'NFL': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=400&fit=crop'
};

// Mapeo de equipos para obtener colores representativos
const equipoColors = {
  'Boca': '#003d82',
  'Lakers': '#552583',
  'Dolphins': '#008e97',
  'Real Madrid': '#ffffff',
  'Barcelona': '#a50044',
  'PSG': '#004170'
};

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

// Inicialización de la aplicación
function initializeApp() {
  showLoadingSpinner();
  fetchCamisetas();
  setupEventListeners();
  updateCartUI();
}

// Configurar event listeners
function setupEventListeners() {
  // Filtros
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
  });

  // Carrito
  document.getElementById('open-cart').addEventListener('click', openCart);
  document.getElementById('close-cart').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);
  document.getElementById('vaciar-carrito').addEventListener('click', clearCart);
  document.getElementById('realizar-compra').addEventListener('click', realizarCompra);

  // Navegación suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Obtener camisetas del backend
function fetchCamisetas() {
  fetch("http://localhost:8080/camisetas/list")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      camisetasData = data;
      hideLoadingSpinner();
      renderCamisetas(data);
    })
    .catch(error => {
      console.error("Error al obtener camisetas:", error);
      hideLoadingSpinner();
      showErrorMessage();
    });
}

// Mostrar spinner de carga
function showLoadingSpinner() {
  document.getElementById('loading-spinner').style.display = 'block';
  document.getElementById('camisetas-container').style.display = 'none';
}

// Ocultar spinner de carga
function hideLoadingSpinner() {
  document.getElementById('loading-spinner').style.display = 'none';
  document.getElementById('camisetas-container').style.display = 'grid';
}

// Mostrar mensaje de error
function showErrorMessage() {
  const container = document.getElementById('camisetas-container');
  container.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Error al cargar las camisetas</h3>
      <p>No se pudieron cargar los productos. Por favor, verifica que el servidor esté funcionando.</p>
      <button onclick="fetchCamisetas()" class="btn btn-primary">
        <i class="fas fa-refresh"></i> Reintentar
      </button>
    </div>
  `;
  container.style.display = 'block';
}

// Renderizar camisetas
function renderCamisetas(camisetas) {
  const container = document.getElementById('camisetas-container');

  if (camisetas.length === 0) {
    container.innerHTML = `
      <div class="no-products">
        <i class="fas fa-tshirt"></i>
        <h3>No hay camisetas disponibles</h3>
        <p>No se encontraron productos que coincidan con tu búsqueda.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = camisetas.map(camiseta => `
    <div class="product-card" data-deporte="${camiseta.deporte}">
      <div class="product-image">
        <img src="${getImageForDeporte(camiseta.deporte)}" alt="${camiseta.equipo}">
        <div class="product-overlay">
          <div class="product-actions">
            <button class="action-btn" onclick="addToCart(${camiseta.id}, '${getImageForDeporte(camiseta.deporte)}', '${camiseta.equipo}', ${camiseta.precio}, this)">
              <i class="fas fa-shopping-cart"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="product-info">
        <div class="product-category">
          <i class="fas ${getIconForDeporte(camiseta.deporte)}"></i>
          ${camiseta.deporte}
        </div>
        <h3 class="product-title">${camiseta.equipo}</h3>
        <div class="product-details">
          <span class="product-price">$${camiseta.precio}</span>
          <span class="product-stock">Stock: ${camiseta.stock || 'Disponible'}</span>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${camiseta.id}, '${getImageForDeporte(camiseta.deporte)}', '${camiseta.equipo}', ${camiseta.precio}, this)">
          <i class="fas fa-plus"></i>
          Agregar al Carrito
        </button>
      </div>
    </div>
  `).join('');
}

// Obtener imagen para el deporte
function getImageForDeporte(deporte) {
  return deporteImages[deporte] || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop';
}

// Obtener icono para el deporte
function getIconForDeporte(deporte) {
  const icons = {
    'FUTBOL': 'fa-futbol',
    'NBA': 'fa-basketball-ball',
    'NFL': 'fa-football-ball'
  };
  return icons[deporte] || 'fa-tshirt';
}

// Manejar clic en filtros
function handleFilterClick(e) {
  const filter = e.target.dataset.filter;
  currentFilter = filter;

  // Actualizar botones activos
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');

  // Filtrar productos
  const filteredCamisetas = filter === 'all'
    ? camisetasData
    : camisetasData.filter(camiseta => camiseta.deporte === filter);

  renderCamisetas(filteredCamisetas);
}

// Agregar al carrito
window.addToCart = function(id, image, title, price, button) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existingProduct = cart.find(product => product.id === id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ id, image, title, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();

  // Mostrar feedback visual
  showAddToCartFeedback(button);

  // Abrir carrito automáticamente en móviles
  if (window.innerWidth <= 768) {
    setTimeout(() => openCart(), 500);
  }
};

// Mostrar feedback de agregar al carrito
function showAddToCartFeedback(button) {
  const originalContent = button.innerHTML;
  button.innerHTML = '<i class="fas fa-check"></i> Agregado';
  button.classList.add('added');
  button.disabled = true;

  setTimeout(() => {
    button.innerHTML = originalContent;
    button.classList.remove('added');
    button.disabled = false;
  }, 2000);
}

// Actualizar UI del carrito
function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const carritoItems = document.getElementById("carrito-items");
  let total = 0;

  // Actualizar contadores
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-counter").textContent = itemCount;
  document.getElementById("cart-counter-nav").textContent = itemCount;

  if (cart.length === 0) {
    carritoItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h4>Tu carrito está vacío</h4>
        <p>Agrega algunos productos para comenzar</p>
      </div>
    `;
    document.getElementById("realizar-compra").disabled = true;
  } else {
    document.getElementById("realizar-compra").disabled = false;

    carritoItems.innerHTML = cart.map(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-details">
            <h6 class="cart-item-title">${item.title}</h6>
            <div class="cart-item-controls">
              <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="cart-item-price">$${subtotal.toFixed(2)}</div>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
    }).join('');
  }

  document.getElementById("carrito-total").textContent = total.toFixed(2);
}

// Actualizar cantidad
window.updateQuantity = function(id, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let product = cart.find(item => item.id === id);

  if (product) {
    product.quantity += change;
    if (product.quantity <= 0) {
      cart = cart.filter(item => item.id !== id);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
};

// Eliminar del carrito
window.removeFromCart = function(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
};

// Abrir carrito
function openCart() {
  document.getElementById('cart-sidebar').classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Cerrar carrito
function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('active');
  document.getElementById('cart-overlay').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Vaciar carrito
function clearCart() {
  if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
    localStorage.removeItem("cart");
    updateCartUI();
  }
}

// Realizar compra
function realizarCompra() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("modal-total").textContent = total.toFixed(2);

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("compraExitosaModal"));
  modal.show();

  // Limpiar carrito
  localStorage.removeItem("cart");
  updateCartUI();
  closeCart();
}

// Efectos de scroll para el header
window.addEventListener('scroll', () => {
  const header = document.querySelector('.modern-header');
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Responsive: cerrar carrito al cambiar tamaño de ventana
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeCart();
  }
});