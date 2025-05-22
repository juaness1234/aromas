 document.addEventListener('DOMContentLoaded', function() {
            
            const concentrationFilters = document.querySelectorAll('.concentration-filter');
            const brandFilters = document.querySelectorAll('.brand-filter');
            const sortSelect = document.getElementById('sort-select');
            const productsContainer = document.getElementById('products-container');
            const productCards = document.querySelectorAll('.product-card');
            const noResultsMessage = document.querySelector('.no-results');

           
            function applyFilters() {
                
                const selectedConcentrations = Array.from(concentrationFilters)
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);

               
                const selectedBrands = Array.from(brandFilters)
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);

                let visibleProducts = 0;

                
                productCards.forEach(card => {
                    const concentration = card.getAttribute('data-concentration');
                    const brand = card.getAttribute('data-brand');

                  
                    const concentrationMatch = selectedConcentrations.length === 0 || selectedConcentrations.includes(concentration);
                    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(brand);

                    if (concentrationMatch && brandMatch) {
                        card.classList.remove('hidden');
                        visibleProducts++;
                    } else {
                        card.classList.add('hidden');
                    }
                });

                
                if (visibleProducts === 0) {
                    noResultsMessage.style.display = 'block';
                } else {
                    noResultsMessage.style.display = 'none';
                }

                
                sortProducts();
            }

           
            function sortProducts() {
                const sortValue = sortSelect.value;
                const container = document.getElementById('products-container');
                const products = Array.from(document.querySelectorAll('.product-card:not(.hidden)'));

                products.sort((a, b) => {
                    switch (sortValue) {
                        case 'price-asc':
                            return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
                        case 'price-desc':
                            return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
                        case 'name-asc':
                            return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                        case 'popular':
                        default:
                            return parseInt(a.getAttribute('data-popularity')) - parseInt(b.getAttribute('data-popularity'));
                    }
                });

                
                products.forEach(product => {
                    container.appendChild(product);
                });
            }

            
            concentrationFilters.forEach(filter => {
                filter.addEventListener('change', applyFilters);
            });

            brandFilters.forEach(filter => {
                filter.addEventListener('change', applyFilters);
            });

            sortSelect.addEventListener('change', sortProducts);

            
            applyFilters();
        });