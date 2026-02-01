import React from 'react';
import './Cart.css';
import { formatCOP } from '../currency';

const Cart = ({ cartItems, onRemoveItem, onUpdateQuantity, onFinalizePurchase }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleFinalize = () => {
    onFinalizePurchase(cartItems, total);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Carrito de Compras</h2>
      
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Tu carrito está vacío</p>
          <p className="cart-empty-subtitle">¡Añade algunos productos para comenzar!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="cart-item-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=G2+Urban+Style';
                  }}
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">{formatCOP(item.price)}</p>
                </div>
                <div className="cart-item-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="cart-item-quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  <p>{formatCOP(item.price * item.quantity)}</p>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label="Eliminar producto"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-total">
              <span className="total-label">Total:</span>
              <span className="total-amount">{formatCOP(total)}</span>
            </div>
            <button 
              className="finalize-btn"
              onClick={handleFinalize}
            >
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

