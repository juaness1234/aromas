
        document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.querySelector('#productCarousel');
            if (carousel) {
                const carouselInstance = new bootstrap.Carousel(carousel);
                carousel.addEventListener('mouseenter', function() {
                    carouselInstance.pause();
                });
                carousel.addEventListener('mouseleave', function() {
                    carouselInstance.cycle();
                });
            }

            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

            const cartCountElement = document.getElementById('cart-count');
            const cartItemsContainer = document.getElementById('cart-items');
            const cartTotalElement = document.getElementById('cart-total');
            const checkoutButton = document.getElementById('checkout-button');

            function updateCartCount() {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCountElement.textContent = totalItems;
            }

            function saveCart() {
                localStorage.setItem('shoppingCart', JSON.stringify(cart));
            }

            function formatPrice(price) {
                return `$${price.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            }

            function renderCart() {
                cartItemsContainer.innerHTML = '';
                let totalCartPrice = 0;

                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = '<tr><td colspan="5" class="text-center">El carrito está vacío.</td></tr>';
                } else {
                    cart.forEach((item, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>
                                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                                ${item.name}
                            </td>
                            <td>${formatPrice(item.price)}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-index="${index}">-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary increase-quantity" data-index="${index}">+</button>
                                </div>
                            </td>
                            <td>${formatPrice(item.price * item.quantity)}</td>
                            <td><button class="btn btn-danger btn-sm remove-from-cart" data-index="${index}">Eliminar</button></td>
                        `;
                        cartItemsContainer.appendChild(row);
                        totalCartPrice += item.price * item.quantity;
                    });
                }
                cartTotalElement.textContent = formatPrice(totalCartPrice);
                updateCartCount();
                saveCart();
            }

            
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const name = this.dataset.name;
                    const price = parseFloat(this.dataset.price);
                    const image = this.dataset.image;

                    const existingItem = cart.find(item => item.name === name);

                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push({ name, price, image, quantity: 1 });
                    }
                    renderCart();
                    alert(`${name} ha sido añadido al carrito.`);
                });
            });

            
            cartItemsContainer.addEventListener('click', function(event) {
                const target = event.target;
                if (target.classList.contains('remove-from-cart')) {
                    const index = target.dataset.index;
                    cart.splice(index, 1);
                    renderCart();
                } else if (target.classList.contains('increase-quantity')) {
                    const index = target.dataset.index;
                    cart[index].quantity++;
                    renderCart();
                } else if (target.classList.contains('decrease-quantity')) {
                    const index = target.dataset.index;
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                    } else {
                        cart.splice(index, 1); 
                    }
                    renderCart();
                }
            });

            
            if (checkoutButton) {
                checkoutButton.addEventListener('click', function() {
                    if (cart.length > 0) {
                        alert('¡Gracias por tu compra! Procesando tu pedido.');
                        
                        cart = []; 
                        renderCart();
                        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
                        if (cartModal) {
                            cartModal.hide();
                        }
                    } else {
                        alert('Tu carrito está vacío. Por favor, añade productos antes de proceder al pago.');
                    }
                });
            }

           
            updateCartCount();
            
            const cartModalElement = document.getElementById('cartModal');
            if (cartModalElement) {
                cartModalElement.addEventListener('show.bs.modal', renderCart);
            }
        });
   