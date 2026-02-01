import React from 'react';
import ProductCard from './ProductCard';
import './ListProducts.css';

const ListProducts = ({ products, onAddToCart, selectedGender, selectedCategory, onGenderChange }) => {
  // Filtrar productos según género y categoría
  const filteredProducts = products.filter(product => {
    const genderMatch = selectedGender === 'todos' || product.gender === selectedGender;
    const categoryMatch = selectedCategory === 'todos' || product.category === selectedCategory;
    return genderMatch && categoryMatch;
  });

  return (
    <div className="list-products">
      <h2 className="products-title">Nuestros Productos</h2>

      {filteredProducts.length === 0 ? (
        <div className="no-products-message">
          <p>No hay productos disponibles con estos filtros.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListProducts;

