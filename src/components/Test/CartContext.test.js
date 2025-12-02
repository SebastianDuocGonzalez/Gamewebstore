import React from 'react';
import { createRoot } from 'react-dom/client'; // NUEVO: Importación correcta para React 18
import { act } from 'react'; // NUEVO: 'act' ahora viene de 'react'
import { CartProvider, useCart } from '../../contexts/CartContext';

const TestConsumer = () => {
  const { items, addToCart, total, clearCart, updateQuantity } = useCart();
  return (
    <div>
      <div id="total">{total}</div>
      <div id="count">{items.length}</div>
      <button id="add-btn" onClick={() => addToCart({ id: 1, nombre: 'Juego 1', precio: 1000 })}>
        Agregar
      </button>
      <button id="clear-btn" onClick={clearCart}>Limpiar</button>
      <button id="update-btn" onClick={() => updateQuantity(1, 5)}>Actualizar</button>
    </div>
  );
};

describe('CartContext', () => {
  let container;
  let root; // NUEVO: Necesitamos guardar la referencia al root

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.clear();
    // En React 18 inicializamos el root una vez
    root = createRoot(container);
  });

  afterEach(() => {
    // Desmontamos y limpiamos
    act(() => {
      root.unmount();
    });
    document.body.removeChild(container);
    container = null;
    root = null;
  });

  it('debería agregar items y calcular el total correctamente', async () => {
    // 1. Renderizar con createRoot
    await act(async () => {
      root.render(
        <CartProvider>
          <TestConsumer />
        </CartProvider>
      );
    });

    const addBtn = container.querySelector('#add-btn');
    
    // 2. Agregar un producto
    await act(async () => {
      addBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    // 3. Verificar (rebuscamos los elementos porque el DOM cambia)
    const totalDiv = container.querySelector('#total');
    const countDiv = container.querySelector('#count');

    expect(totalDiv.textContent).toBe('1000');
    expect(countDiv.textContent).toBe('1');
  });

  it('debería persistir datos en localStorage', async () => {
    await act(async () => {
      root.render(
        <CartProvider>
          <TestConsumer />
        </CartProvider>
      );
    });

    const addBtn = container.querySelector('#add-btn');
    await act(async () => {
      addBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const storedCart = JSON.parse(localStorage.getItem('gamezone-cart'));
    expect(storedCart).not.toBeNull();
    expect(storedCart[0].id).toBe(1);
  });
});