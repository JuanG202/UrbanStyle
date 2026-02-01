import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { formatCOP, formatCOPInput, parseCOPInput } from '../currency';

const AdminPanel = ({ onProductsChange }) => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'camisetas',
    gender: 'hombre'
  });

  // Cargar productos del localStorage al montar (solo una vez)
  useEffect(() => {
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          if (onProductsChange) {
            onProductsChange(parsed);
          }
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    if (products.length >= 0) { // Guardar incluso si está vacío para mantener consistencia
      try {
        localStorage.setItem('adminProducts', JSON.stringify(products));
        if (onProductsChange) {
          onProductsChange(products);
        }
      } catch (error) {
        console.error('Error al guardar productos:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]); // Solo depende de products

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (e) => {
    const digits = parseCOPInput(e.target.value);
    setFormData(prev => ({
      ...prev,
      price: digits,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const priceNumber = Number(formData.price || 0);
    
    if (editingProduct) {
      // Editar producto existente
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...editingProduct, ...formData, price: priceNumber }
          : p
      );
      setProducts(updatedProducts);
      // Guardar inmediatamente en localStorage
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
      if (onProductsChange) {
        onProductsChange(updatedProducts);
      }
      setEditingProduct(null);
    } else {
      // Agregar nuevo producto
      const newProduct = {
        id: Date.now() + Math.random(), // ID único basado en timestamp + random para evitar duplicados
        ...formData,
        price: priceNumber
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      // Guardar inmediatamente en localStorage
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
      if (onProductsChange) {
        onProductsChange(updatedProducts);
      }
    }

    // Resetear formulario
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'camisetas',
      gender: 'hombre'
    });
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const normalizedPrice = Number.isFinite(Number(product.price)) ? String(Math.round(Number(product.price))) : '';
    setFormData({
      name: product.name,
      description: product.description,
      price: normalizedPrice,
      image: product.image,
      category: product.category,
      gender: product.gender || 'hombre'
    });
    setShowForm(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      // Guardar inmediatamente en localStorage
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
      if (onProductsChange) {
        onProductsChange(updatedProducts);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'camisetas',
      gender: 'hombre'
    });
    setShowForm(false);
    setEditingProduct(null);
  };

  // Obtener categorías disponibles según el género
  const getCategoriesByGender = (gender) => {
    if (gender === 'hombre') {
      return [
        { value: 'camisetas', label: 'Camisetas' },
        { value: 'gorras', label: 'Gorras' },
        { value: 'zapatillas', label: 'Zapatillas' }
      ];
    } else {
      return [
        { value: 'blusas', label: 'Blusas' },
        { value: 'gorras', label: 'Gorras' },
        { value: 'zapatillas', label: 'Zapatillas' }
      ];
    }
  };

  const availableCategories = getCategoriesByGender(formData.gender);

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <button 
          className="add-product-btn"
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              image: '',
              category: 'camisetas',
              gender: 'hombre'
            });
          }}
        >
          + Agregar Producto
        </button>
      </div>

      {showForm && (
        <div className="admin-form-container">
          <form className="admin-form" onSubmit={handleSubmit}>
            <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            
            <div className="form-group">
              <label>Nombre del Producto</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ej: Camiseta Premium"
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Describe el producto..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Género</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => {
                    handleInputChange(e);
                    // Resetear categoría cuando cambia el género
                    setFormData(prev => ({
                      ...prev,
                      gender: e.target.value,
                      category: e.target.value === 'hombre' ? 'camisetas' : 'blusas'
                    }));
                  }}
                  required
                >
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                </select>
              </div>

              <div className="form-group">
                <label>Precio (COP)</label>
                <input
                  type="text"
                  name="price"
                  value={formatCOPInput(formData.price)}
                  onChange={handlePriceChange}
                  required
                  inputMode="numeric"
                  pattern="[0-9.]*"
                  placeholder="45.000"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {availableCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Imagen del Producto</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="O pega la URL de la imagen"
                  className="url-input"
                />
              </div>
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
              </button>
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-list-admin">
        <h3>Productos Agregados ({products.length})</h3>
        {products.length === 0 ? (
          <p className="no-products">No hay productos agregados aún. ¡Agrega tu primer producto!</p>
        ) : (
          <div className="admin-products-grid">
            {products.map((product) => (
              <div key={product.id} className="admin-product-card">
                <img 
                  src={product.image || 'https://via.placeholder.com/200x200?text=Sin+Imagen'} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=Error+Imagen';
                  }}
                />
                <div className="admin-product-info">
                  <h4>{product.name}</h4>
                  <p className="admin-product-category">
                    {product.gender === 'hombre' ? '👔' : '👗'} {product.gender} - {product.category}
                  </p>
                  <p className="admin-product-price">{formatCOP(product.price)}</p>
                </div>
                <div className="admin-product-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

