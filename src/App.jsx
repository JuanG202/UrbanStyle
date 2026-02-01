import React, { useState, useEffect } from 'react';
import ListProducts from './components/ListProducts';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import './App.css';
import { formatCOP } from './currency';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminProducts, setAdminProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedGender, setSelectedGender] = useState('todos');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [openDropdown, setOpenDropdown] = useState(null);

  // Cargar productos del admin desde localStorage
  useEffect(() => {
    const loadAdminProducts = () => {
      const savedAdminProducts = localStorage.getItem('adminProducts');
      if (savedAdminProducts) {
        try {
          const parsed = JSON.parse(savedAdminProducts);
          if (Array.isArray(parsed)) {
            const productsWithGender = parsed.map(p => ({
              ...p,
              gender: p.gender || 'hombre'
            }));
            setAdminProducts(productsWithGender);
            return;
          }
        } catch (error) {
          console.error('Error al cargar productos del admin:', error);
        }
      }
      setAdminProducts([]);
    };

    loadAdminProducts();
  }, []);

  // Usar solo productos del admin (sin productos mock)
  useEffect(() => {
    setAllProducts(adminProducts);
  }, [adminProducts]);

  // Atajo secreto Shift + A para abrir el panel Admin
  useEffect(() => {
    const handleSecretKey = (event) => {
      if (event.shiftKey && event.key.toLowerCase() === 'a') {
        setShowAdmin(true);
      }
    };

    window.addEventListener('keydown', handleSecretKey);
    return () => window.removeEventListener('keydown', handleSecretKey);
  }, []);

  // Manejo de admin
  const handleAdminClick = () => {
    if (!isAdminAuthenticated) {
      setShowAdmin(true);
    } else {
      setShowAdmin(!showAdmin);
      setShowCart(false);
    }
  };

  const handleAdminLogin = (authenticated) => {
    setIsAdminAuthenticated(authenticated);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdmin(false);
  };

  const handleAdminProductsChange = (products) => {
    const productsWithGender = products.map(p => ({
      ...p,
      gender: p.gender || 'hombre'
    }));

    setAdminProducts(productsWithGender);

    try {
      localStorage.setItem('adminProducts', JSON.stringify(productsWithGender));
    } catch (error) {
      console.error('Error al guardar productos:', error);
    }
  };

  // Carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const finalizePurchase = (items, total) => {
    let message = `¡Hola! Quiero realizar una compra en G2 Urban Style:\n\n`;

    items.forEach((item) => {
      message += `• ${item.name} x${item.quantity} - ${formatCOP(item.price * item.quantity)}\n`;
    });

    message += `\nTotal: ${formatCOP(total)}\n\n`;
    message += `Por favor, confirma la disponibilidad y el método de pago.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '573046640221';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Categorías por género
  const getCategoriesByGender = (gender) => {
    if (gender === 'hombre') {
      return [
        { value: 'todos', label: 'Ver Todo' },
        { value: 'camisetas', label: 'Camisetas' },
        { value: 'gorras', label: 'Gorras' },
        { value: 'zapatillas', label: 'Zapatillas' }
      ];
    } else if (gender === 'mujer') {
      return [
        { value: 'todos', label: 'Ver Todo' },
        { value: 'blusas', label: 'Blusas' },
        { value: 'gorras', label: 'Gorras'},
        { value: 'zapatillas', label: 'Zapatillas' }
      ];
    }
    return [];
  };

  const handleGenderClick = (gender) => {
    if (openDropdown === gender) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(gender);
      setSelectedGender(gender);
      setSelectedCategory('todos');
    }
  };

  const handleCategorySelect = (gender, category) => {
    setSelectedGender(gender);
    setSelectedCategory(category);
    setOpenDropdown(null);
  };

  const handleTodosClick = () => {
    setSelectedGender('todos');
    setSelectedCategory('todos');
    setOpenDropdown(null);
  };

  // Cerrar dropdown al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.gender-dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <img 
              src={"/src/assests/urban style.png"} 
              alt="G2 Urban Style Logo" 
              className="header-logo" 
            />
            <h1 className="logo">G2 Urban Style</h1>
          </div>

          {!showAdmin && !showCart && (
            <div className="gender-filters">
              <button
                className={`gender-filter-btn ${selectedGender === 'todos' ? 'active' : ''}`}
                onClick={handleTodosClick}
              >
                Todos
              </button>

              <div className="gender-dropdown-container">
                <button
                  className={`gender-filter-btn ${selectedGender === 'hombre' ? 'active' : ''}`}
                  onClick={() => handleGenderClick('hombre')}
                >
                  👔 Hombre {openDropdown === 'hombre' ? '▼' : '▶'}
                </button>
                {openDropdown === 'hombre' && (
                  <div className="gender-dropdown">
                    {getCategoriesByGender('hombre').map(category => (
                      <button
                        key={category.value}
                        className={`dropdown-item ${selectedCategory === category.value && selectedGender === 'hombre' ? 'active' : ''}`}
                        onClick={() => handleCategorySelect('hombre', category.value)}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="gender-dropdown-container">
                <button
                  className={`gender-filter-btn ${selectedGender === 'mujer' ? 'active' : ''}`}
                  onClick={() => handleGenderClick('mujer')}
                >
                  👗 Mujer {openDropdown === 'mujer' ? '▼' : '▶'}
                </button>
                {openDropdown === 'mujer' && (
                  <div className="gender-dropdown">
                    {getCategoriesByGender('mujer').map(category => (
                      <button
                        key={category.value}
                        className={`dropdown-item ${selectedCategory === category.value && selectedGender === 'mujer' ? 'active' : ''}`}
                        onClick={() => handleCategorySelect('mujer', category.value)}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="header-buttons">
       
            <button 
              className="admin-button"
              onClick={handleAdminClick}
            >
              {showAdmin && isAdminAuthenticated ? '🏪 Tienda' : '⚙️ Admin'}
            </button>
            <button 
              className="cart-button"
              onClick={() => {
                setShowCart(!showCart);
                setShowAdmin(false);
              }}
            >
              <span className="cart-icon">🛒</span>
              <span className="cart-badge">{cartItemCount}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {showAdmin ? (
          isAdminAuthenticated ? (
            <div>
              <div className="admin-header-controls">
                <button className="logout-btn" onClick={handleAdminLogout}>
                  Cerrar Sesión
                </button>
              </div>
              <AdminPanel onProductsChange={handleAdminProductsChange} />
            </div>
          ) : (
            <AdminLogin onLogin={handleAdminLogin} />
          )
        ) : showCart ? (
          <Cart
            cartItems={cartItems}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onFinalizePurchase={finalizePurchase}
          />
        ) : (
          <ListProducts 
            products={allProducts} 
            onAddToCart={addToCart}
            selectedGender={selectedGender}
            selectedCategory={selectedCategory}
            onGenderChange={setSelectedGender}
          />
        )}
      </main>

      <footer className="app-footer">
         <p>&copy; 2026 G2 Urban Style. Todos los derechos reservado<a  onClick={handleAdminClick}>s</a>.</p>
      </footer>
    </div>
  );
}

export default App;
