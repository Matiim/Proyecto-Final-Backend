const addToCartButtons = document.querySelectorAll('.addToCartButton');

addToCartButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
        const userId = e.target.getAttribute('data-user-id');
        const cartId = e.target.getAttribute('data-cart-id');
        const productId = e.target.getAttribute('data-product-id');
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            body: JSON.stringify({
                userId
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json()

        if (response.ok) {
            Swal.fire({
                text: 'Producto agregado al carrito',
                icon: 'success'
            });
        } else {
            Swal.fire({
                title: 'Error',
				text: 'Error al agregar al carrito',
                icon: 'error',
            });
        }
    });
});