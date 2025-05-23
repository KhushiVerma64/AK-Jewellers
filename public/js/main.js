// Example: show alert on add to cart
document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Added to cart!');
    });
  });
});
