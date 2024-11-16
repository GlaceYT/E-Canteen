import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, storeData } from '../utils/AsyncStorageUtils';

interface MenuItem {
    id: string;
    name: string;
    category: string;
    price: number;
    discountedPrice?: number; 
    image: string | null;
    available: boolean;
    veg: boolean;
    description: string;
    tag: string | null;
  }
  

interface CartItem {
  item: MenuItem;
  quantity: number;
}
// Define the type for each item in an order
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

// Define the type for an order
interface Order {
  id: string;
  email: string | null;
  items: OrderItem[];
  status: 'Received' | 'Preparing' | 'Finished';
  total: number;
}

interface CartContextType {
  cart: CartItem[];
  favorites: string[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (item: MenuItem) => void;
  decreaseQuantity: (item: MenuItem) => void;
  toggleFavorite: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadCart();
    loadFavorites();
  }, []);

  const loadCart = async () => {
    const cartItems = await getData('cart');
    setCart(cartItems || []);
  };

  const loadFavorites = async () => {
    const favItems = await getData('favorites');
    setFavorites(favItems || []);
  };

  const updateCartInStorage = async (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    await storeData('cart', updatedCart);
  };

  const addToCart = async (item: MenuItem) => {
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(cartItem => cartItem.item.id === item.id);

    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart.push({ item, quantity: 1 });
    }
    await updateCartInStorage(updatedCart);
  };

  const increaseQuantity = async (item: MenuItem) => addToCart(item);

  const decreaseQuantity = async (item: MenuItem) => {
    const updatedCart = cart
      .map(cartItem =>
        cartItem.item.id === item.id && cartItem.quantity > 1
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
      .filter(cartItem => cartItem.quantity > 0);
    await updateCartInStorage(updatedCart);
  };

  const removeFromCart = async (id: string) => {
    const updatedCart = cart.filter(cartItem => cartItem.item.id !== id);
    await updateCartInStorage(updatedCart);
  };

  const toggleFavorite = async (itemId: string) => {
    const updatedFavorites = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
    setFavorites(updatedFavorites);
    await storeData('favorites', updatedFavorites);
  };

  const clearCart = async () => {
    setCart([]);
    await storeData('cart', []);
  };

  return (
    <CartContext.Provider value={{ cart, favorites, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, toggleFavorite, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
