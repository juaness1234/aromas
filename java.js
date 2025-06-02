
        document.addEventListener('DOMContentLoaded', function() {
            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

            const cartCountElement = document.getElementById('cart-count');
            const cartItemsContainer = document.getElementById('cart-items');
            const cartTotalElement = document.getElementById('cart-total');
            const checkoutButton = document.getElementById('checkout-button');
            const productsContainer = document.getElementById('products-container');
            const concentrationFilters = document.querySelectorAll('.concentration-filter');
            const brandFilters = document.querySelectorAll('.brand-filter');
            const sortSelect = document.getElementById('sort-select');
            const noResultsMessage = document.querySelector('.no-results');

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
                if (event.target.classList.contains('remove-from-cart')) {
                    const index = parseInt(event.target.dataset.index);
                    cart.splice(index, 1);
                    renderCart();
                } else if (event.target.classList.contains('increase-quantity')) {
                    const index = parseInt(event.target.dataset.index);
                    cart[index].quantity++;
                    renderCart();
                } else if (event.target.classList.contains('decrease-quantity')) {
                    const index = parseInt(event.target.dataset.index);
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                    } else {
                        cart.splice(index, 1); 
                    }
                    renderCart();
                }
            });

           
            checkoutButton.addEventListener('click', function() {
                if (cart.length > 0) {
                    alert('Procediendo al pago. Total: ' + cartTotalElement.textContent);
                    
                    cart = []; 
                    renderCart();
                    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
                    if (cartModal) {
                        cartModal.hide();
                    }
                } else {
                    alert('Tu carrito está vacío. Añade productos antes de proceder al pago.');
                }
            });

            
            function filterAndSortProducts() {
                const selectedConcentrations = Array.from(concentrationFilters)
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);

                const selectedBrands = Array.from(brandFilters)
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);

                const sortBy = sortSelect.value;

                let visibleProductsCount = 0;

                document.querySelectorAll('.product-card').forEach(card => {
                    const concentration = card.dataset.concentration;
                    const brand = card.dataset.brand;

                    const matchesConcentration = selectedConcentrations.length === 0 || selectedConcentrations.includes(concentration);
                    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(brand);

                    if (matchesConcentration && matchesBrand) {
                        card.style.display = 'block';
                        visibleProductsCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (visibleProductsCount === 0) {
                    noResultsMessage.style.display = 'block';
                } else {
                    noResultsMessage.style.display = 'none';
                }

                sortProducts(sortBy);
            }

            function sortProducts(sortBy) {
                const productCards = Array.from(productsContainer.children);

                productCards.sort((a, b) => {
                    if (a.style.display === 'none' && b.style.display !== 'none') return 1;
                    if (a.style.display !== 'none' && b.style.display === 'none') return -1;
                    if (a.style.display === 'none' && b.style.display === 'none') return 0;

                    const priceA = parseFloat(a.dataset.price);
                    const priceB = parseFloat(b.dataset.price);
                    const nameA = a.querySelector('.card-title').textContent.toUpperCase();
                    const nameB = b.querySelector('.card-title').textContent.toUpperCase();
                    const popularityA = parseInt(a.dataset.popularity);
                    const popularityB = parseInt(b.dataset.popularity);

                    if (sortBy === 'price-asc') {
                        return priceA - priceB;
                    } else if (sortBy === 'price-desc') {
                        return priceB - priceA;
                    } else if (sortBy === 'name-asc') {
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    } else if (sortBy === 'popular') {
                        return popularityA - popularityB;
                    }
                    return 0;
                });

                productCards.forEach(card => productsContainer.appendChild(card));
            }

            
            concentrationFilters.forEach(checkbox => {
                checkbox.addEventListener('change', filterAndSortProducts);
            });
            brandFilters.forEach(checkbox => {
                checkbox.addEventListener('change', filterAndSortProducts);
            });
            sortSelect.addEventListener('change', filterAndSortProducts);

            
            renderCart();
            filterAndSortProducts(); 
        });
    