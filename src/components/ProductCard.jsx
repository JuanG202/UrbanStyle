import React from 'react';
import './ProductCard.css';
import { formatCOP } from '../currency';

const ProductCard = ({ product, onAddToCart }) => {

  return (

    <div className="product-card">

      <div className="product-image-container">

        <img 
          src={product.image || "https://dummyimage.com/300x300/cccccc/000000&text=G2+Urban+Style"} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://dummyimage.com/300x300/cccccc/000000&text=G2+Urban+Style";
          }}
        />

      </div>

      <div className="product-info">

        <h3 className="product-name">{product.name}</h3>

        <p className="product-description">{product.description}</p>

        <div className="product-footer">

          <span className="product-price">
            {formatCOP(product.price)}
          </span>

          <button 
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            Añadir al Carrito
          </button>

        </div>

      </div>

    </div>

  );

};

export default ProductCard;